terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    null = {
      source  = "hashicorp/null"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC for jumphost
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name    = "${var.project_tag}-vpc"
    Project = var.project_tag
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name    = "${var.project_tag}-igw"
    Project = var.project_tag
  }
}

# Public Subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidr
  availability_zone       = var.availability_zone
  map_public_ip_on_launch = true

  tags = {
    Name    = "${var.project_tag}-public-subnet"
    Project = var.project_tag
  }
}

# Route Table for Public Subnet
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name    = "${var.project_tag}-public-rt"
    Project = var.project_tag
  }
}

# Route Table Association
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Security Group for Jumphost
resource "aws_security_group" "jumphost" {
  name        = "${var.project_tag}-jumphost-sg"
  description = "Security group for jumphost EC2 instance"
  vpc_id      = aws_vpc.main.id

  # SSH access
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH access"
  }

  # HTTP access (for testing)
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP access"
  }

  # HTTPS access (for testing)
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS access"
  }

  # Outbound internet access
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound"
  }

  tags = {
    Name    = "${var.project_tag}-jumphost-sg"
    Project = var.project_tag
  }
}

# IAM Role for EC2 (SSM access)
resource "aws_iam_role" "jumphost" {
  name = "${var.project_tag}-jumphost-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name    = "${var.project_tag}-jumphost-role"
    Project = var.project_tag
  }
}

# Attach SSM policy for Session Manager access
resource "aws_iam_role_policy_attachment" "jumphost_ssm" {
  role       = aws_iam_role.jumphost.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# IAM Instance Profile
resource "aws_iam_instance_profile" "jumphost" {
  name = "${var.project_tag}-jumphost-profile"
  role = aws_iam_role.jumphost.name

  tags = {
    Name    = "${var.project_tag}-jumphost-profile"
    Project = var.project_tag
  }
}

# Get latest Amazon Linux 2023 AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# EC2 Jumphost Instance
resource "aws_instance" "jumphost" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.jumphost_instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.jumphost.id]
  iam_instance_profile   = aws_iam_instance_profile.jumphost.name

  user_data = <<-EOF
              #!/bin/bash
              # Update system
              yum update -y
              
              # Install useful tools
              yum install -y curl wget git htop
              
              # Create info file with CloudFront URL
              cat > /home/ec2-user/website-info.txt <<'INFO'
              ========================================
              Lunar Calendar Website Information
              ========================================
              
              CloudFront URL: ${aws_cloudfront_distribution.website.domain_name}
              S3 Bucket: ${aws_s3_bucket.website.id}
              Private DNS: learnbazi.com (resolves to CloudFront)
              
              To test the website:
              curl https://${aws_cloudfront_distribution.website.domain_name}
              curl https://learnbazi.com
              
              Or open in browser using Session Manager port forwarding.
              ========================================
              INFO
              
              chown ec2-user:ec2-user /home/ec2-user/website-info.txt
              
              # Create a simple test script
              cat > /home/ec2-user/test-website.sh <<'SCRIPT'
              #!/bin/bash
              echo "Testing CloudFront URL..."
              curl -I https://${aws_cloudfront_distribution.website.domain_name}
              echo ""
              echo "Testing Private DNS (learnbazi.com)..."
              curl -I https://learnbazi.com
              SCRIPT
              
              chmod +x /home/ec2-user/test-website.sh
              chown ec2-user:ec2-user /home/ec2-user/test-website.sh
              EOF

  tags = {
    Name    = "${var.project_tag}-jumphost"
    Project = var.project_tag
  }

  depends_on = [aws_cloudfront_distribution.website]
}

# Private Route53 Hosted Zone
resource "aws_route53_zone" "private" {
  name = var.domain_name

  vpc {
    vpc_id = aws_vpc.main.id
  }

  tags = {
    Name    = "${var.project_tag}-private-zone"
    Project = var.project_tag
  }
}

# Route53 A Record pointing to CloudFront (using ALIAS)
resource "aws_route53_record" "website" {
  zone_id = aws_route53_zone.private.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.website.domain_name
    zone_id                = aws_cloudfront_distribution.website.hosted_zone_id
    evaluate_target_health = false
  }
}

# Route53 CNAME Record for www
resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.private.zone_id
  name    = "www.${var.domain_name}"
  type    = "CNAME"
  ttl     = 300
  records = [aws_cloudfront_distribution.website.domain_name]
}

# S3 bucket for static website hosting
resource "aws_s3_bucket" "website" {
  bucket = "${var.project_tag}-website-${var.bucket_suffix}"

  tags = {
    Name    = "${var.project_tag}-website"
    Project = var.project_tag
  }
}

resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

# CloudFront Origin Access Control
resource "aws_cloudfront_origin_access_control" "website" {
  name                              = "${var.project_tag}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "website" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"
  comment             = "${var.project_tag} - Lunar Calendar App"

  origin {
    domain_name              = aws_s3_bucket.website.bucket_regional_domain_name
    origin_id                = "S3-${var.project_tag}"
    origin_access_control_id = aws_cloudfront_origin_access_control.website.id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.project_tag}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  # Custom error response for SPA routing
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name    = "${var.project_tag}-cdn"
    Project = var.project_tag
  }
}

# S3 bucket policy to allow CloudFront access
resource "aws_s3_bucket_policy" "website" {
  bucket = aws_s3_bucket.website.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.website.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.website.arn
          }
        }
      }
    ]
  })
}

# Null resource to build and deploy the React app
resource "null_resource" "build_and_deploy" {
  # Trigger rebuild on every apply
  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = <<-EOT
      echo "=========================================="
      echo "Building React application..."
      echo "=========================================="
      
      # Navigate to project root
      cd ..
      
      # Check if node_modules exists, if not install dependencies
      if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm ci
      fi
      
      # Build the application
      echo "Running production build..."
      npm run build
      
      echo "=========================================="
      echo "Deploying to S3..."
      echo "=========================================="
      
      # Sync build files to S3 with cache headers
      # Assets (JS, CSS, images) - cache for 1 year
      aws s3 sync dist/ s3://${aws_s3_bucket.website.id} \
        --delete \
        --cache-control "public, max-age=31536000, immutable" \
        --exclude "*.html" \
        --exclude "index.html"
      
      # HTML files - no cache for instant updates
      aws s3 sync dist/ s3://${aws_s3_bucket.website.id} \
        --exclude "*" \
        --include "*.html" \
        --cache-control "public, max-age=0, must-revalidate"
      
      echo "=========================================="
      echo "Invalidating CloudFront cache..."
      echo "=========================================="
      
      # Invalidate CloudFront cache
      aws cloudfront create-invalidation \
        --distribution-id ${aws_cloudfront_distribution.website.id} \
        --paths "/*" \
        --no-cli-pager
      
      echo "=========================================="
      echo "✅ Deployment complete!"
      echo "=========================================="
    EOT

    interpreter = ["bash", "-c"]
  }

  depends_on = [
    aws_s3_bucket.website,
    aws_s3_bucket_policy.website,
    aws_cloudfront_distribution.website
  ]
}

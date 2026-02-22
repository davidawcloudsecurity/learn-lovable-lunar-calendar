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

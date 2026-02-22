# Lunar Calendar - Serverless AWS Infrastructure
# Optimized for static React/Vite SPA with CloudFront + S3

terraform {
  required_version = ">= 1.0"
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

# Null resource to build the application
resource "null_resource" "build_app" {
  # Trigger rebuild when source files change
  triggers = {
    package_json = filemd5("${path.module}/../package.json")
    src_hash     = sha256(join("", [for f in fileset("${path.module}/../src", "**") : filemd5("${path.module}/../src/${f}")]))
    always_run   = timestamp()
  }

  # Build the application
  provisioner "local-exec" {
    command     = var.build_command
    working_dir = "${path.module}/.."
  }
}

# S3 bucket for static website hosting
resource "aws_s3_bucket" "website" {
  bucket = var.bucket_name
  
  tags = {
    Name        = "${var.project_tag}-website"
    Environment = var.environment
  }

  depends_on = [null_resource.build_app]
}

# S3 bucket public access block - KEEP BUCKET PRIVATE
resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# CloudFront Origin Access Control (OAC) - Modern secure method
resource "aws_cloudfront_origin_access_control" "website" {
  name                              = "${var.project_tag}-oac"
  description                       = "OAC for ${var.project_tag}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# S3 bucket policy - Allow CloudFront OAC access only
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

  depends_on = [
    aws_s3_bucket_public_access_block.website,
    aws_cloudfront_distribution.website
  ]
}

# CloudFront distribution
resource "aws_cloudfront_distribution" "website" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = var.cloudfront_price_class
  comment             = "${var.project_tag} - Lunar Calendar"
  
  # Custom domain aliases (optional)
  aliases = var.domain_names

  origin {
    domain_name              = aws_s3_bucket.website.bucket_regional_domain_name
    origin_id                = "S3-${var.bucket_name}"
    origin_access_control_id = aws_cloudfront_origin_access_control.website.id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.bucket_name}"

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
    cloudfront_default_certificate = var.domain_names == [] ? true : false
    acm_certificate_arn            = var.domain_names != [] ? var.acm_certificate_arn : null
    ssl_support_method             = var.domain_names != [] ? "sni-only" : null
    minimum_protocol_version       = "TLSv1.2_2021"
  }

  tags = {
    Name        = "${var.project_tag}-cdn"
    Environment = var.environment
  }
}

# Null resource to upload files to S3
resource "null_resource" "upload_to_s3" {
  # Trigger upload when build changes or bucket changes
  triggers = {
    build_hash  = null_resource.build_app.id
    bucket_name = aws_s3_bucket.website.id
  }

  # Upload files to S3
  provisioner "local-exec" {
    command = <<-EOT
      aws s3 sync ${path.module}/../dist/ s3://${aws_s3_bucket.website.id}/ \
        --delete \
        --cache-control "public, max-age=31536000, immutable" \
        --exclude "index.html" && \
      aws s3 cp ${path.module}/../dist/index.html s3://${aws_s3_bucket.website.id}/index.html \
        --cache-control "public, max-age=0, must-revalidate"
    EOT
  }

  depends_on = [
    null_resource.build_app,
    aws_s3_bucket.website,
    aws_s3_bucket_policy.website
  ]
}

# Null resource to invalidate CloudFront cache
resource "null_resource" "invalidate_cloudfront" {
  # Trigger invalidation when files are uploaded
  triggers = {
    upload_hash = null_resource.upload_to_s3.id
  }

  # Invalidate CloudFront cache
  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.website.id} --paths '/*'"
  }

  depends_on = [
    null_resource.upload_to_s3,
    aws_cloudfront_distribution.website
  ]
}

# Route53 DNS records (optional - only if using custom domain)
resource "aws_route53_record" "website" {
  count   = length(var.domain_names) > 0 && var.route53_zone_id != "" ? length(var.domain_names) : 0
  zone_id = var.route53_zone_id
  name    = var.domain_names[count.index]
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.website.domain_name
    zone_id                = aws_cloudfront_distribution.website.hosted_zone_id
    evaluate_target_health = false
  }
}

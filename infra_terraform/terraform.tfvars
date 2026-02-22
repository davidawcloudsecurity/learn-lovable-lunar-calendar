# Terraform Variables Configuration
# Customize these values for your deployment

# AWS Configuration
aws_region = "us-east-1"

# Project Configuration
project_tag = "lunar-calendar"
environment = "prod"

# S3 Bucket Configuration
# IMPORTANT: Must be globally unique across all AWS accounts
# Change this to something unique for your deployment
bucket_name = "lunar-calendar-app-2026"

# CloudFront Configuration
# PriceClass_100: US, Canada, Europe (cheapest)
# PriceClass_200: US, Canada, Europe, Asia, Middle East, Africa
# PriceClass_All: All edge locations (most expensive)
cloudfront_price_class = "PriceClass_100"

# Custom Domain Configuration (Optional)
# Leave empty [] if not using custom domain
domain_names = []

# ACM Certificate ARN (Required only if using custom domain)
# Certificate must be in us-east-1 region for CloudFront
acm_certificate_arn = ""

# Route53 Zone ID (Required only if using custom domain)
route53_zone_id = ""

# Build Configuration
# Command to install dependencies and build the application
build_command = "npm install && npm run build"

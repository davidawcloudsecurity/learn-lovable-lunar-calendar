variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "project_tag" {
  description = "Project name tag"
  type        = string
  default     = "lunar-calendar"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "bucket_name" {
  description = "S3 bucket name for website hosting (must be globally unique)"
  type        = string
  default     = "lunar-calendar-app-2026"
  
  validation {
    condition     = can(regex("^[a-z0-9][a-z0-9-]*[a-z0-9]$", var.bucket_name))
    error_message = "Bucket name must be lowercase alphanumeric with hyphens only."
  }
}

variable "cloudfront_price_class" {
  description = "CloudFront price class (PriceClass_All, PriceClass_200, PriceClass_100)"
  type        = string
  default     = "PriceClass_100"  # US, Canada, Europe - cheapest option
}

variable "domain_names" {
  description = "Custom domain names for CloudFront (e.g., ['example.com', 'www.example.com'])"
  type        = list(string)
  default     = []
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN for custom domain (must be in us-east-1 for CloudFront)"
  type        = string
  default     = ""
}

variable "route53_zone_id" {
  description = "Route53 hosted zone ID for DNS records"
  type        = string
  default     = ""
}

variable "build_command" {
  description = "Command to build the application"
  type        = string
  default     = "npm install && npm run build"
}

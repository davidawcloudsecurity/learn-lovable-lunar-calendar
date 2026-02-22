output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.website.id
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.website.arn
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.website.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.website.domain_name
}

output "website_url" {
  description = "Website URL (CloudFront or custom domain)"
  value       = length(var.domain_names) > 0 ? "https://${var.domain_names[0]}" : "https://${aws_cloudfront_distribution.website.domain_name}"
}

output "deployment_command" {
  description = "Command to deploy your built app to S3"
  value       = "aws s3 sync ./dist s3://${aws_s3_bucket.website.id} --delete"
}

output "cloudfront_invalidation_command" {
  description = "Command to invalidate CloudFront cache after deployment"
  value       = "aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.website.id} --paths '/*'"
}

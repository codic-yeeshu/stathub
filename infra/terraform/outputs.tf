output "artifacts_bucket_name" {
  description = "Name of the artifacts S3 bucket."
  value       = aws_s3_bucket.artifacts.bucket
}

output "artifacts_bucket_arn" {
  description = "ARN of the artifacts S3 bucket."
  value       = aws_s3_bucket.artifacts.arn
}

output "ecr_server_repository_url" {
  description = "URL of the ECR repository for the server image."
  value       = aws_ecr_repository.server.repository_url
}

output "ecr_client_repository_url" {
  description = "URL of the ECR repository for the client image."
  value       = aws_ecr_repository.client.repository_url
}

variable "aws_region" {
  description = "AWS region for all resources."
  type        = string
  default     = "us-east-1"
}

variable "project" {
  description = "Short project identifier used as a prefix in resource names."
  type        = string
  default     = "stathub"
}

variable "environment" {
  description = "Environment name (dev, prod, ...)."
  type        = string
  default     = "dev"
}

variable "bucket_name_prefix" {
  description = "Prefix for the S3 artifacts bucket. A random suffix is appended to make it globally unique."
  type        = string
  default     = "stathub-artifacts"
}

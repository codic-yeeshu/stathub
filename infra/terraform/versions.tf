terraform {
  # 1.10 added native S3 state locking via `use_lockfile`, so we don't need
  # a separate DynamoDB table.
  required_version = ">= 1.10.0"

  # Partial backend config. The bucket / key / region are supplied at init
  # time via `-backend-config=...` so the state bucket name doesn't have to
  # be hard-coded into source.
  backend "s3" {
    encrypt      = true
    use_lockfile = true
  }

  required_providers {
    aws = {
      source = "hashicorp/aws"
      # 6.10+ for `image_tag_mutability_exclusion_filter` on aws_ecr_repository.
      version = "~> 6.10"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

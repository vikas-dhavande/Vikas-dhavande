#!/usr/bin/env bash
# Appwrite S3 Configuration for Bash / Linux / macOS
export AWS_ACCESS_KEY_ID="6ad0f8ab0025a03812f7"
if [ -n "$1" ]; then
  export AWS_SECRET_ACCESS_KEY="$1"
fi
export AWS_DEFAULT_REGION="sfo"
export AWS_ENDPOINT_URL="https://sfo.cloud.appwrite.io/v1/s3"

echo "✓ Appwrite S3 Environment Variables Loaded:"
echo "  AWS_ACCESS_KEY_ID     = $AWS_ACCESS_KEY_ID"
echo "  AWS_DEFAULT_REGION    = $AWS_DEFAULT_REGION"
echo "  AWS_ENDPOINT_URL      = $AWS_ENDPOINT_URL"
if [ -n "$AWS_SECRET_ACCESS_KEY" ]; then
  echo "  AWS_SECRET_ACCESS_KEY = [SET (${#AWS_SECRET_ACCESS_KEY} chars)]"
else
  echo "  AWS_SECRET_ACCESS_KEY = [NOT SET] (Pass as argument: source ./export-s3-env.sh '<API_KEY>')"
fi


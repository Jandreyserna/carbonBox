#!/bin/bash
# LocalStack no persiste los recursos entre reinicios: este hook los recrea cada vez que arranca.
set -e

BUCKET_NAME="document-processing-uploads"
QUEUE_NAME="document-processing-queue"

if awslocal s3api head-bucket --bucket "$BUCKET_NAME" >/dev/null 2>&1; then
  echo "[init] Bucket $BUCKET_NAME ya existe"
else
  awslocal s3 mb "s3://$BUCKET_NAME"
fi

awslocal sqs create-queue --queue-name "$QUEUE_NAME" >/dev/null
echo "[init] Cola $QUEUE_NAME lista"

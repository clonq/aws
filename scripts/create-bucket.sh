aws s3 mb s3://io.r3v0
aws s3 website s3://io.r3v0 --index-document index.html --error-document error.html
aws s3api put-bucket-policy --bucket io.r3v0 --policy file://policies/website.json

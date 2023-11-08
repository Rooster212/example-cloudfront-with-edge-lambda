# CDK CloudFront with Lambda@Edge origin request example

This example shows how to deploy a CloudFront origin using CDK, with a origin request Lambda. In this example I will show how to request 2 different static sites from one CloudFront distribution and S3 bucket, but this could be used for many other things such as load balanced servers, changing buckets based on region and more.

This example has some HashRouter code, as I was using it to debug some `react-router-dom` code.

## Usage of OAI vs OAC

Origin Access Identity is a more legacy way to allow Cloudfront to access an S3 bucket, and is discouraged by AWS.

CloudFormation does support OACs:
https://hayao-k.dev/migrating-cloudfront-oai-to-oac-using-cloudformation

However, CDK does not directly yet as per this GitHub issue:
https://github.com/aws/aws-cdk/issues/21771

For now I've left it with an OAI until CDK has been updated to work with OACs.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

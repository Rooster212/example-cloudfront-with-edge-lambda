#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ExampleCloudfrontWithEdgeLambdaStack } from "../lib/example-cloudfront-with-edge-lambda-stack";

const app = new cdk.App();
new ExampleCloudfrontWithEdgeLambdaStack(
  app,
  "ExampleCloudfrontWithEdgeLambdaStack",
  {
    /* This stack will be deployed in the AWS Account and Region
    that are implied by the current CLI configuration. */
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },

    /* Uncomment the next line if you know exactly what Account and Region you
     * want to deploy the stack to. */
    // env: { account: '123456789012', region: 'us-east-1' },
  }
);

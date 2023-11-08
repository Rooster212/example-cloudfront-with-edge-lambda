import * as cdk from "aws-cdk-lib";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import * as cloudfront_origins from "aws-cdk-lib/aws-cloudfront-origins";
import { Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class ExampleCloudfrontWithEdgeLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const edgeFunction = new cloudfront.experimental.EdgeFunction(
      this,
      "ExampleEdgeFunction",
      {
        code: Code.fromAsset("lambda"),
        handler: "origin-request.handler",
        runtime: Runtime.NODEJS_18_X,
      }
    );

    const bucket = new Bucket(this, "ExampleBucket", {
      bucketName: `rooster212-example-cloudfront-${this.account}-${this.region}`,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,

      // Just for testing!
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(
      this,
      `ExampleCloudfrontOAI`,
      {
        comment: `OAI for Example CDK deployment`,
      }
    );

    // Grant access to Cloudfront
    bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [bucket.arnForObjects("*")],
        principals: [
          new iam.CanonicalUserPrincipal(
            cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["s3:ListBucket"],
        resources: [bucket.bucketArn],
        principals: [
          new iam.CanonicalUserPrincipal(
            cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    // Create a CloudFront web distribution
    const distribution = new cdk.aws_cloudfront.Distribution(
      this,
      "ExampleDistribution",
      {
        defaultRootObject: "index.html",
        priceClass: cdk.aws_cloudfront.PriceClass.PRICE_CLASS_100,
        comment: "A test distribution to show how origin lambdas can be used.",
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 403,
            responsePagePath: "/error.html",
            ttl: cdk.Duration.minutes(5),
          },
        ],
        defaultBehavior: {
          origin: new cdk.aws_cloudfront_origins.S3Origin(bucket),
          viewerProtocolPolicy:
            cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          // Disable caching for this example, but not usually recommended.
          cachePolicy: cdk.aws_cloudfront.CachePolicy.CACHING_DISABLED,
          // Specify our edge Lambda here
          edgeLambdas: [
            {
              functionVersion: edgeFunction.currentVersion,
              eventType: cdk.aws_cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
            },
          ],
        },
      }
    );

    // Deploy site contents to S3 bucket
    new s3deploy.BucketDeployment(this, "DeployExampleSite", {
      sources: [s3deploy.Source.asset("./site")],
      destinationBucket: bucket,
      retainOnDelete: false,
      // Consider changing for production purposes
      cacheControl: [
        {
          value: "max-age=0, no-cache, no-store, must-revalidate",
        },
      ],
      // You can set distribution to cause an invalidation on deploy
      // This is not required if setting no-cache, which is recommended for testing
    });

    new cdk.CfnOutput(this, "ExampleBucketOutput", {
      value: bucket.bucketName,
    });
    new cdk.CfnOutput(this, "ExampleDomainNameOutput", {
      value: "https://" + distribution.domainName,
    });
  }
}

import { CloudFrontRequestHandler } from "aws-lambda";

export const handler: CloudFrontRequestHandler = async (event) => {
  const request = event.Records[0].cf.request;
  if (!request.uri.includes(".")) {
    request.uri = "/index.html";
  }
  if (request.uri.endsWith("/admin")) {
    request.uri = "/admin/index.html";
  }

  return request;
};

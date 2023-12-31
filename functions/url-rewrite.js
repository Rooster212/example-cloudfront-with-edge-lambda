// https://github.com/aws-samples/amazon-cloudfront-functions/
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/functions-javascript-runtime-features.html

function redirect(redirectLocation) {
  return {
    statusCode: 302,
    statusDescription: "Found",
    headers: { location: { value: redirectLocation } },
  };
}

function handler(event) {
  var request = event.request;

  if (request.uri.indexOf(".") > -1) {
    return request;
  }

  var uri = request.uri;
  if (request.uri.indexOf("#") > -1) {
    uri = request.uri.split("#")[0];
  }

  if (uri.endsWith("/admin")) {
    return redirect("/admin/");
  } else if (uri.endsWith("/broker")) {
    return redirect("/broker/");
  }

  if (uri.endsWith("/admin/")) {
    request.uri = "/admin/index.html";
  } else if (uri.endsWith("/broker/")) {
    request.uri = "/broker/index.html";
  } else {
    request.uri = "/index.html";
  }

  return request;
}

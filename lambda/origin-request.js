export const handler = async (event) => {
  const request = event.Records[0].cf.request;
  if (!request.uri.includes(".")) {
    if (request.uri.endsWith("/admin")) {
      request.uri = "/admin/index.html";
    } else {
      request.uri = "/index.html";
    }
  }

  return request;
};

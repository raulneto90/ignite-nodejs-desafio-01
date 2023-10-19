import http from "node:http";
import { routes } from "./routes";
import { extractQueryParams } from "./utils/extract-query-params";

const server = http.createServer(async (request, response) => {
  const { method, url } = request;

  await json(request, response);

  const route = routes.find(
    (route) => route.method === method && route.path.test(url)
  );

  if (route) {
    const routeParams = request.url.match(route.path);

    const { query, ...params } = routeParams.groups;

    request.params = { ...params };
    request.query = query ? extractQueryParams(query) : {};

    return route.handler(request, response);
  }

  return response.writeHead(404).end();
});

server.listen(3333, () => {
  console.log("Server running on port 3333");
});

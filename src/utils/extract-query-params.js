export function extractQueryParams(query: string) {
  return query
    .substr(1)
    .split("&")
    .reduce((queryParams: any, param: string) => {
      const [key, value] = param.split("=");
      queryParams[key] = value;

      return queryParams;
    }, {});
}

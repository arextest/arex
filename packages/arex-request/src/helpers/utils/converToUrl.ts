export const converToUrl = (requestParams: any) => {
  const params: any = [];
  requestParams.forEach(({ key, value }: any) => {
    const param = key + '=' + value;
    params.push(param);
  });
  return '?' + params.join('&');
};

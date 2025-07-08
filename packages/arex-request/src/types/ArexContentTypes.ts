export const KnownContentTypes = {
  'application/json': 'json',
  'multipart/form-data': 'multipart',
  'application/octet-stream': 'binary',
  'application/x-www-form-urlencoded': 'urlencoded',
} as const;

export type ArexContentTypes = keyof typeof KnownContentTypes;

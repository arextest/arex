export const KnownContentTypes = {
  'application/json': 'json',
  'multipart/form-data': 'multipart',
  'application/octet-stream': 'binary',
} as const;

export type ArexContentTypes = keyof typeof KnownContentTypes;

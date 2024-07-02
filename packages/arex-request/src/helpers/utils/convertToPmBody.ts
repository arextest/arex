import { ArexRESTReqBody } from '../../types';

export function convertToPmBody({ body, contentType, formData }: ArexRESTReqBody) {
  if (contentType === 'application/octet-stream') {
    return {
      mode: 'file',
      file: {
        src: body,
      },
    };
  } else if (contentType === 'application/json') {
    return {
      mode: 'raw',
      raw: body,
      options: {
        raw: {
          language: 'json',
        },
      },
    };
  } else if (contentType === 'multipart/form-data') {
    return {
      mode: 'formdata',
      formdata: formData,
    };
  }
  return '';
}

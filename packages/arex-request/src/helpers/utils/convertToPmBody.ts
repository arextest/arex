export function convertToPmBody({ body, contentType, formData }) {
  if (contentType === '0') {
    // 如果是0就是binary
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
      mode: 'raw',
      raw: formData,
      options: {
        raw: {
          language: 'json',
        },
      },
    };
  }
  return '';
}

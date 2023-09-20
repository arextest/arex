export function convertToPmBody({ body, contentType }: any) {
  console.log(contentType);
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
  }
  return '';
}

// @ts-nocheck
export function getValueByPath(obj, path) {
  // console.log(obj,path,'o')
  try {
    let paths = path.split('.');
    let res = obj;
    let prop;
    while ((prop = paths.shift())) {
      res = res[prop];
    }
    if (typeof res === 'string') {
      return res;
    } else {
      return '不是string';
    }
    // return res;
  } catch (e) {
    return '';
  }
}

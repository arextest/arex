import moment from "moment";

export {showMessage, showNotification} from "./content";

export const debounce = (callback: (...params: any) => void, delay: number = 500) => {
  let timer: any = null;
  return function (this: any, ...args: any) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      callback.apply(this, args);
    }, delay)
  }
};

export const throttle = (callback: () => void, delay: number = 500) => {
  let timer: any = null;
  return function (this: any, ...args: any) {
    if (!timer) {
      callback.apply(this, args);
    }
    timer = setTimeout(() => {
      timer = null
    }, delay);
  }
};

export const formatTimestamp = (timestamp: number | string | Date, format: string = 'YYYY-MM-DD HH:mm') => {
  return moment(typeof timestamp === 'string' ? parseInt(timestamp) : timestamp).format(format);
};

export const formatDuration = (duration: number, format: string = 'HH:mm:ss') => {
  return moment(moment().startOf('day').valueOf() + duration).format(format)
};

export const getUrlKey = (key: string) => {
  let reg = new RegExp('[?|&]' + key + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href)
  if (reg) {
    const regUrl = reg[1].replace(/\+/g, '%20')
    return decodeURIComponent(regUrl) || null
  }
  return null
};

export const extractJsonPath = (jsonObject: object) => {
  let stack = [];
  let pathOptions: string[] = [];
  stack.push({path: '', index: 0, object: jsonObject});
  while (stack.length > 0) {
    let preNode: any = stack.pop();
    let preKeys: any = Object.keys(preNode.object);
    for (let i = preNode.index; i < preKeys.length; i++) {
      let currentObject = preNode.object[preKeys[i]];
      let currentPath = preNode.path + ' / ' + preKeys[i];
      if (currentObject) {
        if (!pathOptions.includes(currentPath)) {
          pathOptions.push(currentPath)
        }
        let currentObjectType = currentObject.constructor.name.toLowerCase();
        if (currentObjectType === 'object') {
          preNode.index = i + 1;
          stack.push(preNode);
          stack.push({path: currentPath, index: 0, object: currentObject});
          break;
        } else if (currentObjectType === 'array') { // 如果当前节点是数组类型，则只解析出该数组的第一个元素的路径
          if (!pathOptions.includes(currentPath + '[0]')) {
            pathOptions.push(currentPath + '[0]')
          }
          if (currentObject[0] !== undefined && currentObject[0].constructor.name.toLowerCase() === 'object') {
            preNode.index = i + 1;
            stack.push(preNode);
            stack.push({path: currentPath, index: 0, object: currentObject[0]});
            break
          }
        }
      }
    }
  }
  return pathOptions;
};

export const unWrap = (obj: any) => obj.__v_raw || obj.valueOf() || obj;

export const getPercent = (num: number, den: number, showPercentSign: boolean = true) => {
  let value = num && den ? parseFloat((num / den * 100).toFixed(0)) : 0;
  return showPercentSign ? value + "%" : value;
}

export const formatElapsedTime = (millisecond: any) => {
  if (millisecond) {
    if (millisecond < 1000) {
      return millisecond + 'ms';
    }
    let min = Number(millisecond / 60000);
    let sec = Math.round(millisecond % 60000 / 1000);
    return min + 'min' + sec + 's';
  }
  return '-';
};
export const getFormatElapsedTime = (startTime: any, endTime: any) => {
  if (startTime && endTime) {
    let millisecond = endTime - startTime;
    formatElapsedTime(millisecond);
  }
  return '-';
}


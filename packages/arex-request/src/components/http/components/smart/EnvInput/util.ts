export function getElementViewPosition(element: any) {
  let elementScrollTop;
  let elementScrollLeft;
  //计算x坐标
  let actualLeft = element.offsetLeft;
  let current = element.offsetParent;
  while (current !== null) {
    actualLeft += current.offsetLeft + current.clientLeft;
    current = current.offsetParent;
  }
  if (document.compatMode == 'BackCompat') {
    elementScrollLeft = document.body.scrollLeft;
  } else {
    elementScrollLeft = document.documentElement.scrollLeft;
  }
  const left = actualLeft - elementScrollLeft;
  //计算y坐标
  let actualTop = element.offsetTop;
  current = element.offsetParent;
  while (current !== null) {
    actualTop += current.offsetTop + current.clientTop;
    current = current.offsetParent;
  }
  if (document.compatMode == 'BackCompat') {
    elementScrollTop = document.body.scrollTop;
  } else {
    elementScrollTop = document.documentElement.scrollTop;
  }
  const right = actualTop - elementScrollTop;
  //返回结果
  return { x: left, y: right };
}

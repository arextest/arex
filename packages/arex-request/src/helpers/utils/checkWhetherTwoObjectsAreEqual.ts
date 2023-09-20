export function checkWhetherTwoObjectsAreEqual(obj0: any, obj1: any) {
  return JSON.stringify(obj0) === JSON.stringify(obj1);
}

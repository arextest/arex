import { runTestScript as _runTestScript } from 'purple-js-sandbox';
import { TestDescriptor, TestResponse } from 'purple-js-sandbox/lib/test-runner';

// This will return 4 lines on the test report, grouped under "Arithmetic operations"
// arex.test("Arithmetic operations", () => {
//   const size = 500 + 500;
//   arex.expect(size).toBe(1000);
//   arex.expect(size - 500).toBe(500);
//   arex.expect(size * 4).toBe(4000);
//   arex.expect(size / 4).toBe(250);
// });

// testScript 是拿到返回值后的执行脚本
// 参数testScript为测试脚本，
// 返回一个promise、testResponse为返回体
// 脚本参考 https://docs.hoppscotch.io/quickstart/tests
// 源码参考 https://github.com/hoppscotch/hoppscotch/blob/v2.1.0/packages/hoppscotch-js-sandbox/src/demo.ts
// _tag = Left时是脚本错误，Right是成功

export function runTestScript(
  testScript: string,
  testResponse: TestResponse,
): Promise<TestDescriptor> {
  return new Promise((resolve, reject) => {
    // console.log(testScript.replace(/arex\./g,'pw.'),'testScript')
    return _runTestScript(testScript.replace(/arex\./g, 'pw.'), testResponse)().then((res) => {
      if (res._tag === 'Right') {
        resolve(res.right);
      } else {
        reject(res.left);
      }
    });
  });
}

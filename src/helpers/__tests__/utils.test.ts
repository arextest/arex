import { matchUrlParams } from '../functional/url';
describe('matchUrlParams', () => {
  test('matchUrlParams', () => {
    return expect(
      matchUrlParams(
        '/63230bb36298fb649493fa5b/qingkong/BatchComparePage/63230bb36298fb649493fa5c?planId=123',
      ),
    ).toEqual({
      pagesType: 'BatchComparePage',
      rawId: '63230bb36298fb649493fa5c',
      workspaceId: '63230bb36298fb649493fa5b',
      workspaceName: 'qingkong',
    });
  });
});

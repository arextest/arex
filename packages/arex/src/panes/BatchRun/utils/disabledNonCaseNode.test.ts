import { describe, expect, test, vi } from 'vitest';

import { CollectionType } from '@/services/FileSystemService';

import disabledNonCaseNode from './disabledNonCaseNode';

vi.mock('@/constant', () => ({
  CollectionNodeType: {
    interface: 1,
    case: 2,
    folder: 3,
  },
}));

describe('disabledNonCaseNode', () => {
  test('no case collection tree types', () => {
    const collectionTreeData = [
      {
        key: '647849827137ad5ad372bd45',
        nodeName: 'node',
        nodeType: 3,
        infoId: '647849827137ad5ad372bd45',
        method: null,
        caseSourceType: 0,
        labelIds: null,
        children: [
          {
            key: '647849917137ad5ad372bd59',
            nodeName: 'New Request',
            nodeType: 1,
            infoId: '647849917137ad5ad372bd59',
            method: 'GET',
            caseSourceType: 0,
            labelIds: null,
            children: [],
          },
        ],
      },
    ] as CollectionType[];

    expect(disabledNonCaseNode(collectionTreeData)).toMatchSnapshot();
  });

  test('collection tree types with case', () => {
    const collectionTreeData = [
      {
        nodeName: 'node',
        nodeType: 3,
        key: '647849827137ad5ad372bd45',
        infoId: '647849827137ad5ad372bd45',
        method: null,
        caseSourceType: 0,
        labelIds: null,
        children: [
          {
            nodeName: 'New Request',
            nodeType: 1,
            key: '647849917137ad5ad372bd59',
            infoId: '647849917137ad5ad372bd59',
            method: 'GET',
            caseSourceType: 0,
            labelIds: null,
            children: [],
          },
        ],
      },
      {
        nodeName: 'batchcompare',
        nodeType: 3,
        key: '64536864a79d52663af78b33',
        infoId: '64536864a79d52663af78b33',
        method: null,
        caseSourceType: 0,
        labelIds: null,
        children: [
          {
            nodeName: 'retryBatchCompare',
            nodeType: 1,
            key: '64741a0d2a3299652af9111a',
            infoId: '648a7923bc7e1a5853cf6a33',
            method: 'POST',
            caseSourceType: 0,
            labelIds: null,
            children: [],
          },
          {
            nodeName: 'queryBatchCompareCaseMsgWithDiff',
            nodeType: 1,
            key: '647414772a3299652af90de4',
            infoId: '64741a0d2a3299652af9111a',
            method: 'POST',
            caseSourceType: 0,
            labelIds: null,
            children: [],
          },
          {
            nodeName: 'queryDiffInfoByCaseId',
            nodeType: 1,
            key: '647414772a3299652af90de4',
            infoId: '647414772a3299652af90de4',
            method: 'POST',
            caseSourceType: 0,
            labelIds: null,
            children: [
              {
                nodeName: '异常情况',
                nodeType: 2,
                key: '647434ee2a3299652af92445',
                infoId: '647434ee2a3299652af92445',
                method: null,
                caseSourceType: 2,
                labelIds: null,
                children: [],
              },
            ],
          },
          {
            nodeName: '/updateBatchCompareCase',
            nodeType: 1,
            key: '645374a7a79d52663af793ea',
            infoId: '645374a7a79d52663af793ea',
            method: 'POST',
            caseSourceType: 0,
            labelIds: null,
            children: [],
          },
          {
            nodeName: '/initBatchCompareReport',
            nodeType: 1,
            key: '645369aca79d52663af78bde',
            infoId: '645369aca79d52663af78bde',
            method: 'POST',
            caseSourceType: 0,
            labelIds: null,
            children: [
              {
                nodeName: 'case',
                nodeType: 2,
                key: '648a7792bc7e1a5853cf694c',
                infoId: '648a7792bc7e1a5853cf694c',
                method: null,
                caseSourceType: 2,
                labelIds: null,
                children: [],
              },
            ],
          },
          {
            nodeName: '/queryBatchCompareHistoryReport',
            nodeType: 1,
            key: '6453686ba79d52663af78b3b',
            infoId: '6453686ba79d52663af78b3b',
            method: 'POST',
            caseSourceType: 0,
            labelIds: null,
            children: [],
          },
        ],
      },
    ] as CollectionType[];

    expect(disabledNonCaseNode(collectionTreeData)).toMatchSnapshot();
  });
});

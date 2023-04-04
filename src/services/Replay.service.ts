import axios from 'axios';

import request from '../helpers/api/axios';
import { tryPrettierJsonString } from '../helpers/utils';
import {
  CreatePlanReq,
  CreatePlanRes,
  QueryAllDiffMsgReq,
  QueryAllDiffMsgRes,
  QueryDifferencesReq,
  QueryDifferencesRes,
  QueryDiffMsgByIdReq,
  QueryDiffMsgByIdRes,
  QueryFullLinkInfoReq,
  QueryFullLinkInfoRes,
  QueryFullLinkMsgReq,
  QueryFullLinkMsgRes,
  QueryMsgWithDiffRes,
  QueryPlanItemStatisticsReq,
  QueryPlanItemStatisticsRes,
  QueryPlanStatisticsReq,
  QueryPlanStatisticsRes,
  QueryReplayCaseReq,
  QueryReplayCaseRes,
  QueryResponseTypeStatisticReq,
  QueryResponseTypeStatisticRes,
  QuerySceneInfoReq,
  QuerySceneInfoRes,
  QueryScenesReq,
  QueryScenesRes,
  RegressionListRes,
} from './Replay.type';

export default class ReplayService {
  static async regressionList() {
    return request
      .get<RegressionListRes>('/report/config/application/regressionList')
      .then((res) => Promise.resolve(res.body.map((item) => item.application)));
  }

  static async queryPlanStatistics(params: QueryPlanStatisticsReq) {
    return request
      .post<QueryPlanStatisticsRes>('/report/report/queryPlanStatistics', params)
      .then((res) =>
        Promise.resolve(
          res.body.planStatisticList.sort((a, b) => b.replayStartTime - a.replayStartTime),
        ),
      );
  }

  static async terminatePlanStatistics(planId: string) {
    return new Promise<{
      result: number;
      desc: string;
    }>((resolve, reject) => {
      return axios
        .get('/schedule/stopPlan?planId=' + planId)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }

  static async deletePlanStatistics(planId: string) {
    const res = await request.get<boolean>('/report/report/delete/' + planId);
    return res.body;
  }

  static async queryPlanItemStatistics(params: QueryPlanItemStatisticsReq) {
    return request
      .post<QueryPlanItemStatisticsRes>('/report/report/queryPlanItemStatistics', params)
      .then((res) => Promise.resolve(res.body.planItemStatisticList));
  }

  static async queryResponseTypeStatistic(params: QueryResponseTypeStatisticReq) {
    return request
      .post<QueryResponseTypeStatisticRes>('/report/report/queryResponseTypeStatistic', params)
      .then((res) => Promise.resolve(res.body.categoryStatisticList || []));
  }

  static async queryDifferences(params: QueryDifferencesReq) {
    return request
      .post<QueryDifferencesRes>('/report/report/queryDifferences', params)
      .then((res) => Promise.resolve(res.body.differences));
  }

  static async queryReplayCase({
    planItemId,
    needTotal = false,
    pageIndex = 1,
    pageSize = 99,
  }: QueryReplayCaseReq) {
    return request
      .post<QueryReplayCaseRes>('/report/report/queryReplayCase', {
        needTotal,
        pageIndex,
        pageSize,
        planItemId,
      })
      .then((res) => Promise.resolve(res.body.result));
  }

  static async createPlan(params: CreatePlanReq) {
    return new Promise<CreatePlanRes>((resolve, reject) => {
      return axios
        .post<any, { data: CreatePlanRes }>('/schedule/createPlan', params)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }

  static async queryScenes(params: QueryScenesReq) {
    return request
      .post<QueryScenesRes>('/report/report/queryScenes', params)
      .then((res) => Promise.resolve(res.body.scenes));
  }

  static async queryMsgWithDiff(params: { logIndexes: string; compareResultId: string }) {
    return request
      .post<QueryMsgWithDiffRes>('/report/report/queryMsgWithDiff', params)
      .then((res) => Promise.resolve(res.body));
  }

  static async queryFullLinkMsg(params: QueryFullLinkMsgReq) {
    return request
      .post<QueryFullLinkMsgRes>('/report/report/queryFullLinkMsg', params)
      .then((res) =>
        Promise.resolve(
          res.body.compareResults.map((item) => {
            const type: 'html' | 'json' = item.baseMsg?.includes('<html>') ? 'html' : 'json';
            return {
              ...item,
              baseMsg: item.baseMsg
                ? type === 'html'
                  ? item.baseMsg
                  : tryPrettierJsonString(item.baseMsg)
                : '',
              testMsg: item.testMsg
                ? type === 'html'
                  ? item.testMsg
                  : tryPrettierJsonString(item.testMsg)
                : '',
              type,
            };
          }),
        ),
      );
  }

  static async querySceneInfo(params: QuerySceneInfoReq) {
    return request
      .get<QuerySceneInfoRes>(`/report/report/querySceneInfo/${params.planId}/${params.planItemId}`)
      .then((res) => Promise.resolve(res.body.sceneInfos.filter((scene) => scene.subScenes))); //  subScenes could be null;
  }

  static async queryFullLinkInfo(params: QueryFullLinkInfoReq) {
    return request
      .get<QueryFullLinkInfoRes>(
        `/report/report/queryFullLinkInfo/${params.recordId}/${params.replayId}`,
      )
      .then((res) => Promise.resolve(res.body));
  }

  static async queryDiffMsgById(params: QueryDiffMsgByIdReq) {
    return request
      .get<QueryDiffMsgByIdRes>(`/report/report/queryDiffMsgById/${params.id}`)
      .then((res) => Promise.resolve(res.body.compareResultDetail));
  }

  static async queryAllDiffMsg(params: QueryAllDiffMsgReq) {
    return request.post<QueryAllDiffMsgRes>('/report/report/queryAllDiffMsg', params).then((res) =>
      Promise.resolve({
        compareResultDetailList: [
          {
            id: '641bf26991f0253a35870328',
            categoryName: 'SOAConsumer',
            operationName:
              'flight.ticket.refundfeecalculationservice.v1.refundfeecalculationservice.refundItineraryFeeQuery',
            diffResultCode: 1,
            logs: [
              {
                baseValue: 'true',
                testValue: 'false',
                logInfo: 'The node value of [multiplecurrency] is different : {true} - {false}',
                pathPair: {
                  unmatchedType: 3,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'multiplecurrency',
                      index: 0,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'multiplecurrency',
                      index: 0,
                    },
                  ],
                  listKeys: [],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'multiplecurrency',
                logTag: {
                  errorType: 0,
                },
              },
            ],
            baseMsg:
              '{"orderid":23294197692,"source":"AfterSaleOffline","multiplecurrency":true,"refundtypes":null,"refunditineraryinfolist":null,"needpaycustomerresult":null}',
            testMsg:
              '{"orderid":23294197692,"source":"AfterSaleOffline","multiplecurrency":false,"refundtypes":null,"refunditineraryinfolist":null,"needpaycustomerresult":null}',
          },
          {
            id: '641bf26991f0253a35870327',
            categoryName: 'SOAConsumer',
            operationName:
              'flight.ticket.refundfeecalculationservice.v1.refundfeecalculationservice.refundItineraryFeeQuery',
            diffResultCode: 1,
            logs: [
              {
                baseValue: 'true',
                testValue: 'false',
                logInfo: 'The node value of [multiplecurrency] is different : {true} - {false}',
                pathPair: {
                  unmatchedType: 3,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'multiplecurrency',
                      index: 0,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'multiplecurrency',
                      index: 0,
                    },
                  ],
                  listKeys: [],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'multiplecurrency',
                logTag: {
                  errorType: 0,
                },
              },
            ],
            baseMsg:
              '{"orderid":23294471356,"source":"AfterSaleOffline","multiplecurrency":true,"refundtypes":null,"refunditineraryinfolist":null,"needpaycustomerresult":null}',
            testMsg:
              '{"orderid":23294471356,"source":"AfterSaleOffline","multiplecurrency":false,"refundtypes":null,"refunditineraryinfolist":null,"needpaycustomerresult":null}',
          },
          {
            id: '641bf26991f0253a35870314',
            categoryName: 'SOAProvider',
            operationName:
              'flight.order.openapi.orderdetailsearch.v1.openapiorderdetailsearchservice.flightReRefQuery',
            diffResultCode: 1,
            logs: [
              {
                baseValue: null,
                testValue: null,
                logInfo: 'There is more node on the left : [flightinfos[0]]',
                pathPair: {
                  unmatchedType: 2,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'flightinfos',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'flightinfos',
                      index: 0,
                    },
                  ],
                  listKeys: [
                    'orderitems',
                    '(orderid:23294471356)',
                    'orderitems[0].flightinfos',
                    '(flight:7C127)(takeofftime:2023-05-30 18:15:00)(arrivaltime:2023-05-30 19:25:00)',
                  ],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'orderitems[0].flightinfos[0]',
                logTag: {
                  errorType: 0,
                },
              },
              {
                baseValue: null,
                testValue: null,
                logInfo: 'There is more node on the left : [flightinfos[1]]',
                pathPair: {
                  unmatchedType: 2,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'flightinfos',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'flightinfos',
                      index: 0,
                    },
                  ],
                  listKeys: [
                    'orderitems',
                    '(orderid:23294471356)',
                    'orderitems[0].flightinfos',
                    '(flight:7C127)(takeofftime:2023-05-30 18:15:00)(arrivaltime:2023-05-30 19:25:00)',
                  ],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'orderitems[0].flightinfos[1]',
                logTag: {
                  errorType: 0,
                },
              },
              {
                baseValue: null,
                testValue: null,
                logInfo: 'There is more node on the right : [flightinfos[0]]',
                pathPair: {
                  unmatchedType: 1,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'flightinfos',
                      index: 0,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'flightinfos',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                  ],
                  listKeys: [
                    'orderitems',
                    '(orderid:23294471356)',
                    'orderitems[0].flightinfos',
                    '',
                  ],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'orderitems[0].flightinfos[0]',
                logTag: {
                  errorType: 0,
                },
              },
              {
                baseValue: null,
                testValue: null,
                logInfo: 'There is more node on the right : [flightinfos[1]]',
                pathPair: {
                  unmatchedType: 1,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'flightinfos',
                      index: 0,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'flightinfos',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                  ],
                  listKeys: [
                    'orderitems',
                    '(orderid:23294471356)',
                    'orderitems[0].flightinfos',
                    '',
                  ],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'orderitems[0].flightinfos[1]',
                logTag: {
                  errorType: 0,
                },
              },
              {
                baseValue: '40800.0',
                testValue: '118800.0',
                logInfo: 'The node value of [paycustomer] is different : {40800.0} - {118800.0}',
                pathPair: {
                  unmatchedType: 3,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'refundrebookinfobyorder',
                      index: 0,
                    },
                    {
                      nodeName: 'refundamountinfolist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'paycustomer',
                      index: 0,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'refundrebookinfobyorder',
                      index: 0,
                    },
                    {
                      nodeName: 'refundamountinfolist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'paycustomer',
                      index: 0,
                    },
                  ],
                  listKeys: [
                    'orderitems',
                    '(orderid:23294471356)',
                    'orderitems[0].refundrebookinfobyorder.refundamountinfolist',
                    'Index:[0]',
                  ],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'orderitems[0].refundrebookinfobyorder.refundamountinfolist[0].paycustomer',
                logTag: {
                  errorType: 0,
                },
              },
              {
                baseValue: '25700.0',
                testValue: '102700.0',
                logInfo: 'The node value of [refundflight] is different : {25700.0} - {102700.0}',
                pathPair: {
                  unmatchedType: 3,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'refundrebookinfobyorder',
                      index: 0,
                    },
                    {
                      nodeName: 'refundamountinfolist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'refundflight',
                      index: 0,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'refundrebookinfobyorder',
                      index: 0,
                    },
                    {
                      nodeName: 'refundamountinfolist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'refundflight',
                      index: 0,
                    },
                  ],
                  listKeys: [
                    'orderitems',
                    '(orderid:23294471356)',
                    'orderitems[0].refundrebookinfobyorder.refundamountinfolist',
                    'Index:[0]',
                  ],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'orderitems[0].refundrebookinfobyorder.refundamountinfolist[0].refundflight',
                logTag: {
                  errorType: 0,
                },
              },
              {
                baseValue: '"0000001063"',
                testValue: '""',
                logInfo: 'The node value of [ticketno] is different : {"0000001063"} - {""}',
                pathPair: {
                  unmatchedType: 3,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'segmentlist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'ticketinfo',
                      index: 0,
                    },
                    {
                      nodeName: 'ticketno',
                      index: 0,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'segmentlist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'ticketinfo',
                      index: 0,
                    },
                    {
                      nodeName: 'ticketno',
                      index: 0,
                    },
                  ],
                  listKeys: [
                    'orderitems',
                    '(orderid:23294471356)',
                    'orderitems[0].segmentlist',
                    '(flightindex:1000)',
                  ],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'orderitems[0].segmentlist[0].ticketinfo.ticketno',
                logTag: {
                  errorType: 0,
                },
              },
              {
                baseValue: '"806"',
                testValue: '"722"',
                logInfo: 'The node value of [airlinecode] is different : {"806"} - {"722"}',
                pathPair: {
                  unmatchedType: 3,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'segmentlist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'ticketinfo',
                      index: 0,
                    },
                    {
                      nodeName: 'airlinecode',
                      index: 0,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'segmentlist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'ticketinfo',
                      index: 0,
                    },
                    {
                      nodeName: 'airlinecode',
                      index: 0,
                    },
                  ],
                  listKeys: [
                    'orderitems',
                    '(orderid:23294471356)',
                    'orderitems[0].segmentlist',
                    '(flightindex:1000)',
                  ],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'orderitems[0].segmentlist[0].ticketinfo.airlinecode',
                logTag: {
                  errorType: 0,
                },
              },
              {
                baseValue: null,
                testValue: null,
                logInfo: 'There is more node on the left : [productidinseglist[0]]',
                pathPair: {
                  unmatchedType: 2,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'segmentlist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'productidinseglist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'segmentlist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'productidinseglist',
                      index: 0,
                    },
                  ],
                  listKeys: [
                    'orderitems',
                    '(orderid:23294471356)',
                    'orderitems[0].segmentlist',
                    '(flightindex:1000)',
                    'orderitems[0].segmentlist[0].productidinseglist',
                    'Index:[0]',
                  ],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'orderitems[0].segmentlist[0].productidinseglist[0]',
                logTag: {
                  errorType: 0,
                },
              },
              {
                baseValue: '1',
                testValue: null,
                logInfo: 'The node value of [sortedsequence] is different : {1} - {null}',
                pathPair: {
                  unmatchedType: 3,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'segmentlist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'sortedsequence',
                      index: 0,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'segmentlist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'sortedsequence',
                      index: 0,
                    },
                  ],
                  listKeys: [
                    'orderitems',
                    '(orderid:23294471356)',
                    'orderitems[0].segmentlist',
                    '(flightindex:1000)',
                  ],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'orderitems[0].segmentlist[0].sortedsequence',
                logTag: {
                  errorType: 0,
                },
              },
              {
                baseValue: '25700.0',
                testValue: '0',
                logInfo: 'The node value of [flightprice] is different : {25700.0} - {0}',
                pathPair: {
                  unmatchedType: 3,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'segmentlist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'triprecordflightfeeinfo',
                      index: 0,
                    },
                    {
                      nodeName: 'flightprice',
                      index: 0,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'segmentlist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'triprecordflightfeeinfo',
                      index: 0,
                    },
                    {
                      nodeName: 'flightprice',
                      index: 0,
                    },
                  ],
                  listKeys: [
                    'orderitems',
                    '(orderid:23294471356)',
                    'orderitems[0].segmentlist',
                    '(flightindex:1000)',
                  ],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'orderitems[0].segmentlist[0].triprecordflightfeeinfo.flightprice',
                logTag: {
                  errorType: 0,
                },
              },
              {
                baseValue: '16100.0',
                testValue: '0',
                logInfo: 'The node value of [taxfee] is different : {16100.0} - {0}',
                pathPair: {
                  unmatchedType: 3,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'segmentlist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'triprecordflightfeeinfo',
                      index: 0,
                    },
                    {
                      nodeName: 'taxfee',
                      index: 0,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'segmentlist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'triprecordflightfeeinfo',
                      index: 0,
                    },
                    {
                      nodeName: 'taxfee',
                      index: 0,
                    },
                  ],
                  listKeys: [
                    'orderitems',
                    '(orderid:23294471356)',
                    'orderitems[0].segmentlist',
                    '(flightindex:1000)',
                  ],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'orderitems[0].segmentlist[0].triprecordflightfeeinfo.taxfee',
                logTag: {
                  errorType: 0,
                },
              },
              {
                baseValue: null,
                testValue: null,
                logInfo: 'There is more node on the left : [flightinfos[0]]',
                pathPair: {
                  unmatchedType: 2,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                    {
                      nodeName: 'flightinfos',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                    {
                      nodeName: 'flightinfos',
                      index: 0,
                    },
                  ],
                  listKeys: [
                    'orderitems',
                    '(orderid:23294197692)',
                    'orderitems[1].flightinfos',
                    '(flight:TW720)(takeofftime:2023-06-05 13:30:00)(arrivaltime:2023-06-05 14:40:00)',
                  ],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'orderitems[1].flightinfos[0]',
                logTag: {
                  errorType: 0,
                },
              },
              {
                baseValue: null,
                testValue: null,
                logInfo: 'There is more node on the left : [flightinfos[1]]',
                pathPair: {
                  unmatchedType: 2,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                    {
                      nodeName: 'flightinfos',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                    {
                      nodeName: 'flightinfos',
                      index: 0,
                    },
                  ],
                  listKeys: [
                    'orderitems',
                    '(orderid:23294197692)',
                    'orderitems[1].flightinfos',
                    '(flight:TW720)(takeofftime:2023-06-05 13:30:00)(arrivaltime:2023-06-05 14:40:00)',
                  ],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'orderitems[1].flightinfos[1]',
                logTag: {
                  errorType: 0,
                },
              },
              {
                baseValue: null,
                testValue: null,
                logInfo: 'There is more node on the right : [flightinfos[0]]',
                pathPair: {
                  unmatchedType: 1,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                    {
                      nodeName: 'flightinfos',
                      index: 0,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                    {
                      nodeName: 'flightinfos',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                  ],
                  listKeys: [
                    'orderitems',
                    '(orderid:23294197692)',
                    'orderitems[1].flightinfos',
                    '',
                  ],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'orderitems[1].flightinfos[0]',
                logTag: {
                  errorType: 0,
                },
              },
              {
                baseValue: null,
                testValue: null,
                logInfo: 'There is more node on the right : [flightinfos[1]]',
                pathPair: {
                  unmatchedType: 1,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                    {
                      nodeName: 'flightinfos',
                      index: 0,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                    {
                      nodeName: 'flightinfos',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                  ],
                  listKeys: [
                    'orderitems',
                    '(orderid:23294197692)',
                    'orderitems[1].flightinfos',
                    '',
                  ],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'orderitems[1].flightinfos[1]',
                logTag: {
                  errorType: 0,
                },
              },
              {
                baseValue: '118800.0',
                testValue: '40800.0',
                logInfo: 'The node value of [paycustomer] is different : {118800.0} - {40800.0}',
                pathPair: {
                  unmatchedType: 3,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                    {
                      nodeName: 'refundrebookinfobyorder',
                      index: 0,
                    },
                    {
                      nodeName: 'refundamountinfolist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'paycustomer',
                      index: 0,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                    {
                      nodeName: 'refundrebookinfobyorder',
                      index: 0,
                    },
                    {
                      nodeName: 'refundamountinfolist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'paycustomer',
                      index: 0,
                    },
                  ],
                  listKeys: [
                    'orderitems',
                    '(orderid:23294197692)',
                    'orderitems[1].refundrebookinfobyorder.refundamountinfolist',
                    'Index:[0]',
                  ],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'orderitems[1].refundrebookinfobyorder.refundamountinfolist[0].paycustomer',
                logTag: {
                  errorType: 0,
                },
              },
              {
                baseValue: '102700.0',
                testValue: '25700.0',
                logInfo: 'The node value of [refundflight] is different : {102700.0} - {25700.0}',
                pathPair: {
                  unmatchedType: 3,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                    {
                      nodeName: 'refundrebookinfobyorder',
                      index: 0,
                    },
                    {
                      nodeName: 'refundamountinfolist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'refundflight',
                      index: 0,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                    {
                      nodeName: 'refundrebookinfobyorder',
                      index: 0,
                    },
                    {
                      nodeName: 'refundamountinfolist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'refundflight',
                      index: 0,
                    },
                  ],
                  listKeys: [
                    'orderitems',
                    '(orderid:23294197692)',
                    'orderitems[1].refundrebookinfobyorder.refundamountinfolist',
                    'Index:[0]',
                  ],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'orderitems[1].refundrebookinfobyorder.refundamountinfolist[0].refundflight',
                logTag: {
                  errorType: 0,
                },
              },
              {
                baseValue: '""',
                testValue: '"0000001063"',
                logInfo: 'The node value of [ticketno] is different : {""} - {"0000001063"}',
                pathPair: {
                  unmatchedType: 3,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                    {
                      nodeName: 'segmentlist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'ticketinfo',
                      index: 0,
                    },
                    {
                      nodeName: 'ticketno',
                      index: 0,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                    {
                      nodeName: 'segmentlist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'ticketinfo',
                      index: 0,
                    },
                    {
                      nodeName: 'ticketno',
                      index: 0,
                    },
                  ],
                  listKeys: [
                    'orderitems',
                    '(orderid:23294197692)',
                    'orderitems[1].segmentlist',
                    '(flightindex:1000)',
                  ],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'orderitems[1].segmentlist[0].ticketinfo.ticketno',
                logTag: {
                  errorType: 0,
                },
              },
              {
                baseValue: '"722"',
                testValue: '"806"',
                logInfo: 'The node value of [airlinecode] is different : {"722"} - {"806"}',
                pathPair: {
                  unmatchedType: 3,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                    {
                      nodeName: 'segmentlist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'ticketinfo',
                      index: 0,
                    },
                    {
                      nodeName: 'airlinecode',
                      index: 0,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                    {
                      nodeName: 'segmentlist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'ticketinfo',
                      index: 0,
                    },
                    {
                      nodeName: 'airlinecode',
                      index: 0,
                    },
                  ],
                  listKeys: [
                    'orderitems',
                    '(orderid:23294197692)',
                    'orderitems[1].segmentlist',
                    '(flightindex:1000)',
                  ],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'orderitems[1].segmentlist[0].ticketinfo.airlinecode',
                logTag: {
                  errorType: 0,
                },
              },
              {
                baseValue: '1',
                testValue: null,
                logInfo: 'The node value of [sortedsequence] is different : {1} - {null}',
                pathPair: {
                  unmatchedType: 3,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                    {
                      nodeName: 'segmentlist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'sortedsequence',
                      index: 0,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                    {
                      nodeName: 'segmentlist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'sortedsequence',
                      index: 0,
                    },
                  ],
                  listKeys: [
                    'orderitems',
                    '(orderid:23294197692)',
                    'orderitems[1].segmentlist',
                    '(flightindex:1000)',
                  ],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'orderitems[1].segmentlist[0].sortedsequence',
                logTag: {
                  errorType: 0,
                },
              },
              {
                baseValue: '102700.0',
                testValue: '0',
                logInfo: 'The node value of [flightprice] is different : {102700.0} - {0}',
                pathPair: {
                  unmatchedType: 3,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                    {
                      nodeName: 'segmentlist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'triprecordflightfeeinfo',
                      index: 0,
                    },
                    {
                      nodeName: 'flightprice',
                      index: 0,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                    {
                      nodeName: 'segmentlist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'triprecordflightfeeinfo',
                      index: 0,
                    },
                    {
                      nodeName: 'flightprice',
                      index: 0,
                    },
                  ],
                  listKeys: [
                    'orderitems',
                    '(orderid:23294197692)',
                    'orderitems[1].segmentlist',
                    '(flightindex:1000)',
                  ],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'orderitems[1].segmentlist[0].triprecordflightfeeinfo.flightprice',
                logTag: {
                  errorType: 0,
                },
              },
              {
                baseValue: '16100.0',
                testValue: '0',
                logInfo: 'The node value of [taxfee] is different : {16100.0} - {0}',
                pathPair: {
                  unmatchedType: 3,
                  leftUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                    {
                      nodeName: 'segmentlist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'triprecordflightfeeinfo',
                      index: 0,
                    },
                    {
                      nodeName: 'taxfee',
                      index: 0,
                    },
                  ],
                  rightUnmatchedPath: [
                    {
                      nodeName: 'orderitems',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 1,
                    },
                    {
                      nodeName: 'segmentlist',
                      index: 0,
                    },
                    {
                      nodeName: null,
                      index: 0,
                    },
                    {
                      nodeName: 'triprecordflightfeeinfo',
                      index: 0,
                    },
                    {
                      nodeName: 'taxfee',
                      index: 0,
                    },
                  ],
                  listKeys: [
                    'orderitems',
                    '(orderid:23294197692)',
                    'orderitems[1].segmentlist',
                    '(flightindex:1000)',
                  ],
                  listKeyPath: [],
                  trace: {
                    currentTraceLeft: null,
                    currentTraceRight: null,
                  },
                },
                addRefPkNodePathLeft: null,
                addRefPkNodePathRight: null,
                warn: 0,
                path: 'orderitems[1].segmentlist[0].triprecordflightfeeinfo.taxfee',
                logTag: {
                  errorType: 0,
                },
              },
            ],
            baseMsg:
              '{"responsestatus":{"timestamp":"2023-03-21T11:25:58.474+08:00","ack":"Success","errors":[],"build":null,"version":"2.0","extension":[]},"orderitems":[{"orderid":23294471356,"orderinfo":{"basicorderinfo":{"orderid":23294471356,"uid":"_TIKRnat0vzcz8yq","amount":220.0,"extorderid":"H2SF7U979","orderstatus":"S","flightclass":"I","totalamount":227.72,"actualamount":220.0,"flightagency":3890,"bookingchannel":"TF-WS","flightway":"S","relatedorders":[{"relatedorderid":23294197692,"relatedordertype":0,"agetype":"ADU"}],"leastpersons":1,"canrefundsingle":true,"isenglish":"T","paymentinfo":{"companyfeeinfos":null,"fltpayinfos":[{"paytype":"CCARD","paytypename":"信用卡","paytypecn":"信用卡","payamount":856.27,"bankcardinfoid":null,"ccardpayfeerate":null}],"externalno":"3ee52db1-b7d5-4c8c-a32f-68124657b566","merchantinformation":null,"ccardfee":0.0,"travelmoneyservicefee":0,"travelmoney":0,"voucherpaidmoney":0.0},"ifchibabaccompanyofadult":false,"paidforeignorder":true,"paidexchangerate":190.443107788,"paidforeignordertotalamout":43270.0,"exchangerate":0.005250912,"foreigncurrency":"KRW","foreignpaidamount":41800.0,"payforeigncurrency":"KRW","payexchangerate":0.0052,"payforeigncarry":"0","paidcurrency":"KRW","dimensiontype":2},"contactinfo":{"contactor":"홍 경자","confirmtype":null,"contacttelephone":"","contactemail":"han_EHWu2@naver.com#","foreignmobile":"1058227g97","countrycode":"82","countrycodedomestic":null},"additionallist":[{"additionaltype":"OrderSyncVersion","additionalvalue":"2"},{"additionaltype":"SearchBookWithoutId","additionalvalue":"T|0,1"},{"additionaltype":"MulticurrencyFlag","additionalvalue":"T"},{"additionaltype":"BookWithoutID","additionalvalue":"T"},{"additionaltype":"CouponRefundInfo","additionalvalue":[{"refundmode":"ByCp","couponnumber":"zrrdhzyxru"}]},{"additionaltype":"recommendprdtype2","additionalvalue":"0"}],"ordercouponlist":[{"couponnumber":"zrrdhzyxru","isused":"T","activitytheme":"항공권 할인코드 - 신규 회원 대상","activitydetails":null,"deductionamount":6.0,"unittypeid":2,"deductionstrategytypeid":3,"segmentlist":null,"passengertype":null,"totaldeduction":6.0,"promotionmethodid":1,"producttype":1,"subproducttype":0,"maxactivitycount":0,"cardsection":null,"paytype":0,"subpaytype":0,"datatype":1,"promotionid":741908394,"productorderid":0,"fdeductionamount":1000.0,"ftotaldeduction":1000.0,"currencytype":"KRW","extrainfo":"","productid":0}],"discountinfolist":null,"reimburseinfo":null},"flightinfos":[{"flight":"7C127","price":135,"tax":85,"subsidy":0,"pnr":"H668XP","rate":-1.0,"sequence":1,"flightindex":1000,"flightagencycode":"7C","operatingairline":null,"carrierflightno":"","ifshared":false,"takeofftime":"2023-05-30 18:15:00","arrivaltime":"2023-05-30 19:25:00","takeofftimegmt":"2023-05-30 09:15:00","arrivaltimegmt":"2023-05-30 10:25:00","aport":{"code":"CJU","name":"济州国际机场","nameen":null,"citycode":"CJU","cityname":"济州市","citynameen":null},"dport":{"code":"GMP","name":"金浦国际机场","nameen":null,"citycode":"SEL","cityname":"首尔","citynameen":null},"classgrade":"Y","airlinename":null,"subclass":"H","departairportbuildingentity":{"address":"","id":703,"name":"金浦国际机场国内航站楼","shortname":"国内航站楼","addressen":"","airportcode":"GMP","citycode":"SEL","cityid":274,"nameen":"Domestic Terminal of Gimpo International Airport","shortnameen":"Domestic Terminal of Gimpo Airport","smsname":"D"},"arriveairportbuildingentity":{"address":null,"id":0,"name":null,"shortname":null,"addressen":null,"airportcode":null,"citycode":null,"cityid":0,"nameen":null,"shortnameen":null,"smsname":null},"crafttypeentity":{"note":"波音737-800是最新改进的中型飞机，安全保障系统完善，机龄2年以内。","craftkind":"M","crafttype":"738","crafttypeename":"Boeing 737-800","ctname":"波音 737-800","maxseats":189,"minseats":144,"widthlevel":"N"},"extensionattribute":null,"printprice":0,"saleprice":140.0,"suppilerfdprice":0,"costprice":136.0,"oilfee":0.0,"ctripservicecharge":0.0,"supplierservicecharge":0.0,"airlineservicecharge":0.0,"officeno":"KRTF","ifsurface":"F","authorizeofficeno":null,"standardprice":0.0,"discountmode":0,"discountamount":0,"classareacode":null,"classareaname":null,"policytokenno":"23294471356#d232fd46-d111-4958-a2d6-1cde47331462#ADT","paidcurrency":"KRW","paidprice":25700.0,"paidtax":16100.0,"paidoilfee":0,"paidexchangerate":190.443107788,"pricerate":-1.0,"classtypename":"经济舱","ifsharedticketno":"F","sourcetype":0,"serviceno":926541072,"rebookapplyid":null,"segmentno":1,"flighttype":1,"throughflightno":null,"flightstops":null,"refundinfo":null},{"flight":"7C127","price":135,"tax":85,"subsidy":0,"pnr":"H668XP","rate":-1.0,"sequence":1,"flightindex":1001,"flightagencycode":"7C","operatingairline":null,"carrierflightno":"","ifshared":false,"takeofftime":"2023-05-30 18:15:00","arrivaltime":"2023-05-30 19:25:00","takeofftimegmt":"2023-05-30 09:15:00","arrivaltimegmt":"2023-05-30 10:25:00","aport":{"code":"CJU","name":"济州国际机场","nameen":null,"citycode":"CJU","cityname":"济州市","citynameen":null},"dport":{"code":"GMP","name":"金浦国际机场","nameen":null,"citycode":"SEL","cityname":"首尔","citynameen":null},"classgrade":"Y","airlinename":null,"subclass":"H","departairportbuildingentity":{"address":"","id":703,"name":"金浦国际机场国内航站楼","shortname":"国内航站楼","addressen":"","airportcode":"GMP","citycode":"SEL","cityid":274,"nameen":"Domestic Terminal of Gimpo International Airport","shortnameen":"Domestic Terminal of Gimpo Airport","smsname":"D"},"arriveairportbuildingentity":{"address":null,"id":0,"name":null,"shortname":null,"addressen":null,"airportcode":null,"citycode":null,"cityid":0,"nameen":null,"shortnameen":null,"smsname":null},"crafttypeentity":{"note":"波音737-800是最新改进的中型飞机，安全保障系统完善，机龄2年以内。","craftkind":"M","crafttype":"738","crafttypeename":"Boeing 737-800","ctname":"波音 737-800","maxseats":189,"minseats":144,"widthlevel":"N"},"extensionattribute":null,"printprice":0,"saleprice":140.0,"suppilerfdprice":0,"costprice":136.0,"oilfee":0.0,"ctripservicecharge":0.0,"supplierservicecharge":0.0,"airlineservicecharge":0.0,"officeno":"KRTF","ifsurface":"F","authorizeofficeno":null,"standardprice":0.0,"discountmode":0,"discountamount":0,"classareacode":null,"classareaname":null,"policytokenno":"23294471356#d232fd46-d111-4958-a2d6-1cde47331462#ADT","paidcurrency":"KRW","paidprice":25700.0,"paidtax":16100.0,"paidoilfee":0,"paidexchangerate":190.443107788,"pricerate":-1.0,"classtypename":"经济舱","ifsharedticketno":"T","sourcetype":0,"serviceno":926541072,"rebookapplyid":null,"segmentno":1,"flighttype":1,"throughflightno":null,"flightstops":null,"refundinfo":null}],"refundfeelist":[{"refundfeeid":1,"refundscene":0,"refundtype":1,"emdrefundtype":0,"basicrefundfeeinfo":{"currency":"KRW","refundable":null,"cancalculate":true,"refundprice":0,"refundrate":0,"currencyrate":190.443107788,"refundfee":0,"canrefundtax":false,"isurgent":false,"isrelatededuct":false,"isconsultmode":false,"discountamount":0,"isconstantrefundfee":false,"latestreplytime":"0001-01-01 08:00:00"},"servicefeedetail":{"refundfeebycarrier":0,"refundfeebyctrip":0,"refundfeebyconsolidator":0},"usefeedetail":{"usedamount":0,"usedcost":0,"usedtax":0},"emdfeedetail":null,"additionalfeedetailinfo":{"deductedtaxamount":0,"extensionattributeinfolist":null}},{"refundfeeid":2,"refundscene":0,"refundtype":2,"emdrefundtype":0,"basicrefundfeeinfo":{"currency":"KRW","refundable":null,"cancalculate":true,"refundprice":0,"refundrate":0,"currencyrate":190.443107788,"refundfee":0,"canrefundtax":false,"isurgent":false,"isrelatededuct":false,"isconsultmode":false,"discountamount":0,"isconstantrefundfee":false,"latestreplytime":"2023-03-22 21:45:43"},"servicefeedetail":{"refundfeebycarrier":0,"refundfeebyctrip":0,"refundfeebyconsolidator":0},"usefeedetail":{"usedamount":0,"usedcost":0,"usedtax":0},"emdfeedetail":null,"additionalfeedetailinfo":{"deductedtaxamount":0,"extensionattributeinfolist":null}},{"refundfeeid":3,"refundscene":0,"refundtype":4,"emdrefundtype":0,"basicrefundfeeinfo":{"currency":"KRW","refundable":null,"cancalculate":false,"refundprice":0,"refundrate":0,"currencyrate":190.443107788,"refundfee":0,"canrefundtax":false,"isurgent":false,"isrelatededuct":false,"isconsultmode":false,"discountamount":0,"isconstantrefundfee":false,"latestreplytime":"2023-03-27 14:45:43"},"servicefeedetail":{"refundfeebycarrier":0,"refundfeebyctrip":0,"refundfeebyconsolidator":0},"usefeedetail":{"usedamount":0,"usedcost":0,"usedtax":0},"emdfeedetail":null,"additionalfeedetailinfo":null},{"refundfeeid":4,"refundscene":0,"refundtype":5,"emdrefundtype":0,"basicrefundfeeinfo":{"currency":"KRW","refundable":null,"cancalculate":false,"refundprice":0,"refundrate":0,"currencyrate":190.443107788,"refundfee":0,"canrefundtax":false,"isurgent":false,"isrelatededuct":false,"isconsultmode":false,"discountamount":0,"isconstantrefundfee":false,"latestreplytime":"2023-03-27 14:45:43"},"servicefeedetail":{"refundfeebycarrier":0,"refundfeebyctrip":0,"refundfeebyconsolidator":0},"usefeedetail":{"usedamount":0,"usedcost":0,"usedtax":0},"emdfeedetail":null,"additionalfeedetailinfo":null},{"refundfeeid":5,"refundscene":0,"refundtype":6,"emdrefundtype":0,"basicrefundfeeinfo":{"currency":"KRW","refundable":null,"cancalculate":false,"refundprice":0,"refundrate":0,"currencyrate":190.443107788,"refundfee":0,"canrefundtax":false,"isurgent":false,"isrelatededuct":false,"isconsultmode":false,"discountamount":0,"isconstantrefundfee":false,"latestreplytime":"2023-03-27 14:45:43"},"servicefeedetail":{"refundfeebycarrier":0,"refundfeebyctrip":0,"refundfeebyconsolidator":0},"usefeedetail":{"usedamount":0,"usedcost":0,"usedtax":0},"emdfeedetail":null,"additionalfeedetailinfo":null},{"refundfeeid":6,"refundscene":0,"refundtype":9,"emdrefundtype":0,"basicrefundfeeinfo":{"currency":"KRW","refundable":null,"cancalculate":false,"refundprice":0,"refundrate":0,"currencyrate":190.443107788,"refundfee":0,"canrefundtax":false,"isurgent":false,"isrelatededuct":false,"isconsultmode":false,"discountamount":0,"isconstantrefundfee":false,"latestreplytime":"2023-03-27 14:45:43"},"servicefeedetail":{"refundfeebycarrier":0,"refundfeebyctrip":0,"refundfeebyconsolidator":0},"usefeedetail":{"usedamount":0,"usedcost":0,"usedtax":0},"emdfeedetail":null,"additionalfeedetailinfo":null}],"refundrebookinfobyorder":{"refundamountinfolist":[{"currency":null,"refundscene":0,"refundtype":1,"currencyexchangerate":0,"paycustomer":40800.0,"refundflight":25700.0,"refundtax":16100.0,"refundoilfee":0}],"refunddiscounts":null,"productdeductlist":null,"flightchangelist":[{"source":1,"associated":false,"changeorderid":0,"changedetailid":1,"refundlimitdate":"0001-01-01T00:00:00.000+00:00","canrefundall":false,"singletalk":false,"refusalcode":0,"refusalreason":null,"unverifiedflight":true,"feetype":null,"flightchangetype":null,"orderid":null}],"specialeventlist":null,"refundretirelist":null,"involreservedetaillist":null,"multiplecurrency":true},"segmentlist":[{"passenger":{"nationlity":"KR","birthday":"1967-06-10T00:00:00.000+08:00","gender":"F","passengername":"홍/경자","cardtype":2,"cardno":"G00oVcZ500#","passengertype":"NOR","agetype":"ADU","travelereligibilitycode":null,"bookinguser":"홍/경자","cardvalid":"2033-03-22T00:00:00.000+08:00","passengerid":1222871242028351523},"refundable":true,"rebookable":null,"interests":null,"flightindex":1000,"registrationcondition":null,"unrefundablereasoncode":"0","unrebookablereasoncode":null,"ticketinfo":{"ticketno":"0000001063","ticketstatus":null,"isticketstatusvalid":null,"ifused":null,"airlinecode":"806"},"originflightindexs":[1001],"passengerflightpriceinfo":{"paidcurrency":null,"basebookingfee":0,"paidbookingfee":0,"baseobfee":0,"paidobfee":0,"pricefeedetaillist":[{"cost":{"amount":136.0,"pricepayee":0},"tax":{"amount":85,"pricepayee":0},"pricetype":1,"saleprice":{"amount":140.0,"pricepayee":0},"printprice":{"amount":0,"pricepayee":0},"oilfee":{"amount":0.0,"pricepayee":0},"bookingfee":{"amount":null,"pricepayee":0},"obfee":{"amount":null,"pricepayee":0}},{"cost":null,"tax":{"amount":16100.0,"pricepayee":0},"pricetype":2,"saleprice":{"amount":25700.0,"pricepayee":0},"printprice":null,"oilfee":{"amount":null,"pricepayee":0},"bookingfee":{"amount":null,"pricepayee":0},"obfee":{"amount":null,"pricepayee":0}}]},"effectiveitineraryrefundfeelist":[{"flightindex":1001,"refundfeelist":[1,2,3,4,5,6],"productdeductlist":null,"retireid":0,"retiredetailid":0,"sretireid":0,"sretiredetailid":0,"eventid":0,"eventdetailid":0,"changeorderid":0,"changedetailid":1,"discountid":null,"canrefund":true,"unrefundablecode":"0","itineraryused":false,"seventid":0,"seventdetailid":0,"involreservedetailid":0,"policyrelationinfolist":null}],"triprecordrefundfeeinfo":{"flightindex":1000,"refundfeelist":[1,2,3,4,5,6],"productdeductlist":null,"retireid":0,"retiredetailid":0,"sretireid":0,"sretiredetailid":0,"eventid":0,"eventdetailid":0,"changeorderid":0,"changedetailid":1,"discountid":null,"canrefund":true,"unrefundablecode":"0","itineraryused":false,"seventid":0,"seventdetailid":0,"involreservedetailid":0,"policyrelationinfolist":null},"askretaininfos":[{"retaintype":"normal","canapplyretain":false,"specialeventconfigid":null,"eventconfigid":null,"canretainapplyrebook":null,"canretainapplyrefund":null,"allowchangetimes":null,"validtime":"2024-03-21T00:00:00.000+08:00","canapplychangedaterange":null,"changeoperatedaterange":null,"changeretainfeeinfo":null}],"rebookfeelist":null,"rebookinfolist":[],"retaininfo":null,"policyrefundfeetypelist":[{"starttime":null,"endtime":"2023-03-23 05:12:24","refundfee":0,"taxrefundonly":false,"emdrefundtype":0}],"mergerebookid":null,"productidinseglist":[{"type":4,"productid":23294803719,"existmutichange":null}],"productdeductidlist":null,"hasgotattachamount":null,"needactinginconcert":null,"sortedsequence":1,"productinfos":null,"triprecordflightfeeinfo":{"flightprice":25700.0,"taxfee":16100.0,"oilfee":0}}],"orderxinfo":{"xproductorderdetails":[{"sequence":1,"detailid":null,"productid":23294803719,"orderid":23294471356,"productorderid":23294194044,"productname":"境内旅行险","producttype":17,"costprice":0.0,"saleprice":7.72,"printprice":7.72,"discountamount":0,"productcount":1,"refundinfo":null,"refundsinfo":null,"rebookinfo":null,"rebooksinfo":null,"thirdpartorderid":null,"policyid":"CglJbnN1cmFuY2UQADpCCghJQlVLUkFOMhI2NWYwNWY3MzUtYTBiYi00YmI5LTgzODktYzVlZTJkYTE0NTJkITIwMjMwMzIyMDUzODQ4ODI1","originalsupplierprice":1470.0,"originalsuppliercurrency":"KRW","originalsaleprice":7.72,"originalprintprice":7.72,"originalcostprice":0.0,"ruleid":23,"paidcurrency":"KRW","paiddiscountamount":0,"paidoriginalprice":1470.0,"paidoriginalprintprice":null,"productdetailextendinfos":[{"extendkey":"PaymentVersion","extendvalue":"0"}],"bookingchannel":null,"orderstatus":"S","passengername":"홍/경자","ispaidforeignorder":true,"paidexchangerate":190.44310779,"productpolicytoken":"EEFDCF7EEABC00C1D08C884BBE29F44A","packageid":null,"productdescription":null,"expiredtime":null},{"sequence":1,"detailid":null,"productid":23294803756,"orderid":23294471356,"productorderid":23294193980,"productname":null,"producttype":1016,"costprice":0.0,"saleprice":6.0,"printprice":0.0,"discountamount":0.0,"productcount":1,"refundinfo":null,"refundsinfo":null,"rebookinfo":null,"rebooksinfo":null,"thirdpartorderid":null,"policyid":"EBYY2gEgBSkAAAAAAECPQDDuDzsLCgNLUlcRAAAAAABAj0AaA0tSVyEAAAAAAECPQCkAAAAAAAAYQDIBMTgFQgoxMDAuMDAwMDAwSgswLjAwNTI1MDkxMlABWggxLjAwMDAwMGEAAAAAAAAAAAw8SwoDRW52EgNQUk9MUAE=","originalsupplierprice":0.0,"originalsuppliercurrency":"KRW","originalsaleprice":6.0,"originalprintprice":0.0,"originalcostprice":0.0,"ruleid":102,"paidcurrency":"KRW","paiddiscountamount":0,"paidoriginalprice":1000.0,"paidoriginalprintprice":0.0,"productdetailextendinfos":null,"bookingchannel":"","orderstatus":"S","passengername":"홍/경자","ispaidforeignorder":true,"paidexchangerate":190.44310779,"productpolicytoken":"0DF4A7CF25202C14EE7796A96C1265E0","packageid":null,"productdescription":"","expiredtime":"2034-08-17 20:43:24"}],"xproductusedetails":[],"xproductflights":[{"productflightid":null,"orderid":23294471356,"productorderid":23294194044,"productid":23294803719,"flightno":"7C127","takeofftime":"2023-05-30 18:15:00","dport":"GMP","sectorid":1,"operatingflightno":null},{"productflightid":null,"orderid":23294471356,"productorderid":23294194044,"productid":23294803719,"flightno":"TW720","takeofftime":"2023-06-05 13:30:00","dport":"CJU","sectorid":1,"operatingflightno":null},{"productflightid":null,"orderid":23294471356,"productorderid":23294193980,"productid":23294803756,"flightno":"7C127","takeofftime":"2023-05-30 18:15:00","dport":"GMP","sectorid":1,"operatingflightno":null}],"xproductpassengers":[{"productpassengerid":null,"orderid":23294471356,"productorderid":23294194044,"productid":23294803719,"passengername":"홍/경자","clienttype":0,"passengerid":1222871242028351523},{"productpassengerid":null,"orderid":23294471356,"productorderid":23294193980,"productid":23294803756,"passengername":"홍/경자","clienttype":0,"passengerid":1222871242028351523}],"orderxrebookinfo":null,"orderpackagelist":null},"xproductrefundinfo":null,"xrefundinfos":[{"canrefundnum":0,"deductamount":null,"ifsucceed":false,"issueid":60103678122,"passengername":"홍/경자","productid":23294803756,"producttype":1016,"rebookid":null,"refundamount":null,"refundinfo":null,"ifalreadycancelled":false,"ifalreadycancelling":false,"refundbindtype":0,"refundoption":0,"packageid":null,"packcanrefund":null,"isdrawlottery":null,"refundfeeinfo":null,"cancalculate":false,"involuntarytype":null,"resultcode":null,"resultdesc":null,"paidrefundfeeinfo":null,"xproductrefunddetailinfolist":[{"refundable":false,"refundoption":0,"refundbindtype":0,"canrefundnum":0,"cancalculate":false,"resultcode":50101,"resultdesc":"product can not calculate","involuntarytype":1,"xrefundfeeinfo":null,"specialprocesstype":0,"exchangerefunddetaillist":null}],"refundrulewindowdetaillist":null},{"canrefundnum":1,"deductamount":0,"ifsucceed":true,"issueid":60103678121,"passengername":"홍/경자","productid":23294803719,"producttype":17,"rebookid":null,"refundamount":7.72,"refundinfo":null,"ifalreadycancelled":false,"ifalreadycancelling":false,"refundbindtype":0,"refundoption":0,"packageid":null,"packcanrefund":null,"isdrawlottery":null,"refundfeeinfo":{"currency":"CNY","type":null,"payamount":7.72,"refundfee":0,"refundfeerate":0},"cancalculate":true,"involuntarytype":null,"resultcode":null,"resultdesc":null,"paidrefundfeeinfo":[{"currency":"CNY","type":0,"payamount":7.72,"refundfee":0,"refundfeerate":0},{"currency":"KRW","type":1,"payamount":1470.0,"refundfee":0,"refundfeerate":0},{"currency":null,"type":2,"payamount":-1470.0,"refundfee":0,"refundfeerate":0}],"xproductrefunddetailinfolist":[{"refundable":true,"refundoption":0,"refundbindtype":0,"canrefundnum":1,"cancalculate":true,"resultcode":0,"resultdesc":null,"involuntarytype":1,"xrefundfeeinfo":[{"currency":"CNY","type":0,"payamount":7.72,"refundfee":0,"refundfeerate":0},{"currency":"KRW","type":1,"payamount":1470.0,"refundfee":0,"refundfeerate":0},{"currency":null,"type":2,"payamount":-1470.0,"refundfee":0,"refundfeerate":0}],"specialprocesstype":0,"exchangerefunddetaillist":null}],"refundrulewindowdetaillist":[{"starttime":"","endtime":"","refundtype":3,"refundfeeinfolist":[{"amount":0,"currency":"CNY","type":1},{"amount":7.72,"currency":"CNY","type":2}]}]}],"askresultcodes":null},{"orderid":23294197692,"orderinfo":{"basicorderinfo":{"orderid":23294197692,"uid":"_TIKRnat0vzcz8yq","amount":625.0,"extorderid":"E23LGJB6X","orderstatus":"S","flightclass":"I","totalamount":631.0,"actualamount":625.0,"flightagency":3890,"bookingchannel":"TF-WS","flightway":"S","relatedorders":[{"relatedorderid":23294471356,"relatedordertype":1,"agetype":"ADU"}],"leastpersons":1,"canrefundsingle":true,"isenglish":"T","paymentinfo":{"companyfeeinfos":null,"fltpayinfos":[{"paytype":"CCARD","paytypename":"信用卡","paytypecn":"信用卡","payamount":856.27,"bankcardinfoid":null,"ccardpayfeerate":null}],"externalno":"3ee52db1-b7d5-4c8c-a32f-68124657b566","merchantinformation":null,"ccardfee":0,"travelmoneyservicefee":0,"travelmoney":0,"voucherpaidmoney":0.0},"ifchibabaccompanyofadult":false,"paidforeignorder":true,"paidexchangerate":190.443107788,"paidforeignordertotalamout":119800.0,"exchangerate":0.005250912,"foreigncurrency":"KRW","foreignpaidamount":118800.0,"payforeigncurrency":"KRW","payexchangerate":0.0052,"payforeigncarry":"0","paidcurrency":"KRW","dimensiontype":2},"contactinfo":{"contactor":"홍 경자","confirmtype":null,"contacttelephone":"","contactemail":"han_EHWu2@naver.com#","foreignmobile":"1058227g97","countrycode":"82","countrycodedomestic":null},"additionallist":[{"additionaltype":"OrderSyncVersion","additionalvalue":"2"},{"additionaltype":"SearchBookWithoutId","additionalvalue":"T|0,1"},{"additionaltype":"MulticurrencyFlag","additionalvalue":"T"},{"additionaltype":"BookWithoutID","additionalvalue":"T"},{"additionaltype":"CouponRefundInfo","additionalvalue":[{"refundmode":"ByCp","couponnumber":"zrrdhzyxru"}]},{"additionaltype":"recommendprdtype2","additionalvalue":"0"}],"ordercouponlist":[],"discountinfolist":null,"reimburseinfo":null},"flightinfos":[{"flight":"TW720","price":540,"tax":85,"subsidy":0,"pnr":"HM99CC","rate":-1.0,"sequence":1,"flightindex":1000,"flightagencycode":"TW","operatingairline":null,"carrierflightno":"","ifshared":false,"takeofftime":"2023-06-05 13:30:00","arrivaltime":"2023-06-05 14:40:00","takeofftimegmt":"2023-06-05 04:30:00","arrivaltimegmt":"2023-06-05 05:40:00","aport":{"code":"GMP","name":"金浦国际机场","nameen":null,"citycode":"SEL","cityname":"首尔","citynameen":null},"dport":{"code":"CJU","name":"济州国际机场","nameen":null,"citycode":"CJU","cityname":"济州市","citynameen":null},"classgrade":"Y","airlinename":null,"subclass":"Y","departairportbuildingentity":{"address":null,"id":0,"name":null,"shortname":null,"addressen":null,"airportcode":null,"citycode":null,"cityid":0,"nameen":null,"shortnameen":null,"smsname":null},"arriveairportbuildingentity":{"address":null,"id":0,"name":null,"shortname":null,"addressen":null,"airportcode":null,"citycode":null,"cityid":0,"nameen":null,"shortnameen":null,"smsname":null},"crafttypeentity":{"note":"波音公司飞机安全保障系统完善，1967年4月9日原型机首次试飞，2000年1月，波音737成为历史上第一种累计飞行超过1亿小时的飞机。","craftkind":"M","crafttype":"737","crafttypeename":"Boeing 737","ctname":"波音 737","maxseats":189,"minseats":92,"widthlevel":"N"},"extensionattribute":null,"printprice":0,"saleprice":560.0,"suppilerfdprice":0,"costprice":557.0,"oilfee":0.0,"ctripservicecharge":0.0,"supplierservicecharge":0.0,"airlineservicecharge":0.0,"officeno":"KRTF","ifsurface":"F","authorizeofficeno":null,"standardprice":0.0,"discountmode":0,"discountamount":0,"classareacode":null,"classareaname":null,"policytokenno":"23294471356#ce8ae10e-6ca7-4a81-b0cd-b8599b8e4d4c#ADT","paidcurrency":"KRW","paidprice":102700.0,"paidtax":16100.0,"paidoilfee":0,"paidexchangerate":190.443107788,"pricerate":-1.0,"classtypename":"经济舱","ifsharedticketno":"F","sourcetype":0,"serviceno":926541073,"rebookapplyid":null,"segmentno":1,"flighttype":1,"throughflightno":null,"flightstops":null,"refundinfo":null},{"flight":"TW720","price":540,"tax":85,"subsidy":0,"pnr":"HM99CC","rate":-1.0,"sequence":1,"flightindex":1001,"flightagencycode":"TW","operatingairline":null,"carrierflightno":"","ifshared":false,"takeofftime":"2023-06-05 13:30:00","arrivaltime":"2023-06-05 14:40:00","takeofftimegmt":"2023-06-05 04:30:00","arrivaltimegmt":"2023-06-05 05:40:00","aport":{"code":"GMP","name":"金浦国际机场","nameen":null,"citycode":"SEL","cityname":"首尔","citynameen":null},"dport":{"code":"CJU","name":"济州国际机场","nameen":null,"citycode":"CJU","cityname":"济州市","citynameen":null},"classgrade":"Y","airlinename":null,"subclass":"Y","departairportbuildingentity":{"address":null,"id":0,"name":null,"shortname":null,"addressen":null,"airportcode":null,"citycode":null,"cityid":0,"nameen":null,"shortnameen":null,"smsname":null},"arriveairportbuildingentity":{"address":null,"id":0,"name":null,"shortname":null,"addressen":null,"airportcode":null,"citycode":null,"cityid":0,"nameen":null,"shortnameen":null,"smsname":null},"crafttypeentity":{"note":"波音公司飞机安全保障系统完善，1967年4月9日原型机首次试飞，2000年1月，波音737成为历史上第一种累计飞行超过1亿小时的飞机。","craftkind":"M","crafttype":"737","crafttypeename":"Boeing 737","ctname":"波音 737","maxseats":189,"minseats":92,"widthlevel":"N"},"extensionattribute":null,"printprice":0,"saleprice":560.0,"suppilerfdprice":0,"costprice":557.0,"oilfee":0.0,"ctripservicecharge":0.0,"supplierservicecharge":0.0,"airlineservicecharge":0.0,"officeno":"KRTF","ifsurface":"F","authorizeofficeno":null,"standardprice":0.0,"discountmode":0,"discountamount":0,"classareacode":null,"classareaname":null,"policytokenno":"23294471356#ce8ae10e-6ca7-4a81-b0cd-b8599b8e4d4c#ADT","paidcurrency":"KRW","paidprice":102700.0,"paidtax":16100.0,"paidoilfee":0,"paidexchangerate":190.443107788,"pricerate":-1.0,"classtypename":"经济舱","ifsharedticketno":"F","sourcetype":0,"serviceno":926541073,"rebookapplyid":null,"segmentno":1,"flighttype":1,"throughflightno":null,"flightstops":null,"refundinfo":null}],"refundfeelist":[{"refundfeeid":1,"refundscene":0,"refundtype":1,"emdrefundtype":0,"basicrefundfeeinfo":{"currency":"KRW","refundable":null,"cancalculate":true,"refundprice":0,"refundrate":0,"currencyrate":190.443107788,"refundfee":0,"canrefundtax":false,"isurgent":false,"isrelatededuct":false,"isconsultmode":false,"discountamount":0,"isconstantrefundfee":false,"latestreplytime":"0001-01-01 08:00:00"},"servicefeedetail":{"refundfeebycarrier":0,"refundfeebyctrip":0,"refundfeebyconsolidator":0},"usefeedetail":{"usedamount":0,"usedcost":0,"usedtax":0},"emdfeedetail":null,"additionalfeedetailinfo":{"deductedtaxamount":0,"extensionattributeinfolist":null}},{"refundfeeid":2,"refundscene":0,"refundtype":2,"emdrefundtype":0,"basicrefundfeeinfo":{"currency":"KRW","refundable":null,"cancalculate":true,"refundprice":0,"refundrate":0,"currencyrate":190.443107788,"refundfee":0,"canrefundtax":false,"isurgent":false,"isrelatededuct":false,"isconsultmode":false,"discountamount":0,"isconstantrefundfee":false,"latestreplytime":"2023-03-22 21:45:43"},"servicefeedetail":{"refundfeebycarrier":0,"refundfeebyctrip":0,"refundfeebyconsolidator":0},"usefeedetail":{"usedamount":0,"usedcost":0,"usedtax":0},"emdfeedetail":null,"additionalfeedetailinfo":{"deductedtaxamount":0,"extensionattributeinfolist":null}},{"refundfeeid":3,"refundscene":0,"refundtype":4,"emdrefundtype":0,"basicrefundfeeinfo":{"currency":"KRW","refundable":null,"cancalculate":false,"refundprice":0,"refundrate":0,"currencyrate":190.443107788,"refundfee":0,"canrefundtax":false,"isurgent":false,"isrelatededuct":false,"isconsultmode":false,"discountamount":0,"isconstantrefundfee":false,"latestreplytime":"2023-03-27 14:45:43"},"servicefeedetail":{"refundfeebycarrier":0,"refundfeebyctrip":0,"refundfeebyconsolidator":0},"usefeedetail":{"usedamount":0,"usedcost":0,"usedtax":0},"emdfeedetail":null,"additionalfeedetailinfo":null},{"refundfeeid":4,"refundscene":0,"refundtype":5,"emdrefundtype":0,"basicrefundfeeinfo":{"currency":"KRW","refundable":null,"cancalculate":false,"refundprice":0,"refundrate":0,"currencyrate":190.443107788,"refundfee":0,"canrefundtax":false,"isurgent":false,"isrelatededuct":false,"isconsultmode":false,"discountamount":0,"isconstantrefundfee":false,"latestreplytime":"2023-03-27 14:45:43"},"servicefeedetail":{"refundfeebycarrier":0,"refundfeebyctrip":0,"refundfeebyconsolidator":0},"usefeedetail":{"usedamount":0,"usedcost":0,"usedtax":0},"emdfeedetail":null,"additionalfeedetailinfo":null},{"refundfeeid":5,"refundscene":0,"refundtype":6,"emdrefundtype":0,"basicrefundfeeinfo":{"currency":"KRW","refundable":null,"cancalculate":false,"refundprice":0,"refundrate":0,"currencyrate":190.443107788,"refundfee":0,"canrefundtax":false,"isurgent":false,"isrelatededuct":false,"isconsultmode":false,"discountamount":0,"isconstantrefundfee":false,"latestreplytime":"2023-03-27 14:45:43"},"servicefeedetail":{"refundfeebycarrier":0,"refundfeebyctrip":0,"refundfeebyconsolidator":0},"usefeedetail":{"usedamount":0,"usedcost":0,"usedtax":0},"emdfeedetail":null,"additionalfeedetailinfo":null},{"refundfeeid":6,"refundscene":0,"refundtype":9,"emdrefundtype":0,"basicrefundfeeinfo":{"currency":"KRW","refundable":null,"cancalculate":false,"refundprice":0,"refundrate":0,"currencyrate":190.443107788,"refundfee":0,"canrefundtax":false,"isurgent":false,"isrelatededuct":false,"isconsultmode":false,"discountamount":0,"isconstantrefundfee":false,"latestreplytime":"2023-03-27 14:45:43"},"servicefeedetail":{"refundfeebycarrier":0,"refundfeebyctrip":0,"refundfeebyconsolidator":0},"usefeedetail":{"usedamount":0,"usedcost":0,"usedtax":0},"emdfeedetail":null,"additionalfeedetailinfo":null}],"refundrebookinfobyorder":{"refundamountinfolist":[{"currency":null,"refundscene":0,"refundtype":1,"currencyexchangerate":0,"paycustomer":118800.0,"refundflight":102700.0,"refundtax":16100.0,"refundoilfee":0}],"refunddiscounts":null,"productdeductlist":null,"flightchangelist":[{"source":1,"associated":false,"changeorderid":0,"changedetailid":1,"refundlimitdate":"0001-01-01T00:00:00.000+00:00","canrefundall":false,"singletalk":false,"refusalcode":0,"refusalreason":null,"unverifiedflight":true,"feetype":null,"flightchangetype":null,"orderid":null}],"specialeventlist":null,"refundretirelist":null,"involreservedetaillist":null,"multiplecurrency":true},"segmentlist":[{"passenger":{"nationlity":"KR","birthday":"1967-06-10T00:00:00.000+08:00","gender":"F","passengername":"홍/경자","cardtype":2,"cardno":"G00oVcZ500#","passengertype":"NOR","agetype":"ADU","travelereligibilitycode":null,"bookinguser":"홍/경자","cardvalid":"2033-03-22T00:00:00.000+08:00","passengerid":1222871242028351523},"refundable":true,"rebookable":null,"interests":null,"flightindex":1000,"registrationcondition":null,"unrefundablereasoncode":"0","unrebookablereasoncode":null,"ticketinfo":{"ticketno":"","ticketstatus":null,"isticketstatusvalid":null,"ifused":null,"airlinecode":"722"},"originflightindexs":[1001],"passengerflightpriceinfo":{"paidcurrency":null,"basebookingfee":0,"paidbookingfee":0,"baseobfee":0,"paidobfee":0,"pricefeedetaillist":[{"cost":{"amount":557.0,"pricepayee":0},"tax":{"amount":85,"pricepayee":0},"pricetype":1,"saleprice":{"amount":560.0,"pricepayee":0},"printprice":{"amount":0,"pricepayee":0},"oilfee":{"amount":0.0,"pricepayee":0},"bookingfee":{"amount":null,"pricepayee":0},"obfee":{"amount":null,"pricepayee":0}},{"cost":null,"tax":{"amount":16100.0,"pricepayee":0},"pricetype":2,"saleprice":{"amount":102700.0,"pricepayee":0},"printprice":null,"oilfee":{"amount":null,"pricepayee":0},"bookingfee":{"amount":null,"pricepayee":0},"obfee":{"amount":null,"pricepayee":0}}]},"effectiveitineraryrefundfeelist":[{"flightindex":1001,"refundfeelist":[1,2,3,4,5,6],"productdeductlist":null,"retireid":0,"retiredetailid":0,"sretireid":0,"sretiredetailid":0,"eventid":0,"eventdetailid":0,"changeorderid":0,"changedetailid":1,"discountid":null,"canrefund":true,"unrefundablecode":"0","itineraryused":false,"seventid":0,"seventdetailid":0,"involreservedetailid":0,"policyrelationinfolist":null}],"triprecordrefundfeeinfo":{"flightindex":1000,"refundfeelist":[1,2,3,4,5,6],"productdeductlist":null,"retireid":0,"retiredetailid":0,"sretireid":0,"sretiredetailid":0,"eventid":0,"eventdetailid":0,"changeorderid":0,"changedetailid":1,"discountid":null,"canrefund":true,"unrefundablecode":"0","itineraryused":false,"seventid":0,"seventdetailid":0,"involreservedetailid":0,"policyrelationinfolist":null},"askretaininfos":[{"retaintype":null,"canapplyretain":false,"specialeventconfigid":null,"eventconfigid":null,"canretainapplyrebook":null,"canretainapplyrefund":null,"allowchangetimes":null,"validtime":"2024-03-21T00:00:00.000+08:00","canapplychangedaterange":null,"changeoperatedaterange":null,"changeretainfeeinfo":null}],"rebookfeelist":null,"rebookinfolist":[],"retaininfo":null,"policyrefundfeetypelist":[{"starttime":null,"endtime":"2023-03-23 05:12:24","refundfee":0,"taxrefundonly":false,"emdrefundtype":0}],"mergerebookid":null,"productidinseglist":null,"productdeductidlist":null,"hasgotattachamount":null,"needactinginconcert":null,"sortedsequence":1,"productinfos":null,"triprecordflightfeeinfo":{"flightprice":102700.0,"taxfee":16100.0,"oilfee":0}}],"orderxinfo":{"xproductorderdetails":[{"sequence":1,"detailid":null,"productid":23294803724,"orderid":23294197692,"productorderid":23294193788,"productname":null,"producttype":1016,"costprice":0.0,"saleprice":6.0,"printprice":0.0,"discountamount":0.0,"productcount":1,"refundinfo":null,"refundsinfo":null,"rebookinfo":null,"rebooksinfo":null,"thirdpartorderid":null,"policyid":"EBYY2gEgBSkAAAAAAECPQDDuDzsLCgNLUlcRAAAAAABAj0AaA0tSVyEAAAAAAECPQCkAAAAAAAAYQDIBMTgFQgoxMDAuMDAwMDAwSgswLjAwNTI1MDkxMlABWggxLjAwMDAwMGEAAAAAAAAAAAw8SwoDRW52EgNQUk9MUAE=","originalsupplierprice":0.0,"originalsuppliercurrency":"KRW","originalsaleprice":6.0,"originalprintprice":0.0,"originalcostprice":0.0,"ruleid":102,"paidcurrency":"KRW","paiddiscountamount":0,"paidoriginalprice":1000.0,"paidoriginalprintprice":0.0,"productdetailextendinfos":null,"bookingchannel":"","orderstatus":"S","passengername":"홍/경자","ispaidforeignorder":true,"paidexchangerate":190.44310779,"productpolicytoken":"0DF4A7CF25202C14EE7796A96C1265E0","packageid":null,"productdescription":"","expiredtime":"2034-08-17 20:43:24"}],"xproductusedetails":[],"xproductflights":[{"productflightid":null,"orderid":23294197692,"productorderid":23294193788,"productid":23294803724,"flightno":"TW720","takeofftime":"2023-06-05 13:30:00","dport":"CJU","sectorid":1,"operatingflightno":null}],"xproductpassengers":[{"productpassengerid":null,"orderid":23294197692,"productorderid":23294193788,"productid":23294803724,"passengername":"홍/경자","clienttype":0,"passengerid":1222871242028351523}],"orderxrebookinfo":null,"orderpackagelist":null},"xproductrefundinfo":null,"xrefundinfos":[{"canrefundnum":0,"deductamount":null,"ifsucceed":false,"issueid":60103678116,"passengername":"홍/경자","productid":23294803724,"producttype":1016,"rebookid":null,"refundamount":null,"refundinfo":null,"ifalreadycancelled":false,"ifalreadycancelling":false,"refundbindtype":0,"refundoption":0,"packageid":null,"packcanrefund":null,"isdrawlottery":null,"refundfeeinfo":null,"cancalculate":false,"involuntarytype":null,"resultcode":null,"resultdesc":null,"paidrefundfeeinfo":null,"xproductrefunddetailinfolist":[{"refundable":false,"refundoption":0,"refundbindtype":0,"canrefundnum":0,"cancalculate":false,"resultcode":50101,"resultdesc":"product can not calculate","involuntarytype":1,"xrefundfeeinfo":null,"specialprocesstype":0,"exchangerefunddetaillist":null}],"refundrulewindowdetaillist":null}],"askresultcodes":null}],"responsehead":{"serverip":"10.130.248.39","elapsedtime":2117,"resultstatus":{"resultinfo":{"code":0,"message":"Success","fieldname":null},"detailinfolist":null}}}',
            testMsg:
              '{"responsestatus":{"timestamp":"2023-03-22T16:42:59.667+08:00","ack":"Success","errors":[],"build":null,"version":"2.0","extension":[]},"orderitems":[{"orderid":23294471356,"orderinfo":{"basicorderinfo":{"orderid":23294471356,"uid":"_TIKRnat0vzcz8yq","amount":220.0,"extorderid":"H2SF7U979","orderstatus":"S","flightclass":"I","totalamount":227.72,"actualamount":220.0,"flightagency":3890,"bookingchannel":"TF-WS","flightway":"S","relatedorders":[{"relatedorderid":23294197692,"relatedordertype":0,"agetype":"ADU"}],"leastpersons":1,"canrefundsingle":true,"isenglish":"T","paymentinfo":{"companyfeeinfos":null,"fltpayinfos":[{"paytype":"CCARD","paytypename":"信用卡","paytypecn":"信用卡","payamount":856.27,"bankcardinfoid":null,"ccardpayfeerate":null}],"externalno":"3ee52db1-b7d5-4c8c-a32f-68124657b566","merchantinformation":null,"ccardfee":0.0,"travelmoneyservicefee":0,"travelmoney":0,"voucherpaidmoney":0.0},"ifchibabaccompanyofadult":false,"paidforeignorder":true,"paidexchangerate":190.443107788,"paidforeignordertotalamout":43270.0,"exchangerate":0.005250912,"foreigncurrency":"KRW","foreignpaidamount":41800.0,"payforeigncurrency":"KRW","payexchangerate":0.0052,"payforeigncarry":"0","paidcurrency":"KRW","dimensiontype":2},"contactinfo":{"contactor":"홍 경자","confirmtype":null,"contacttelephone":"","contactemail":"han_EHWu2@naver.com#","foreignmobile":"1058227g97","countrycode":"82","countrycodedomestic":null},"additionallist":[{"additionaltype":"OrderSyncVersion","additionalvalue":"2"},{"additionaltype":"SearchBookWithoutId","additionalvalue":"T|0,1"},{"additionaltype":"MulticurrencyFlag","additionalvalue":"T"},{"additionaltype":"BookWithoutID","additionalvalue":"T"},{"additionaltype":"CouponRefundInfo","additionalvalue":[{"refundmode":"ByCp","couponnumber":"zrrdhzyxru"}]},{"additionaltype":"recommendprdtype2","additionalvalue":"0"}],"ordercouponlist":[{"couponnumber":"zrrdhzyxru","isused":"T","activitytheme":"항공권 할인코드 - 신규 회원 대상","activitydetails":null,"deductionamount":6.0,"unittypeid":2,"deductionstrategytypeid":3,"segmentlist":null,"passengertype":null,"totaldeduction":6.0,"promotionmethodid":1,"producttype":1,"subproducttype":0,"maxactivitycount":0,"cardsection":null,"paytype":0,"subpaytype":0,"datatype":1,"promotionid":741908394,"productorderid":0,"fdeductionamount":1000.0,"ftotaldeduction":1000.0,"currencytype":"KRW","extrainfo":"","productid":0}],"discountinfolist":null,"reimburseinfo":null},"flightinfos":[{"flight":null,"price":null,"tax":null,"subsidy":null,"pnr":null,"rate":null,"sequence":null,"flightindex":null,"flightagencycode":null,"operatingairline":null,"carrierflightno":null,"ifshared":null,"takeofftime":null,"arrivaltime":null,"takeofftimegmt":null,"arrivaltimegmt":null,"aport":null,"dport":null,"classgrade":null,"airlinename":null,"subclass":null,"departairportbuildingentity":null,"arriveairportbuildingentity":null,"crafttypeentity":null,"extensionattribute":null,"printprice":null,"saleprice":null,"suppilerfdprice":null,"costprice":null,"oilfee":null,"ctripservicecharge":null,"supplierservicecharge":null,"airlineservicecharge":null,"officeno":null,"ifsurface":null,"authorizeofficeno":null,"standardprice":null,"discountmode":null,"discountamount":null,"classareacode":null,"classareaname":null,"policytokenno":null,"paidcurrency":null,"paidprice":null,"paidtax":null,"paidoilfee":null,"paidexchangerate":null,"pricerate":null,"classtypename":null,"ifsharedticketno":null,"sourcetype":null,"serviceno":null,"rebookapplyid":null,"segmentno":null,"flighttype":null,"throughflightno":null,"flightstops":null,"refundinfo":null},{"flight":null,"price":null,"tax":null,"subsidy":null,"pnr":null,"rate":null,"sequence":null,"flightindex":null,"flightagencycode":null,"operatingairline":null,"carrierflightno":null,"ifshared":null,"takeofftime":null,"arrivaltime":null,"takeofftimegmt":null,"arrivaltimegmt":null,"aport":null,"dport":null,"classgrade":null,"airlinename":null,"subclass":null,"departairportbuildingentity":null,"arriveairportbuildingentity":null,"crafttypeentity":null,"extensionattribute":null,"printprice":null,"saleprice":null,"suppilerfdprice":null,"costprice":null,"oilfee":null,"ctripservicecharge":null,"supplierservicecharge":null,"airlineservicecharge":null,"officeno":null,"ifsurface":null,"authorizeofficeno":null,"standardprice":null,"discountmode":null,"discountamount":null,"classareacode":null,"classareaname":null,"policytokenno":null,"paidcurrency":null,"paidprice":null,"paidtax":null,"paidoilfee":null,"paidexchangerate":null,"pricerate":null,"classtypename":null,"ifsharedticketno":null,"sourcetype":null,"serviceno":null,"rebookapplyid":null,"segmentno":null,"flighttype":null,"throughflightno":null,"flightstops":null,"refundinfo":null}],"refundfeelist":[{"refundfeeid":1,"refundscene":0,"refundtype":1,"emdrefundtype":0,"basicrefundfeeinfo":{"currency":"KRW","refundable":null,"cancalculate":true,"refundprice":0,"refundrate":0,"currencyrate":190.443107788,"refundfee":0,"canrefundtax":false,"isurgent":false,"isrelatededuct":false,"isconsultmode":false,"discountamount":0,"isconstantrefundfee":false,"latestreplytime":"0001-01-01 08:00:00"},"servicefeedetail":{"refundfeebycarrier":0,"refundfeebyctrip":0,"refundfeebyconsolidator":0},"usefeedetail":{"usedamount":0,"usedcost":0,"usedtax":0},"emdfeedetail":null,"additionalfeedetailinfo":{"deductedtaxamount":0,"extensionattributeinfolist":null}},{"refundfeeid":2,"refundscene":0,"refundtype":2,"emdrefundtype":0,"basicrefundfeeinfo":{"currency":"KRW","refundable":null,"cancalculate":true,"refundprice":0,"refundrate":0,"currencyrate":190.443107788,"refundfee":0,"canrefundtax":false,"isurgent":false,"isrelatededuct":false,"isconsultmode":false,"discountamount":0,"isconstantrefundfee":false,"latestreplytime":"2023-03-22 21:45:43"},"servicefeedetail":{"refundfeebycarrier":0,"refundfeebyctrip":0,"refundfeebyconsolidator":0},"usefeedetail":{"usedamount":0,"usedcost":0,"usedtax":0},"emdfeedetail":null,"additionalfeedetailinfo":{"deductedtaxamount":0,"extensionattributeinfolist":null}},{"refundfeeid":3,"refundscene":0,"refundtype":4,"emdrefundtype":0,"basicrefundfeeinfo":{"currency":"KRW","refundable":null,"cancalculate":false,"refundprice":0,"refundrate":0,"currencyrate":190.443107788,"refundfee":0,"canrefundtax":false,"isurgent":false,"isrelatededuct":false,"isconsultmode":false,"discountamount":0,"isconstantrefundfee":false,"latestreplytime":"2023-03-27 14:45:43"},"servicefeedetail":{"refundfeebycarrier":0,"refundfeebyctrip":0,"refundfeebyconsolidator":0},"usefeedetail":{"usedamount":0,"usedcost":0,"usedtax":0},"emdfeedetail":null,"additionalfeedetailinfo":null},{"refundfeeid":4,"refundscene":0,"refundtype":5,"emdrefundtype":0,"basicrefundfeeinfo":{"currency":"KRW","refundable":null,"cancalculate":false,"refundprice":0,"refundrate":0,"currencyrate":190.443107788,"refundfee":0,"canrefundtax":false,"isurgent":false,"isrelatededuct":false,"isconsultmode":false,"discountamount":0,"isconstantrefundfee":false,"latestreplytime":"2023-03-27 14:45:43"},"servicefeedetail":{"refundfeebycarrier":0,"refundfeebyctrip":0,"refundfeebyconsolidator":0},"usefeedetail":{"usedamount":0,"usedcost":0,"usedtax":0},"emdfeedetail":null,"additionalfeedetailinfo":null},{"refundfeeid":5,"refundscene":0,"refundtype":6,"emdrefundtype":0,"basicrefundfeeinfo":{"currency":"KRW","refundable":null,"cancalculate":false,"refundprice":0,"refundrate":0,"currencyrate":190.443107788,"refundfee":0,"canrefundtax":false,"isurgent":false,"isrelatededuct":false,"isconsultmode":false,"discountamount":0,"isconstantrefundfee":false,"latestreplytime":"2023-03-27 14:45:43"},"servicefeedetail":{"refundfeebycarrier":0,"refundfeebyctrip":0,"refundfeebyconsolidator":0},"usefeedetail":{"usedamount":0,"usedcost":0,"usedtax":0},"emdfeedetail":null,"additionalfeedetailinfo":null},{"refundfeeid":6,"refundscene":0,"refundtype":9,"emdrefundtype":0,"basicrefundfeeinfo":{"currency":"KRW","refundable":null,"cancalculate":false,"refundprice":0,"refundrate":0,"currencyrate":190.443107788,"refundfee":0,"canrefundtax":false,"isurgent":false,"isrelatededuct":false,"isconsultmode":false,"discountamount":0,"isconstantrefundfee":false,"latestreplytime":"2023-03-27 14:45:43"},"servicefeedetail":{"refundfeebycarrier":0,"refundfeebyctrip":0,"refundfeebyconsolidator":0},"usefeedetail":{"usedamount":0,"usedcost":0,"usedtax":0},"emdfeedetail":null,"additionalfeedetailinfo":null}],"refundrebookinfobyorder":{"refundamountinfolist":[{"currency":null,"refundscene":0,"refundtype":1,"currencyexchangerate":0,"paycustomer":118800.0,"refundflight":102700.0,"refundtax":16100.0,"refundoilfee":0}],"refunddiscounts":null,"productdeductlist":null,"flightchangelist":[{"source":1,"associated":false,"changeorderid":0,"changedetailid":1,"refundlimitdate":"0001-01-01T00:00:00.000+00:00","canrefundall":false,"singletalk":false,"refusalcode":0,"refusalreason":null,"unverifiedflight":true,"feetype":null,"flightchangetype":null,"orderid":null}],"specialeventlist":null,"refundretirelist":null,"involreservedetaillist":null,"multiplecurrency":true},"segmentlist":[{"passenger":{"nationlity":"KR","birthday":"1967-06-10T00:00:00.000+08:00","gender":"F","passengername":"홍/경자","cardtype":2,"cardno":"G00oVcZ500#","passengertype":"NOR","agetype":"ADU","travelereligibilitycode":null,"bookinguser":"홍/경자","cardvalid":"2033-03-22T00:00:00.000+08:00","passengerid":1222871242028351523},"refundable":true,"rebookable":null,"interests":null,"flightindex":1000,"registrationcondition":null,"unrefundablereasoncode":"0","unrebookablereasoncode":null,"ticketinfo":{"ticketno":"","ticketstatus":null,"isticketstatusvalid":null,"ifused":null,"airlinecode":"722"},"originflightindexs":null,"passengerflightpriceinfo":null,"effectiveitineraryrefundfeelist":[{"flightindex":1001,"refundfeelist":[1,2,3,4,5,6],"productdeductlist":null,"retireid":0,"retiredetailid":0,"sretireid":0,"sretiredetailid":0,"eventid":0,"eventdetailid":0,"changeorderid":0,"changedetailid":1,"discountid":null,"canrefund":true,"unrefundablecode":"0","itineraryused":false,"seventid":0,"seventdetailid":0,"involreservedetailid":0,"policyrelationinfolist":null}],"triprecordrefundfeeinfo":{"flightindex":1000,"refundfeelist":[1,2,3,4,5,6],"productdeductlist":null,"retireid":0,"retiredetailid":0,"sretireid":0,"sretiredetailid":0,"eventid":0,"eventdetailid":0,"changeorderid":0,"changedetailid":1,"discountid":null,"canrefund":true,"unrefundablecode":"0","itineraryused":false,"seventid":0,"seventdetailid":0,"involreservedetailid":0,"policyrelationinfolist":null},"askretaininfos":null,"rebookfeelist":null,"rebookinfolist":[],"retaininfo":null,"policyrefundfeetypelist":[{"starttime":null,"endtime":"2023-03-23 05:12:24","refundfee":0,"taxrefundonly":false,"emdrefundtype":0}],"mergerebookid":null,"productidinseglist":[],"productdeductidlist":null,"hasgotattachamount":null,"needactinginconcert":null,"sortedsequence":null,"productinfos":null,"triprecordflightfeeinfo":{"flightprice":0,"taxfee":0,"oilfee":0}}],"orderxinfo":{"xproductorderdetails":[{"sequence":1,"detailid":null,"productid":23294803719,"orderid":23294471356,"productorderid":23294194044,"productname":"境内旅行险","producttype":17,"costprice":0.0,"saleprice":7.72,"printprice":7.72,"discountamount":0,"productcount":1,"refundinfo":null,"refundsinfo":null,"rebookinfo":null,"rebooksinfo":null,"thirdpartorderid":null,"policyid":"CglJbnN1cmFuY2UQADpCCghJQlVLUkFOMhI2NWYwNWY3MzUtYTBiYi00YmI5LTgzODktYzVlZTJkYTE0NTJkITIwMjMwMzIyMDUzODQ4ODI1","originalsupplierprice":1470.0,"originalsuppliercurrency":"KRW","originalsaleprice":7.72,"originalprintprice":7.72,"originalcostprice":0.0,"ruleid":23,"paidcurrency":"KRW","paiddiscountamount":0,"paidoriginalprice":1470.0,"paidoriginalprintprice":null,"productdetailextendinfos":[{"extendkey":"PaymentVersion","extendvalue":"0"}],"bookingchannel":null,"orderstatus":"S","passengername":"홍/경자","ispaidforeignorder":true,"paidexchangerate":190.44310779,"productpolicytoken":"EEFDCF7EEABC00C1D08C884BBE29F44A","packageid":null,"productdescription":null,"expiredtime":null},{"sequence":1,"detailid":null,"productid":23294803756,"orderid":23294471356,"productorderid":23294193980,"productname":null,"producttype":1016,"costprice":0.0,"saleprice":6.0,"printprice":0.0,"discountamount":0.0,"productcount":1,"refundinfo":null,"refundsinfo":null,"rebookinfo":null,"rebooksinfo":null,"thirdpartorderid":null,"policyid":"EBYY2gEgBSkAAAAAAECPQDDuDzsLCgNLUlcRAAAAAABAj0AaA0tSVyEAAAAAAECPQCkAAAAAAAAYQDIBMTgFQgoxMDAuMDAwMDAwSgswLjAwNTI1MDkxMlABWggxLjAwMDAwMGEAAAAAAAAAAAw8SwoDRW52EgNQUk9MUAE=","originalsupplierprice":0.0,"originalsuppliercurrency":"KRW","originalsaleprice":6.0,"originalprintprice":0.0,"originalcostprice":0.0,"ruleid":102,"paidcurrency":"KRW","paiddiscountamount":0,"paidoriginalprice":1000.0,"paidoriginalprintprice":0.0,"productdetailextendinfos":null,"bookingchannel":"","orderstatus":"S","passengername":"홍/경자","ispaidforeignorder":true,"paidexchangerate":190.44310779,"productpolicytoken":"0DF4A7CF25202C14EE7796A96C1265E0","packageid":null,"productdescription":"","expiredtime":"2034-08-17 20:43:24"}],"xproductusedetails":[],"xproductflights":[{"productflightid":null,"orderid":23294471356,"productorderid":23294194044,"productid":23294803719,"flightno":"7C127","takeofftime":"2023-05-30 18:15:00","dport":"GMP","sectorid":1,"operatingflightno":null},{"productflightid":null,"orderid":23294471356,"productorderid":23294194044,"productid":23294803719,"flightno":"TW720","takeofftime":"2023-06-05 13:30:00","dport":"CJU","sectorid":1,"operatingflightno":null},{"productflightid":null,"orderid":23294471356,"productorderid":23294193980,"productid":23294803756,"flightno":"7C127","takeofftime":"2023-05-30 18:15:00","dport":"GMP","sectorid":1,"operatingflightno":null}],"xproductpassengers":[{"productpassengerid":null,"orderid":23294471356,"productorderid":23294194044,"productid":23294803719,"passengername":"홍/경자","clienttype":0,"passengerid":1222871242028351523},{"productpassengerid":null,"orderid":23294471356,"productorderid":23294193980,"productid":23294803756,"passengername":"홍/경자","clienttype":0,"passengerid":1222871242028351523}],"orderxrebookinfo":null,"orderpackagelist":null},"xproductrefundinfo":null,"xrefundinfos":[{"canrefundnum":0,"deductamount":null,"ifsucceed":false,"issueid":60103678122,"passengername":"홍/경자","productid":23294803756,"producttype":1016,"rebookid":null,"refundamount":null,"refundinfo":null,"ifalreadycancelled":false,"ifalreadycancelling":false,"refundbindtype":0,"refundoption":0,"packageid":null,"packcanrefund":null,"isdrawlottery":null,"refundfeeinfo":null,"cancalculate":false,"involuntarytype":null,"resultcode":null,"resultdesc":null,"paidrefundfeeinfo":null,"xproductrefunddetailinfolist":[{"refundable":false,"refundoption":0,"refundbindtype":0,"canrefundnum":0,"cancalculate":false,"resultcode":50101,"resultdesc":"product can not calculate","involuntarytype":1,"xrefundfeeinfo":null,"specialprocesstype":0,"exchangerefunddetaillist":null}],"refundrulewindowdetaillist":null},{"canrefundnum":1,"deductamount":0,"ifsucceed":true,"issueid":60103678121,"passengername":"홍/경자","productid":23294803719,"producttype":17,"rebookid":null,"refundamount":7.72,"refundinfo":null,"ifalreadycancelled":false,"ifalreadycancelling":false,"refundbindtype":0,"refundoption":0,"packageid":null,"packcanrefund":null,"isdrawlottery":null,"refundfeeinfo":{"currency":"CNY","type":null,"payamount":7.72,"refundfee":0,"refundfeerate":0},"cancalculate":true,"involuntarytype":null,"resultcode":null,"resultdesc":null,"paidrefundfeeinfo":[{"currency":"CNY","type":0,"payamount":7.72,"refundfee":0,"refundfeerate":0},{"currency":"KRW","type":1,"payamount":1470.0,"refundfee":0,"refundfeerate":0},{"currency":null,"type":2,"payamount":-1470.0,"refundfee":0,"refundfeerate":0}],"xproductrefunddetailinfolist":[{"refundable":true,"refundoption":0,"refundbindtype":0,"canrefundnum":1,"cancalculate":true,"resultcode":0,"resultdesc":null,"involuntarytype":1,"xrefundfeeinfo":[{"currency":"CNY","type":0,"payamount":7.72,"refundfee":0,"refundfeerate":0},{"currency":"KRW","type":1,"payamount":1470.0,"refundfee":0,"refundfeerate":0},{"currency":null,"type":2,"payamount":-1470.0,"refundfee":0,"refundfeerate":0}],"specialprocesstype":0,"exchangerefunddetaillist":null}],"refundrulewindowdetaillist":[{"starttime":"","endtime":"","refundtype":3,"refundfeeinfolist":[{"amount":0,"currency":"CNY","type":1},{"amount":7.72,"currency":"CNY","type":2}]}]}],"askresultcodes":null},{"orderid":23294197692,"orderinfo":{"basicorderinfo":{"orderid":23294197692,"uid":"_TIKRnat0vzcz8yq","amount":625.0,"extorderid":"E23LGJB6X","orderstatus":"S","flightclass":"I","totalamount":631.0,"actualamount":625.0,"flightagency":3890,"bookingchannel":"TF-WS","flightway":"S","relatedorders":[{"relatedorderid":23294471356,"relatedordertype":1,"agetype":"ADU"}],"leastpersons":1,"canrefundsingle":true,"isenglish":"T","paymentinfo":{"companyfeeinfos":null,"fltpayinfos":[{"paytype":"CCARD","paytypename":"信用卡","paytypecn":"信用卡","payamount":856.27,"bankcardinfoid":null,"ccardpayfeerate":null}],"externalno":"3ee52db1-b7d5-4c8c-a32f-68124657b566","merchantinformation":null,"ccardfee":0,"travelmoneyservicefee":0,"travelmoney":0,"voucherpaidmoney":0.0},"ifchibabaccompanyofadult":false,"paidforeignorder":true,"paidexchangerate":190.443107788,"paidforeignordertotalamout":119800.0,"exchangerate":0.005250912,"foreigncurrency":"KRW","foreignpaidamount":118800.0,"payforeigncurrency":"KRW","payexchangerate":0.0052,"payforeigncarry":"0","paidcurrency":"KRW","dimensiontype":2},"contactinfo":{"contactor":"홍 경자","confirmtype":null,"contacttelephone":"","contactemail":"han_EHWu2@naver.com#","foreignmobile":"1058227g97","countrycode":"82","countrycodedomestic":null},"additionallist":[{"additionaltype":"OrderSyncVersion","additionalvalue":"2"},{"additionaltype":"SearchBookWithoutId","additionalvalue":"T|0,1"},{"additionaltype":"MulticurrencyFlag","additionalvalue":"T"},{"additionaltype":"BookWithoutID","additionalvalue":"T"},{"additionaltype":"CouponRefundInfo","additionalvalue":[{"refundmode":"ByCp","couponnumber":"zrrdhzyxru"}]},{"additionaltype":"recommendprdtype2","additionalvalue":"0"}],"ordercouponlist":[],"discountinfolist":null,"reimburseinfo":null},"flightinfos":[{"flight":null,"price":null,"tax":null,"subsidy":null,"pnr":null,"rate":null,"sequence":null,"flightindex":null,"flightagencycode":null,"operatingairline":null,"carrierflightno":null,"ifshared":null,"takeofftime":null,"arrivaltime":null,"takeofftimegmt":null,"arrivaltimegmt":null,"aport":null,"dport":null,"classgrade":null,"airlinename":null,"subclass":null,"departairportbuildingentity":null,"arriveairportbuildingentity":null,"crafttypeentity":null,"extensionattribute":null,"printprice":null,"saleprice":null,"suppilerfdprice":null,"costprice":null,"oilfee":null,"ctripservicecharge":null,"supplierservicecharge":null,"airlineservicecharge":null,"officeno":null,"ifsurface":null,"authorizeofficeno":null,"standardprice":null,"discountmode":null,"discountamount":null,"classareacode":null,"classareaname":null,"policytokenno":null,"paidcurrency":null,"paidprice":null,"paidtax":null,"paidoilfee":null,"paidexchangerate":null,"pricerate":null,"classtypename":null,"ifsharedticketno":null,"sourcetype":null,"serviceno":null,"rebookapplyid":null,"segmentno":null,"flighttype":null,"throughflightno":null,"flightstops":null,"refundinfo":null},{"flight":null,"price":null,"tax":null,"subsidy":null,"pnr":null,"rate":null,"sequence":null,"flightindex":null,"flightagencycode":null,"operatingairline":null,"carrierflightno":null,"ifshared":null,"takeofftime":null,"arrivaltime":null,"takeofftimegmt":null,"arrivaltimegmt":null,"aport":null,"dport":null,"classgrade":null,"airlinename":null,"subclass":null,"departairportbuildingentity":null,"arriveairportbuildingentity":null,"crafttypeentity":null,"extensionattribute":null,"printprice":null,"saleprice":null,"suppilerfdprice":null,"costprice":null,"oilfee":null,"ctripservicecharge":null,"supplierservicecharge":null,"airlineservicecharge":null,"officeno":null,"ifsurface":null,"authorizeofficeno":null,"standardprice":null,"discountmode":null,"discountamount":null,"classareacode":null,"classareaname":null,"policytokenno":null,"paidcurrency":null,"paidprice":null,"paidtax":null,"paidoilfee":null,"paidexchangerate":null,"pricerate":null,"classtypename":null,"ifsharedticketno":null,"sourcetype":null,"serviceno":null,"rebookapplyid":null,"segmentno":null,"flighttype":null,"throughflightno":null,"flightstops":null,"refundinfo":null}],"refundfeelist":[{"refundfeeid":1,"refundscene":0,"refundtype":1,"emdrefundtype":0,"basicrefundfeeinfo":{"currency":"KRW","refundable":null,"cancalculate":true,"refundprice":0,"refundrate":0,"currencyrate":190.443107788,"refundfee":0,"canrefundtax":false,"isurgent":false,"isrelatededuct":false,"isconsultmode":false,"discountamount":0,"isconstantrefundfee":false,"latestreplytime":"0001-01-01 08:00:00"},"servicefeedetail":{"refundfeebycarrier":0,"refundfeebyctrip":0,"refundfeebyconsolidator":0},"usefeedetail":{"usedamount":0,"usedcost":0,"usedtax":0},"emdfeedetail":null,"additionalfeedetailinfo":{"deductedtaxamount":0,"extensionattributeinfolist":null}},{"refundfeeid":2,"refundscene":0,"refundtype":2,"emdrefundtype":0,"basicrefundfeeinfo":{"currency":"KRW","refundable":null,"cancalculate":true,"refundprice":0,"refundrate":0,"currencyrate":190.443107788,"refundfee":0,"canrefundtax":false,"isurgent":false,"isrelatededuct":false,"isconsultmode":false,"discountamount":0,"isconstantrefundfee":false,"latestreplytime":"2023-03-22 21:45:43"},"servicefeedetail":{"refundfeebycarrier":0,"refundfeebyctrip":0,"refundfeebyconsolidator":0},"usefeedetail":{"usedamount":0,"usedcost":0,"usedtax":0},"emdfeedetail":null,"additionalfeedetailinfo":{"deductedtaxamount":0,"extensionattributeinfolist":null}},{"refundfeeid":3,"refundscene":0,"refundtype":4,"emdrefundtype":0,"basicrefundfeeinfo":{"currency":"KRW","refundable":null,"cancalculate":false,"refundprice":0,"refundrate":0,"currencyrate":190.443107788,"refundfee":0,"canrefundtax":false,"isurgent":false,"isrelatededuct":false,"isconsultmode":false,"discountamount":0,"isconstantrefundfee":false,"latestreplytime":"2023-03-27 14:45:43"},"servicefeedetail":{"refundfeebycarrier":0,"refundfeebyctrip":0,"refundfeebyconsolidator":0},"usefeedetail":{"usedamount":0,"usedcost":0,"usedtax":0},"emdfeedetail":null,"additionalfeedetailinfo":null},{"refundfeeid":4,"refundscene":0,"refundtype":5,"emdrefundtype":0,"basicrefundfeeinfo":{"currency":"KRW","refundable":null,"cancalculate":false,"refundprice":0,"refundrate":0,"currencyrate":190.443107788,"refundfee":0,"canrefundtax":false,"isurgent":false,"isrelatededuct":false,"isconsultmode":false,"discountamount":0,"isconstantrefundfee":false,"latestreplytime":"2023-03-27 14:45:43"},"servicefeedetail":{"refundfeebycarrier":0,"refundfeebyctrip":0,"refundfeebyconsolidator":0},"usefeedetail":{"usedamount":0,"usedcost":0,"usedtax":0},"emdfeedetail":null,"additionalfeedetailinfo":null},{"refundfeeid":5,"refundscene":0,"refundtype":6,"emdrefundtype":0,"basicrefundfeeinfo":{"currency":"KRW","refundable":null,"cancalculate":false,"refundprice":0,"refundrate":0,"currencyrate":190.443107788,"refundfee":0,"canrefundtax":false,"isurgent":false,"isrelatededuct":false,"isconsultmode":false,"discountamount":0,"isconstantrefundfee":false,"latestreplytime":"2023-03-27 14:45:43"},"servicefeedetail":{"refundfeebycarrier":0,"refundfeebyctrip":0,"refundfeebyconsolidator":0},"usefeedetail":{"usedamount":0,"usedcost":0,"usedtax":0},"emdfeedetail":null,"additionalfeedetailinfo":null},{"refundfeeid":6,"refundscene":0,"refundtype":9,"emdrefundtype":0,"basicrefundfeeinfo":{"currency":"KRW","refundable":null,"cancalculate":false,"refundprice":0,"refundrate":0,"currencyrate":190.443107788,"refundfee":0,"canrefundtax":false,"isurgent":false,"isrelatededuct":false,"isconsultmode":false,"discountamount":0,"isconstantrefundfee":false,"latestreplytime":"2023-03-27 14:45:43"},"servicefeedetail":{"refundfeebycarrier":0,"refundfeebyctrip":0,"refundfeebyconsolidator":0},"usefeedetail":{"usedamount":0,"usedcost":0,"usedtax":0},"emdfeedetail":null,"additionalfeedetailinfo":null}],"refundrebookinfobyorder":{"refundamountinfolist":[{"currency":null,"refundscene":0,"refundtype":1,"currencyexchangerate":0,"paycustomer":40800.0,"refundflight":25700.0,"refundtax":16100.0,"refundoilfee":0}],"refunddiscounts":null,"productdeductlist":null,"flightchangelist":[{"source":1,"associated":false,"changeorderid":0,"changedetailid":1,"refundlimitdate":"0001-01-01T00:00:00.000+00:00","canrefundall":false,"singletalk":false,"refusalcode":0,"refusalreason":null,"unverifiedflight":true,"feetype":null,"flightchangetype":null,"orderid":null}],"specialeventlist":null,"refundretirelist":null,"involreservedetaillist":null,"multiplecurrency":true},"segmentlist":[{"passenger":{"nationlity":"KR","birthday":"1967-06-10T00:00:00.000+08:00","gender":"F","passengername":"홍/경자","cardtype":2,"cardno":"G00oVcZ500#","passengertype":"NOR","agetype":"ADU","travelereligibilitycode":null,"bookinguser":"홍/경자","cardvalid":"2033-03-22T00:00:00.000+08:00","passengerid":1222871242028351523},"refundable":true,"rebookable":null,"interests":null,"flightindex":1000,"registrationcondition":null,"unrefundablereasoncode":"0","unrebookablereasoncode":null,"ticketinfo":{"ticketno":"0000001063","ticketstatus":null,"isticketstatusvalid":null,"ifused":null,"airlinecode":"806"},"originflightindexs":null,"passengerflightpriceinfo":null,"effectiveitineraryrefundfeelist":[{"flightindex":1001,"refundfeelist":[1,2,3,4,5,6],"productdeductlist":null,"retireid":0,"retiredetailid":0,"sretireid":0,"sretiredetailid":0,"eventid":0,"eventdetailid":0,"changeorderid":0,"changedetailid":1,"discountid":null,"canrefund":true,"unrefundablecode":"0","itineraryused":false,"seventid":0,"seventdetailid":0,"involreservedetailid":0,"policyrelationinfolist":null}],"triprecordrefundfeeinfo":{"flightindex":1000,"refundfeelist":[1,2,3,4,5,6],"productdeductlist":null,"retireid":0,"retiredetailid":0,"sretireid":0,"sretiredetailid":0,"eventid":0,"eventdetailid":0,"changeorderid":0,"changedetailid":1,"discountid":null,"canrefund":true,"unrefundablecode":"0","itineraryused":false,"seventid":0,"seventdetailid":0,"involreservedetailid":0,"policyrelationinfolist":null},"askretaininfos":null,"rebookfeelist":null,"rebookinfolist":[],"retaininfo":null,"policyrefundfeetypelist":[{"starttime":null,"endtime":"2023-03-23 05:12:24","refundfee":0,"taxrefundonly":false,"emdrefundtype":0}],"mergerebookid":null,"productidinseglist":null,"productdeductidlist":null,"hasgotattachamount":null,"needactinginconcert":null,"sortedsequence":null,"productinfos":null,"triprecordflightfeeinfo":{"flightprice":0,"taxfee":0,"oilfee":0}}],"orderxinfo":{"xproductorderdetails":[{"sequence":1,"detailid":null,"productid":23294803724,"orderid":23294197692,"productorderid":23294193788,"productname":null,"producttype":1016,"costprice":0.0,"saleprice":6.0,"printprice":0.0,"discountamount":0.0,"productcount":1,"refundinfo":null,"refundsinfo":null,"rebookinfo":null,"rebooksinfo":null,"thirdpartorderid":null,"policyid":"EBYY2gEgBSkAAAAAAECPQDDuDzsLCgNLUlcRAAAAAABAj0AaA0tSVyEAAAAAAECPQCkAAAAAAAAYQDIBMTgFQgoxMDAuMDAwMDAwSgswLjAwNTI1MDkxMlABWggxLjAwMDAwMGEAAAAAAAAAAAw8SwoDRW52EgNQUk9MUAE=","originalsupplierprice":0.0,"originalsuppliercurrency":"KRW","originalsaleprice":6.0,"originalprintprice":0.0,"originalcostprice":0.0,"ruleid":102,"paidcurrency":"KRW","paiddiscountamount":0,"paidoriginalprice":1000.0,"paidoriginalprintprice":0.0,"productdetailextendinfos":null,"bookingchannel":"","orderstatus":"S","passengername":"홍/경자","ispaidforeignorder":true,"paidexchangerate":190.44310779,"productpolicytoken":"0DF4A7CF25202C14EE7796A96C1265E0","packageid":null,"productdescription":"","expiredtime":"2034-08-17 20:43:24"}],"xproductusedetails":[],"xproductflights":[{"productflightid":null,"orderid":23294197692,"productorderid":23294193788,"productid":23294803724,"flightno":"TW720","takeofftime":"2023-06-05 13:30:00","dport":"CJU","sectorid":1,"operatingflightno":null}],"xproductpassengers":[{"productpassengerid":null,"orderid":23294197692,"productorderid":23294193788,"productid":23294803724,"passengername":"홍/경자","clienttype":0,"passengerid":1222871242028351523}],"orderxrebookinfo":null,"orderpackagelist":null},"xproductrefundinfo":null,"xrefundinfos":[{"canrefundnum":0,"deductamount":null,"ifsucceed":false,"issueid":60103678116,"passengername":"홍/경자","productid":23294803724,"producttype":1016,"rebookid":null,"refundamount":null,"refundinfo":null,"ifalreadycancelled":false,"ifalreadycancelling":false,"refundbindtype":0,"refundoption":0,"packageid":null,"packcanrefund":null,"isdrawlottery":null,"refundfeeinfo":null,"cancalculate":false,"involuntarytype":null,"resultcode":null,"resultdesc":null,"paidrefundfeeinfo":null,"xproductrefunddetailinfolist":[{"refundable":false,"refundoption":0,"refundbindtype":0,"canrefundnum":0,"cancalculate":false,"resultcode":50101,"resultdesc":"product can not calculate","involuntarytype":1,"xrefundfeeinfo":null,"specialprocesstype":0,"exchangerefunddetaillist":null}],"refundrulewindowdetaillist":null}],"askresultcodes":null}],"responsehead":{"serverip":"10.4.28.30","elapsedtime":383,"resultstatus":{"resultinfo":{"code":0,"message":"Success","fieldname":null},"detailinfolist":null}}}',
          },
        ],
        totalCount: 3,
      }),
    );
  }
}

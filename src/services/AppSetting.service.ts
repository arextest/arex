import request from '../helpers/api/axios';
import { objectArrayFilter } from '../helpers/utils';
import {
  AgentData,
  IgnoreNodeBase,
  InsertSettingReqInsert,
  InterfaceIgnoreNode,
  OperationId,
  OperationInterface,
  OperationType,
  QueryConfigTemplateRes,
  QueryIgnoreNode,
  QueryInterfaceIgnoreNode,
  QueryInterfaceIgnoreNodeReq,
  QueryInterfacesListRes,
  QueryNodeReq,
  QueryRecordDynamicClassSettingReq,
  QueryRecordDynamicClassSettingRes,
  QueryRecordSettingReq,
  QueryRecordSettingRes,
  QueryReplaySettingRes,
  RemoveDynamicClassSettingReq,
  RemoveDynamicClassSettingRes,
  SortNode,
  SortNodeBase,
  UpdateConfigTemplateReq,
  UpdateIgnoreNodeReq,
  UpdateInterfaceResponseReq,
  UpdateRecordSettingReq,
  UpdateRecordSettingRes,
  UpdateReplaySettingReq,
  UpdateSettingReqInsert,
  UpdateSortNodeReq,
} from './AppSetting.type';

export default class AppSettingService {
  // 查询 Replay - record 设置数据
  static async queryRecordSetting(params: QueryRecordSettingReq) {
    const res = await request.get<QueryRecordSettingRes>(
      '/report/config/serviceCollect/useResult/appId/' + params.id,
    );
    return res.body;
  }

  // 更新 Replay - record 设置数据
  static async updateRecordSetting(params: UpdateRecordSettingReq) {
    const res = await request.post<UpdateRecordSettingRes>(
      '/report/config/serviceCollect/modify/UPDATE',
      params,
    );
    return res.body;
  }

  // 查询 Replay - record Dynamic Classes 设置数据
  static async queryRecordDynamicClassSetting(params: QueryRecordDynamicClassSettingReq) {
    const res = await request.get<QueryRecordDynamicClassSettingRes | undefined>(
      '/report/config/dynamicClass/useResultAsList/appId/' + params.appId,
    );
    return res.body;
  }

  // 添加 Replay - record Dynamic Classes 设置数据
  static async insertDynamicClassSetting(params: InsertSettingReqInsert) {
    const res = await request.post<boolean>('/report/config/dynamicClass/modify/INSERT', params);
    return res.body;
  }

  // 编辑 Replay - record Dynamic Classes 设置数据
  static async updateDynamicClassSetting(params: UpdateSettingReqInsert) {
    const res = await request.post<boolean>('/report/config/dynamicClass/modify/UPDATE', params);
    return res.body;
  }

  // 删除 Replay - record Dynamic Classes 设置数据
  static async removeDynamicClassSetting(params: RemoveDynamicClassSettingReq) {
    const res = await request.post<RemoveDynamicClassSettingRes>(
      '/report/config/dynamicClass/modify/REMOVE',
      params,
    );
    return res.body;
  }

  // 查询 AppSetting 设置数据
  static async queryReplaySetting(params: { id: string }) {
    const res = await request.get<QueryReplaySettingRes>(
      '/report/config/schedule/useResult/appId/' + params.id,
    );
    return res.body;
  }

  // 更新 AppSetting 设置数据
  static async updateReplaySetting(params: UpdateReplaySettingReq) {
    const res = await request.post<boolean>('/report/config/schedule/modify/UPDATE', params);
    return res.body;
  }

  // 查询 Yaml 配置
  static async queryConfigTemplate(params: { appId: string }) {
    const res = await request.post<QueryConfigTemplateRes>(
      '/report/config/yamlTemplate/queryConfigTemplate',
      params,
    );
    return res.body;
  }

  // 更新 Yaml 配置
  static async updateConfigTemplate(params: UpdateConfigTemplateReq) {
    const res = await request.post<boolean>(
      '/report/config/yamlTemplate/pushConfigTemplate',
      params,
    );
    return res.body;
  }

  // 查询 NodeIgnore/NodesSort Interfaces
  static async queryInterfacesList<T extends OperationType>(params: { id: string }) {
    const res = await request.get<QueryInterfacesListRes<T>>(
      '/report/config/applicationService/useResultAsList/appId/' + params.id,
    );
    return objectArrayFilter<OperationInterface<T>>(
      res.body.reduce<OperationInterface<T>[]>((list, cur) => {
        list.push(...cur.operationList);
        return list;
      }, []),
      'id',
    ).sort((a, b) => a.operationName.localeCompare(b.operationName));
  }

  // 查询 InterfaceResponse 数据
  static async queryInterfaceResponse(params: { id: OperationId<'Interface'> }) {
    const res = await request.get<OperationInterface>(
      '/report/config/applicationOperation/useResult/operationId/' + params.id,
    );
    return res.body;
  }

  // 更新 InterfaceResponse 数据
  static async updateInterfaceResponse(params: UpdateInterfaceResponseReq) {
    const res = await request.post<boolean>(
      '/report/config/applicationOperation/modify/UPDATE',
      params,
    );
    return res.body;
  }

  // 获取 IgnoreNode Interface/Global 数据
  static async queryIgnoreNode(params: QueryNodeReq<'Global'>) {
    const res = await request.get<QueryIgnoreNode[]>(
      '/report/config/comparison/exclusions/useResultAsList',
      { ...params, operationId: params.operationId || undefined },
    );
    return res.body
      .map<QueryIgnoreNode>((item) => ({
        ...item,
        path: item.exclusions.concat(['']).join('/'),
      }))
      .sort((a, b) => a.path.localeCompare(b.path));
  }

  // 使用 interfaceId 和 operationId 获取 IgnoreNode 数据（用于 collection-interface ）
  static async queryInterfaceIgnoreNode(params: QueryInterfaceIgnoreNodeReq) {
    const res = await request.get<QueryInterfaceIgnoreNode[]>(
      '/report/config/comparison/exclusions/queryByInterfaceIdAndOperationId',
      params,
    );
    return res.body
      .map<QueryInterfaceIgnoreNode>((item) => ({
        ...item,
        path: item.exclusions.concat(['']).join('/'),
      }))
      .sort((a, b) => a.path.localeCompare(b.path));
  }

  // 单个新增 IgnoreNode Interface/Global 数据
  static async insertIgnoreNode(params: IgnoreNodeBase | InterfaceIgnoreNode) {
    const res = await request.post<boolean>(
      '/report/config/comparison/exclusions/modify/INSERT',
      params,
    );
    return res.body;
  }

  // 批量新增 IgnoreNode Interface/Global 数据
  static async batchInsertIgnoreNode(params: IgnoreNodeBase[]) {
    const res = await request.post<boolean>(
      '/report/config/comparison/exclusions/batchModify/INSERT',
      params,
    );
    return res.body;
  }

  // 更新 IgnoreNode Interface/Global 数据
  static async updateIgnoreNode(params: UpdateIgnoreNodeReq) {
    const res = await request.post<boolean>(
      '/report/config/comparison/exclusions/modify/UPDATE',
      params,
    );
    return res.body;
  }

  // 删除 IgnoreNode Interface/Global 数据
  static async deleteIgnoreNode(params: { id: string }) {
    const res = await request.post<boolean>(
      '/report/config/comparison/exclusions/modify/REMOVE',
      params,
    );
    return res.body;
  }

  // 批量删除 IgnoreNode Interface/Global 数据
  static async batchDeleteIgnoreNode(params: { id: string }[]) {
    const res = await request.post<boolean>(
      '/report/config/comparison/exclusions/batchModify/REMOVE',
      params,
    );
    return res.body;
  }

  // 获取 SortNode Interface 数据
  static async querySortNode(params: QueryNodeReq<'Interface'>) {
    const res = await request.get<SortNode[]>(
      '/report/config/comparison/listsort/useResultAsList',
      {
        ...params,
        operationId: params.operationId || undefined,
      },
    );
    return res.body
      .map<SortNode>((item) => ({
        ...item,
        path: item.listPath.concat(['']).join('/'),
        pathKeyList: item.keys.map((key) => key.concat(['']).join('/')),
      }))
      .sort((a, b) => a.path.localeCompare(b.path));
  }

  // 使用 interfaceId 和 operationId 获取 SortNode 数据（用于 collection-interface ）
  static async queryInterfaceSortNode(params: QueryInterfaceIgnoreNodeReq) {
    const res = await request.get<SortNode[]>(
      '/report/config/comparison/listsort/queryByInterfaceIdAndOperationId',
      params,
    );
    return res.body
      .map<SortNode>((item) => ({
        ...item,
        path: item.listPath.concat(['']).join('/'),
        pathKeyList: item.keys.map((key) => key.concat(['']).join('/')),
      }))
      .sort((a, b) => a.path.localeCompare(b.path));
  }

  // 单个新增 SortNode Interface 数据
  static async insertSortNode(params: SortNodeBase) {
    const res = await request.post<boolean>(
      '/report/config/comparison/listsort/modify/INSERT',
      params,
    );
    return res.body;
  }

  // 更新 IgnoreNode Interface/Global 数据
  static async updateSortNode(params: UpdateSortNodeReq) {
    const res = await request.post<boolean>(
      '/report/config/comparison/listsort/modify/UPDATE',
      params,
    );
    return res.body;
  }

  // 删除 SortNode Interface 数据
  static async deleteSortNode(params: { id: string }) {
    const res = await request.post<boolean>(
      '/report/config/comparison/listsort/modify/REMOVE',
      params,
    );
    return res.body;
  }

  // get machines with the agent installed
  static async getAgentList(appId: string) {
    const res = await request.get<AgentData[]>(
      '/report/config/applicationInstances/useResultAsList/appId/' + appId,
    );
    return res.body.map((item) => item.host);
  }
}

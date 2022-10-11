import request from '../api/axios';
import { objectArrayFilter } from '../helpers/utils';
import {
  OperationInterface,
  QueryInterfacesListRes,
  QueryRecordDynamicClassSettingReq,
  QueryRecordDynamicClassSettingRes,
  QueryRecordSettingReq,
  QueryRecordSettingRes,
  RemoveDynamicClassSettingReq,
  RemoveDynamicClassSettingRes,
  UpdateDynamicClassSettingReq,
  UpdateDynamicClassSettingRes,
  UpdateRecordSettingReq,
  UpdateRecordSettingRes,
} from './AppSetting.type';
import { UpdateInterfaceResponseReq } from './Replay.type';

export default class AppSettingService {
  // 查询 Replay - record 设置数据
  static async queryRecordSetting(params: QueryRecordSettingReq) {
    const res = await request.get<QueryRecordSettingRes>(
      '/config/serviceCollect/useResult/appId/' + params.id,
    );
    return res.body;
  }

  // 更新 Replay - record 设置数据
  static async updateRecordSetting(params: UpdateRecordSettingReq) {
    const res = await request.post<UpdateRecordSettingRes>(
      '/config/serviceCollect/modify/UPDATE',
      params,
    );
    return res.body;
  }

  // 查询 Replay - record Dynamic Classes 设置数据
  static async queryRecordDynamicClassSetting(params: QueryRecordDynamicClassSettingReq) {
    const res = await request.get<QueryRecordDynamicClassSettingRes | undefined>(
      '/config/dynamicClass/useResultAsList/appId/' + params.appId,
    );
    return res.body;
  }

  // 添加 Replay - record Dynamic Classes 设置数据
  static async updatedDynamicClassSetting(params: UpdateDynamicClassSettingReq) {
    const res = await request.post<UpdateDynamicClassSettingRes>(
      '/config/dynamicClass/modify/INSERT',
      params,
    );
    return res.body;
  }

  // 删除 Replay - record Dynamic Classes 设置数据
  static async removeDynamicClassSetting(params: RemoveDynamicClassSettingReq) {
    const res = await request.post<RemoveDynamicClassSettingRes>(
      '/config/dynamicClass/modify/REMOVE',
      params,
    );
    return res.body;
  }

  // 查询 NodesSort Interfaces
  static async queryInterfacesList(params: { id: string }) {
    const res = await request.get<QueryInterfacesListRes>(
      '/config/applicationService/useResultAsList/appId/' + params.id,
    );
    return objectArrayFilter<OperationInterface>(
      res.body.reduce<OperationInterface[]>((list, cur) => {
        list.push(...cur.operationList);
        return list;
      }, []),
      'id',
    );
  }

  // 查询 InterfaceResponse 数据
  static async queryInterfaceResponse(params: { id: string }) {
    const res = await request.get<OperationInterface>(
      '/config/applicationOperation/useResult/operationId/' + params.id,
    );
    return res.body;
  }

  // 更新 InterfaceResponse 数据
  static async updateInterfaceResponse(params: UpdateInterfaceResponseReq) {
    const res = await request.post<boolean>('/config/applicationOperation/modify/UPDATE', params);
    return res.body;
  }
}

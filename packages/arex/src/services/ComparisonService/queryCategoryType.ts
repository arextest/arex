import { request } from '@/utils';

export type CategoryType = {
  entryPoint: boolean;
  name: string;
  skipComparison: boolean;
};
export async function queryCategoryType() {
  const res = await request.get<CategoryType[]>('/report/report/listCategoryType');
  return res.body;
}

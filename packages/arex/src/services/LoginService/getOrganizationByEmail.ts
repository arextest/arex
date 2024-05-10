import { request } from '@/utils';

export async function getOrganizationByEmail(email: string) {
  const response = await request.get<string[]>(
    `http://arex-saas-service-alb-1423452123.us-west-2.elb.amazonaws.com:8080/api/user/mgnt/queryTenants/${email}`,
  );
  return response.body;
}

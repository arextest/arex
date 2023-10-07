import { createArexPane } from '@arextest/arex-core';

import { MenusType, PanesType } from '@/constant';

import Request from './Request';

export default createArexPane(Request, {
  type: PanesType.REQUEST,
  menuType: MenusType.COLLECTION,
  noPadding: true,
});

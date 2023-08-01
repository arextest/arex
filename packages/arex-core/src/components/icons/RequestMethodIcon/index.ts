import { QuestionOutlined } from '@ant-design/icons';
import { FC } from 'react';

import ArexIcon from './ArexIcon';
import CaseIcon from './CaseIcon';
import DeleteIcon from './DeleteIcon';
import GetIcon from './GetIcon';
import PatchIcon from './PatchIcon';
import PostIcon from './PostIcon';
import PutIcon from './PutIcon';

const RequestMethodIcon: { [method: string]: FC } = {
  get: GetIcon,
  Get: GetIcon,
  GET: GetIcon,

  post: PostIcon,
  Post: PostIcon,
  POST: PostIcon,

  put: PutIcon,
  Put: PutIcon,
  PUT: PutIcon,

  delete: DeleteIcon,
  Delete: DeleteIcon,
  DELETE: DeleteIcon,

  patch: PatchIcon,
  Patch: PatchIcon,
  PATCH: PatchIcon,

  arex: ArexIcon,
  Arex: ArexIcon,
  AREX: ArexIcon,

  case: CaseIcon,
  Case: CaseIcon,
  CASE: CaseIcon,

  unknown: QuestionOutlined,
  Unknown: QuestionOutlined,
  UNKNOWN: QuestionOutlined,
};

export default RequestMethodIcon;

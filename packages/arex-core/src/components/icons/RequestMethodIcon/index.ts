import { QuestionOutlined } from '@ant-design/icons';
import { FC } from 'react';

import Delete from './Delete';
import Get from './Get';
import Patch from './Patch';
import Post from './Post';
import Put from './Put';

const RequestMethodIcon: { [method: string]: FC } = {
  get: Get,
  Get: Get,
  GET: Get,

  post: Post,
  Post: Post,
  POST: Post,

  put: Put,
  Put: Put,
  PUT: Put,

  delete: Delete,
  Delete: Delete,
  DELETE: Delete,

  patch: Patch,
  Patch: Patch,
  PATCH: Patch,

  unknown: QuestionOutlined,
  Unknown: QuestionOutlined,
  UNKNOWN: QuestionOutlined,
};

export default RequestMethodIcon;

// TODO 封装对比组件
import styled from '@emotion/styled';
import CodeMirror from '@uiw/react-codemirror';
import { ReactCodeMirrorProps } from '@uiw/react-codemirror/src';
import React from 'react';

import { Theme } from '../../theme';

const WatermarkCodeMirror = styled(
  (
    props: ReactCodeMirrorProps & {
      themeKey: Theme; // 避免和 emotion theme props 冲突
    },
  ) => <CodeMirror theme={props.themeKey} {...props} />,
)<{
  remark?: string;
}>`
  :after {
    content: '${(props) => props.remark || ''}';
    position: absolute;
    bottom: 8px;
    right: 32px;
    font-size: 32px;
    font-weight: 600;
    font-style: italic;
    color: ${(props) => props.theme.colorTextQuaternary};
    z-index: 0;
  }
`;

export default WatermarkCodeMirror;

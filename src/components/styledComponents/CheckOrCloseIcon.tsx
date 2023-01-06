import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import React from 'react';

const CheckOrCloseIcon = styled((props: { checked: boolean }) =>
  props.checked ? <CheckCircleOutlined {...props} /> : <CloseCircleOutlined {...props} />,
)<{ size?: number; checked: boolean }>`
  font-size: ${(props) => (props.size ? props.size + 'px' : ' 16px')};
  color: ${(props) =>
    props.checked ? props.theme.colorSuccess : props.theme.colorError}!important;
  margin-right: 8px;
`;

export default CheckOrCloseIcon;

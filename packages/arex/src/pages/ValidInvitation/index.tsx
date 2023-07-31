import {
  CheckCircleOutlined,
  LoadingOutlined,
  StopOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { FlexCenterWrapper, setLocalStorage, tryParseJsonString } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { Card, Space, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ACCESS_TOKEN_KEY, EMAIL_KEY, REFRESH_TOKEN_KEY } from '@/constant';
import { ReportService } from '@/services';
import { useWorkspaces } from '@/store';

enum Status {
  loading,
  success,
  failed,
  invalidLink,
}

type InvitationData = {
  token: string;
  mail: string;
  workSpaceId: string;
};

const ValidateInvitation = () => {
  const nav = useNavigate();
  const { token } = theme.useToken();

  const { setActiveWorkspaceId } = useWorkspaces();
  const [status, setStatus] = useState<Status>(Status.loading);
  const [searchParams] = useSearchParams();

  const { run: validInvitation } = useRequest(ReportService.validInvitation, {
    manual: true,
    onSuccess(res, params) {
      if (res.body.success) {
        setLocalStorage(EMAIL_KEY, params[0].userName);
        setLocalStorage(ACCESS_TOKEN_KEY, res.body.accessToken);
        setLocalStorage(REFRESH_TOKEN_KEY, res.body.refreshToken);

        setActiveWorkspaceId(params[0].workspaceId);

        setStatus(Status.success);
      } else {
        setStatus(Status.failed);
      }
    },
    onFinally() {
      setTimeout(() => {
        nav('/');
      }, 1000);
    },
  });

  function decodeInvitation() {
    try {
      return tryParseJsonString<InvitationData>(atob(searchParams.getAll('upn')[0]));
    } catch (e) {
      setStatus(Status.invalidLink);
      setTimeout(() => {
        nav('/');
      }, 1000);
    }
  }

  useEffect(() => {
    const decodeData = decodeInvitation();
    if (decodeData?.token) {
      validInvitation({
        token: decodeData.token,
        userName: decodeData.mail,
        workspaceId: decodeData.workSpaceId,
      });
    }
  }, []);

  return (
    <FlexCenterWrapper>
      <Card>
        {status === Status.loading ? (
          <Space>
            <LoadingOutlined />
            <span>Verifying ...</span>
          </Space>
        ) : status === Status.success ? (
          <Space>
            <CheckCircleOutlined style={{ color: token.colorSuccess }} />{' '}
            <span>Authentication success! Redirecting...</span>
          </Space>
        ) : status === Status.failed ? (
          <Space>
            <StopOutlined style={{ color: token.colorError }} />
            <span>Authentication failed! Redirecting...</span>
          </Space>
        ) : (
          <Space>
            <WarningOutlined style={{ color: token.colorWarning }} />
            <span>Invalid Invitation Link! Redirecting...</span>
          </Space>
        )}
      </Card>
    </FlexCenterWrapper>
  );
};

export default ValidateInvitation;

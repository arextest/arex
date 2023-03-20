import {
  CheckCircleOutlined,
  LoadingOutlined,
  StopOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Card, Space, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { FlexCenterWrapper } from '../../components/styledComponents';
import { AccessTokenKey, EmailKey, RefreshTokenKey } from '../../constant';
import { setLocalStorage, tryParseJsonString } from '../../helpers/utils';
import WorkspaceService from '../../services/Workspace.service';
import { useStore } from '../../store';

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

const ValidInvitation = () => {
  const nav = useNavigate();
  const { token } = theme.useToken();

  const { setInvitedWorkspaceId } = useStore();

  const [status, setStatus] = useState<Status>(Status.loading);
  const [searchParams] = useSearchParams();

  const { run: validInvitation } = useRequest(WorkspaceService.validInvitation, {
    manual: true,
    onSuccess(res, params) {
      if (res.body.success) {
        setLocalStorage(EmailKey, params[0].userName);
        setLocalStorage(AccessTokenKey, res.body.accessToken);
        setLocalStorage(RefreshTokenKey, res.body.refreshToken);

        setInvitedWorkspaceId(params[0].workspaceId);

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

export default ValidInvitation;

import { useMount } from 'ahooks';
import { message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { AccessTokenKey, RefreshTokenKey } from '../../constant';
import { getLocalStorage, setLocalStorage } from '../../helpers/utils';
import WorkspaceService from '../../services/Workspace.service';

const ValidInvitation = () => {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  function decode(str: string) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return {};
    }
  }
  useMount(() => {
    const decodeData = decode(atob(searchParams.getAll('upn')[0]));
    if (decodeData.token) {
      WorkspaceService.validInvitation({
        token: decodeData.token,
        userName: decodeData.mail,
        workspaceId: decodeData.workSpaceId,
      }).then((res) => {
        if (res.body.success) {
          setLocalStorage('email', decodeData.mail);
          setLocalStorage(AccessTokenKey, res.body.accessToken);
          setLocalStorage(RefreshTokenKey, res.body.refreshToken);
          message.success('Verify successfully');
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        } else {
          message.error('Verification failed');
        }
      });
    }
  });
  return <div>Verifying</div>;
};

export default ValidInvitation;

import { FileOutlined, SaveOutlined } from '@ant-design/icons';
import {
  ArexPaneFC,
  createArexPane,
  HelpTooltip,
  i18n,
  Label,
  PanesTitle,
  styled,
  useArexPaneProps,
  useTranslation,
} from '@arextest/arex-core';
import { App, Button, Divider, Space, Typography } from 'antd';
import React, { FC } from 'react';

import { MenusType, PanesType } from '@/constant';
import useNavPane from '@/hooks/useNavPane';
import { encodePaneKey } from '@/store/useMenusPanes';

const StyledDiv = styled.div`
  padding: ${(props) => props.theme.paddingSM}px;
  margin: ${(props) => props.theme.marginSM}px;
  color: ${(props) => props.theme.colorPrimary};
  border-radius: ${(props) => props.theme.borderRadius}px;
  border: 1px solid ${(props) => props.theme.colorPrimary};
`;

type DemoData = {
  name: string;
  age: number;
};

const ChildComponent: FC = () => {
  const paneProps = useArexPaneProps<DemoData>();
  return <>{JSON.stringify(paneProps)}</>;
};

const Demo: ArexPaneFC<DemoData> = (props) => {
  const { t } = useTranslation();
  const { message, notification } = App.useApp();
  const paneNav = useNavPane();

  const handleNavPane = () => {
    if (
      encodePaneKey({
        id: '123',
        type: PanesType.DEMO,
      }) === props.paneKey
    ) {
      message.info('pane already exist');
    } else {
      paneNav({
        id: '123',
        type: PanesType.DEMO,
        data: { name: 'Tom', age: 10 },
        icon: 'GET', //optional, name of arex-core/component/Icon/RequestMethodIcon/[icon]
      });
    }
  };

  return (
    <div>
      <PanesTitle title={`DemoPane - ${props.paneKey}`} />

      <Divider orientation='left'>StyledDiv</Divider>
      <StyledDiv>This is a StyledDiv</StyledDiv>

      <Divider orientation='left'>I18n</Divider>
      <Space>
        <Typography.Text>
          <Label>lang</Label>
          {i18n.language}
        </Typography.Text>
        <Button size='small' type='primary' icon={<SaveOutlined />}>
          {t('save')}
        </Button>
      </Space>

      <Divider orientation='left'>Message / Notification</Divider>
      <Space size='middle'>
        <Button type='primary' onClick={() => message.success('success')}>
          app.message
        </Button>
        <Button type='primary' onClick={() => window.message.error('error')}>
          window.message
        </Button>
        <Button
          type='primary'
          onClick={() =>
            notification.success({
              message: 'success',
              description: 'This is a successful notification',
            })
          }
        >
          notification
        </Button>
      </Space>

      <Divider orientation='left'>props</Divider>
      <div>
        <Typography.Text>
          <Label>
            <HelpTooltip title='use in RootPaneComponent'>Props</HelpTooltip>
          </Label>
          {JSON.stringify(props)}
        </Typography.Text>
      </div>

      <div>
        <Typography.Text>
          <Label>
            <HelpTooltip title='use in ChildrenPaneComponent (Inject)'>
              useArexPaneProps
            </HelpTooltip>
          </Label>
          <ChildComponent />
        </Typography.Text>
      </div>

      <Divider orientation='left'>PaneNav</Divider>
      <Button type='primary' onClick={handleNavPane}>
        navToNewPane
      </Button>
    </div>
  );
};

export default createArexPane(Demo, {
  type: PanesType.DEMO,
  menuType: MenusType.DEMO,
  icon: <FileOutlined />,
});

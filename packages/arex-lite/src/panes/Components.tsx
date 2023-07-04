import { AppstoreOutlined, CheckOutlined, DownOutlined } from '@ant-design/icons';
import {
  ArexPaneFC,
  CheckOrCloseIcon,
  CollapseTable,
  createArexPane,
  DiffJsonView,
  DiffMatch,
  EllipsisTooltip,
  EmptyWrapper,
  FlexCenterWrapper,
  HelpTooltip,
  HighlightRowTable,
  Label,
  PaneDrawer,
  PanesTitle,
  RequestMethodIcon,
  SceneCode,
  SmallTextButton,
  SpaceBetweenWrapper,
  TooltipButton,
} from '@arextest/arex-core';
import { css } from '@emotion/react';
import { Anchor, Button, Card, Col, Divider, Dropdown, Row, Space, Switch, theme } from 'antd';
import React, { useState } from 'react';

import { PanesType } from '@/constant';

const anchorItems = [
  {
    key: 'diff-json-view',
    href: '#diff-json-view',
    title: 'DiffJsonView',
  },
  {
    key: 'diff-match',
    href: '#diff-match',
    title: 'DiffMatch',
  },
  {
    key: 'check-or-close-icon',
    href: '#check-or-close-icon',
    title: 'CheckOrCloseIcon',
  },
  {
    key: 'collapse-table',
    href: '#collapse-table',
    title: 'CollapseTable',
  },
  {
    key: 'ellipsis-tooltip',
    href: '#ellipsis-tooltip',
    title: 'EllipsisTooltip',
  },
  {
    key: 'empty-wrapper',
    href: '#empty-wrapper',
    title: 'EmptyWrapper',
  },
  {
    key: 'flex-center-wrapper',
    href: '#flex-center-wrapper',
    title: 'FlexCenterWrapper',
  },
  {
    key: 'help-tooltip',
    href: '#help-tooltip',
    title: 'HelpTooltip',
  },
  {
    key: 'highlight-row-table',
    href: '#highlight-row-table',
    title: 'HighlightRowTable',
  },
  {
    key: 'label',
    href: '#label',
    title: 'Label',
  },
  {
    key: 'pane-drawer',
    href: '#pane-drawer',
    title: 'PaneDrawer',
  },
  {
    key: 'panes-title',
    href: '#panes-title',
    title: 'PanesTitle',
  },
  {
    key: 'scene-code',
    href: '#scene-code',
    title: 'SceneCode',
  },
  {
    key: 'small-text-button',
    href: '#small-text-button',
    title: 'SmallTextButton',
  },
  {
    key: 'space-between-wrapper',
    href: '#space-between-wrapper',
    title: 'SpaceBetweenWrapper',
  },
  {
    key: 'tooltip-button',
    href: '#tooltip-button',
    title: 'TooltipButton',
  },
  {
    key: 'request-method-icon',
    href: '#request-method-icon',
    title: 'RequestMethodIcon',
  },
];

const dataSource = [
  { key: '001', name: 'Tom', age: 12 },
  { key: '002', name: 'Jack', age: 15 },
];

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
];

const Components: ArexPaneFC = () => {
  const { token } = theme.useToken();
  const [collapseTableActiveKey, setCollapseTableActiveKey] = useState<{
    key: string;
    name: string;
    age: number;
  }>();
  const [loading, setLoading] = useState(true);
  const [panesTitle, setPanesTitle] = useState('arex-core Components');
  const [openPaneDrawer, setOpenPaneDrawer] = useState(false);

  return (
    <Row style={{ paddingBottom: `16px` }}>
      <PanesTitle title='arex-core Components'></PanesTitle>
      <Col span={18}>
        <div id='diff-json-view'>
          <Divider orientation='left'>DiffJsonView</Divider>
          <DiffJsonView
            readOnly
            diffJson={{
              left: JSON.stringify({ name: 'Tom', age: 12 }),
              right: JSON.stringify({ name: 'Jack', age: 12 }),
            }}
            diffPath={[
              {
                pathPair: {
                  unmatchedType: 3,
                  leftUnmatchedPath: [{ nodeName: 'name', index: null }],
                  rightUnmatchedPath: [{ nodeName: 'name', index: null }],
                },
                logTag: {
                  errorType: 0,
                },
              },
            ]}
          />
        </div>

        <div id='diff-match'>
          <Divider orientation='left'>DiffMatch</Divider>
          <DiffMatch
            text1={`My name is Tom, I'm 12 years old.`}
            text2={`My name is Jack, I'm 15 years old.`}
          />
        </div>

        <div id='check-or-close-icon'>
          <Divider orientation='left'>CheckOrCloseIcon</Divider>

          <Space>
            <CheckOrCloseIcon checked />
            <CheckOrCloseIcon checked={false} />
          </Space>
        </div>

        <div id='collapse-table'>
          <Divider orientation='left'>CollapseTable</Divider>

          <CollapseTable
            active={!!collapseTableActiveKey}
            size='small'
            table={
              <HighlightRowTable
                size='small'
                dataSource={dataSource}
                columns={columns}
                onRowClick={(record) => {
                  const expanded = record.key === collapseTableActiveKey?.key;
                  setCollapseTableActiveKey(expanded ? undefined : record);
                }}
              />
            }
            panel={
              <Card size='small'>{`My name is ${collapseTableActiveKey?.name}, I am ${collapseTableActiveKey?.age} years old.`}</Card>
            }
          />
        </div>

        <div id='ellipsis-tooltip'>
          <Divider orientation='left'>EllipsisTooltip</Divider>

          <EllipsisTooltip
            showSeparator
            title={
              'http://arex.test.dev.uat.qa.nt.ctripcorp.com/report/report/queryPlanItemStatistics'
            }
            separator={'/'}
          />
        </div>

        <div id='empty-wrapper'>
          <Divider orientation='left'>EmptyWrapper</Divider>
          <Label>Loading</Label>
          <Switch checked={loading} onChange={setLoading} />
          <EmptyWrapper loading={loading} empty={loading}>
            Hello World
          </EmptyWrapper>
        </div>

        <div id='flex-center-wrapper'>
          <Divider orientation='left'>FlexCenterWrapper</Divider>

          <div
            style={{
              width: '400px',
              height: '240px',
              border: `1px solid ${token.colorBorder}`,
              borderRadius: `${token.borderRadius}px`,
            }}
          >
            <span style={{ position: 'absolute' }}>Wrapper</span>
            <FlexCenterWrapper>
              <div
                style={{
                  width: '200px',
                  height: '120px',
                  border: `1px solid ${token.colorBorder}`,
                  borderRadius: `${token.borderRadius}px`,
                }}
              >
                inner
              </div>
            </FlexCenterWrapper>
          </div>
        </div>

        <div id={'help-tooltip'}>
          <Divider orientation='left'>HelpTooltip</Divider>
          <HelpTooltip title={'hello world'}>Title</HelpTooltip>
        </div>

        <div id={'highlight-row-table'}>
          <Divider orientation='left'>HighlightRowTable</Divider>
          <HighlightRowTable size='small' dataSource={dataSource} columns={columns} />
        </div>

        <div id={'label'}>
          <Divider orientation='left'>Label</Divider>
          <Label>label</Label>
        </div>

        <div id='pane-drawer'>
          <Divider orientation='left'>PaneDrawer</Divider>
          <Button size='small' type='primary' onClick={() => setOpenPaneDrawer(true)}>
            open PaneDrawer
          </Button>
          <PaneDrawer title='title' open={openPaneDrawer} onClose={() => setOpenPaneDrawer(false)}>
            hello world
          </PaneDrawer>
        </div>
        <div id={'panes-title'}>
          <Divider orientation='left'>PanesTitle</Divider>
          <PanesTitle
            editable
            title={panesTitle}
            onSave={setPanesTitle}
            extra={
              <Dropdown
                menu={{
                  items: [
                    {
                      key: '1',
                      label: (
                        <a target='_blank' rel='noopener noreferrer'>
                          1st menu item
                        </a>
                      ),
                    },
                  ],
                }}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    Hover me
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            }
          />
        </div>

        <div id='scene-code'>
          <Divider orientation='left'>SceneCode</Divider>
          <Space>
            <SceneCode code={-1} />
            <SceneCode code={0} />
            <SceneCode code={1} />
            <SceneCode code={2} />
            <SceneCode code={4} />
          </Space>
        </div>

        <div id='small-text-button'>
          <Divider orientation='left'>SmallTextButton</Divider>
          <SmallTextButton icon={<CheckOutlined />} title='SmallTextButton' />
        </div>

        <div id='space-between-wrapper'>
          <Divider orientation='left'>SpaceBetweenWrapper</Divider>
          <SpaceBetweenWrapper
            css={css`
              padding: ${token.paddingSM}px;
              border: 1px solid ${token.colorBorder};
              border-radius: ${token.borderRadius}px;
            `}
          >
            <div>left</div>
            <div>center</div>
            <div>right</div>
          </SpaceBetweenWrapper>
        </div>

        <div id='tooltip-button'>
          <Divider orientation='left'>TooltipButton</Divider>
          <TooltipButton breakpoint={'xxl'} icon={<CheckOutlined />} title='TooltipButton' />
        </div>

        <div id='request-method-icon'>
          <Divider orientation='left'>RequestMethodIcon</Divider>
          {Object.entries(RequestMethodIcon)
            .filter(([key]) => key[0] === key[0].toLowerCase())
            .map(([key, Icon], index) => (
              <div key={index}>
                <Space>
                  <div>
                    <Label>key</Label> {key} / {key.replace(key[0], (str) => str.toUpperCase())} /{' '}
                    {key.toUpperCase()}
                  </div>
                  <Divider type='vertical' />
                  <div>
                    <Label>icon</Label> <Icon />
                  </div>
                </Space>
              </div>
            ))}
        </div>
      </Col>

      <Col span={6}>
        <Anchor items={anchorItems} style={{ position: 'fixed', top: 100 }} />
      </Col>
    </Row>
  );
};

export default createArexPane(Components, {
  type: PanesType.COMPONENTS,
  icon: <AppstoreOutlined />,
});

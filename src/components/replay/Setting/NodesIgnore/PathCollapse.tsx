import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Button, Collapse, List } from 'antd';
import React, { FC, useEffect, useMemo } from 'react';

export enum IgnoreType {
  Global,
  Interfaces,
}
export const GLOBAL_KEY = '__global__';

type GlobalCheckedNodes = string[];
type InterfacesCheckedNodes = { [key: string]: string[] };
type PathCollapseProps = {
  activeKey?: string;
  onChange: (path: string) => void;
  onSelect: (path: string | undefined, selected: string[]) => void;
  interfaces?: string[]; // 当不传 interfaces 时认为是 Global 类型
  checkedNodes: GlobalCheckedNodes | InterfacesCheckedNodes;
};

const PathCollapse: FC<PathCollapseProps> = (props) => {
  const type = useMemo<IgnoreType>(
    () => (Array.isArray(props.interfaces) ? IgnoreType.Interfaces : IgnoreType.Global),
    [props.interfaces],
  );

  useEffect(() => {
    if (Array.isArray(props.interfaces) && Array.isArray(props.checkedNodes)) {
      console.error('props checkedNodes type error');
    }
  }, []);

  return (
    <Collapse
      accordion
      activeKey={props.activeKey}
      css={css`
        .ant-collapse-content-box {
          padding: 0 !important;
        }
      `}
      onChange={(activeKey) =>
        props.onChange &&
        props.onChange(type === IgnoreType.Global ? GLOBAL_KEY : (activeKey as string))
      }
    >
      {(type === IgnoreType.Global ? [GLOBAL_KEY] : (props.interfaces as [])).map((path) => {
        const checkedNodes =
          type === IgnoreType.Global
            ? (props.checkedNodes as GlobalCheckedNodes)
            : (props.checkedNodes as InterfacesCheckedNodes)[path];
        return (
          <Collapse.Panel
            key={path}
            header={`${type === IgnoreType.Interfaces ? path : 'Global'}`}
            extra={
              <span>
                <span style={{ marginRight: '8px' }}>{`${checkedNodes?.length ?? 0} keys`}</span>
              </span>
            }
          >
            <List
              size='small'
              dataSource={checkedNodes}
              renderItem={(key) => (
                <List.Item>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <span>{key}</span>
                    <Button
                      type='text'
                      size='small'
                      icon={<DeleteOutlined />}
                      onClick={() =>
                        props.onSelect(
                          path,
                          checkedNodes.filter((p) => p !== key),
                        )
                      }
                    />
                  </div>
                </List.Item>
              )}
              locale={{ emptyText: 'No Ignored Nodes' }}
            />
          </Collapse.Panel>
        );
      })}
    </Collapse>
  );
};

export default PathCollapse;

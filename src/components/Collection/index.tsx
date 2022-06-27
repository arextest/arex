import "./index.less";

import {
  ApiOutlined, BlockOutlined,
  DownOutlined,
  FolderOutlined,
  FrownFilled,
  MoreOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { css } from "@emotion/react";
import { useMount } from "ahooks";
import {
  Badge,
  Button,
  Divider,
  Dropdown,
  Empty,
  Input,
  List,
  Menu,
  notification,
  Space,
  Tabs,
  Tree,
} from "antd";
import type { DirectoryTreeProps } from "antd/lib/tree";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { FileSystemService } from "../../api/FileSystem.service";
import { useStore } from "../../store";
import CreateAndUpdateFolder from "./CreateAndUpdateFolder";
import { findPathbyKey } from "./util";

const { TabPane } = Tabs;
const onChange = (key: string) => {
};

const { DirectoryTree } = Tree;

const Collection = ({ changeSelectedRequest }: any) => {
  const { t } = useTranslation("components");
  const [treeData, setTreeData] = useState([]);
  const currentWorkspaceId = useStore((state) => state.currentWorkspaceId);
  const onSelect: DirectoryTreeProps["onSelect"] = (keys, info) => {
  };
  const [currentSelectLeaf, setCurrentSelectLeaf] = useState("");
  const createAndUpdateFolderRef = useRef<any>();

  const onExpand: DirectoryTreeProps["onExpand"] = (keys, info) => {

  };

  useMount(() => {
    fetchWorkspaceData();
  });

  useEffect(() => {
    fetchWorkspaceData();
  }, [currentWorkspaceId]);
  function TitleRender({ val }: any) {
    const [visible, setVisible] = useState(false);
    const handleVisibleChange = (flag: boolean) => {
      setVisible(flag);
    };
    const menu = (val: any) => {
      return (
        <Menu
          onClick={(e) => {
            e.domEvent.stopPropagation();
            // se
            setVisible(false);
            // notification.info({message:'成功'})
          }}
          items={[
            {
              key: "2",
              label: (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    createAndUpdateFolderRef.current.changeVal({
                      path: findPathbyKey(treeData, val.key).map(i=>i.key),
                      mode: "create",
                    });
                  }}
                >
                  New Folder
                </a>
              ),
              disabled: val.nodeType !== 3,
            },
            {
              key: "5",
              label: (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    createAndUpdateFolderRef.current.changeVal({
                      path: findPathbyKey(treeData, val.key).map(i=>i.key),
                      mode: "createRequest",
                    });
                  }}
                >
                  New Request
                </a>
              ),
              disabled: val.nodeType !== 3,
            },
            {
              key: "6",
              label: (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    createAndUpdateFolderRef.current.changeVal({
                      path: findPathbyKey(treeData, val.key).map(i=>i.key),
                      mode: "createCase",
                    });
                  }}
                >
                  New Case
                </a>
              ),
              disabled: val.nodeType !== 1,
            },
            {
              key: "1",
              label: (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    createAndUpdateFolderRef.current.changeVal({
                      path: findPathbyKey(treeData, val.key).map(i=>i.key),
                      mode: "update",
                    });
                  }}
                >
                  Rename
                </a>
              ),
            },
            {
              key: "3",
              label: (
                <a
                  style={{ color: "red" }}
                  onClick={() => {
                    FileSystemService.removeItem({
                      id: currentWorkspaceId,
                      removeNodePath: findPathbyKey(treeData, val.key).map(i=>i.key),
                    }).then((res) => {
                      fetchWorkspaceData();
                    });
                  }}
                >
                  Delete
                </a>
              ),
            },
          ]}
        />
      );
    };
    return (
      <div className={"title-render"}>
        <div className={"wrap"}>
          <div
            className={"title"}
            onClick={() => {
              if (val.nodeType === 1) {
                changeSelectedRequest({
                  id: val.key,
                  path: findPathbyKey(treeData, val.key),
                });

                setCurrentSelectLeaf(val.key);
              } else if (val.nodeType === 2){
                changeSelectedRequest({
                  id: val.key,
                  path: findPathbyKey(treeData, val.key),
                });
                setCurrentSelectLeaf(val.key);
              }
            }}
          >
            <div className={"ellipsis"}>{val.title}</div>
            {currentSelectLeaf === val.key ? (
              <Badge style={{ marginLeft: "8px" }} status="processing" />
            ) : null}
          </div>
          <Dropdown
            overlay={menu(val)}
            trigger={["click"]}
            visible={visible}
            onVisibleChange={handleVisibleChange}
          >
            <span onClick={(event) => event.stopPropagation()}>
              <Space>
                <MoreOutlined />
              </Space>
            </span>
          </Dropdown>
        </div>
      </div>
    );
  }

  function fetchWorkspaceData() {
    FileSystemService.queryWorkspaceById({ id: currentWorkspaceId }).then(
      (res) => {
        function generateTreeData(nodes:any, nodeList:any = []) {
          const iconMap = {
            '1':<ApiOutlined />,
            '2': <span className={'tree-icon'}>case</span>,
            '3':undefined
          }

          Object.keys(nodes).forEach((value, index, array) => {
            nodeList.push({
              title: nodes[value].nodeName,
              key: nodes[value].infoId,
              nodeType: nodes[value].nodeType,
              children: [],
              icon:iconMap[nodes[value].nodeType]
            });
            if (
              nodes[value].children &&
              Object.keys(nodes[value].children).length > 0
            ) {
              generateTreeData(nodes[value].children, nodeList[index].children);
            }
          });

          return nodeList;
        }
        try {
          setTreeData(generateTreeData(res.body.fsTree.roots));
        } catch (e) {}
      }
    );
  }

  return (
    <div className={"collection"}>
      <Tabs
        defaultActiveKey="2"
        onChange={onChange}
        tabPosition={"left"}
        css={css`
          .ant-tabs-tab {
            padding: 8px !important;
            left: 10px;
          }
        `}
      >
        <TabPane tab={<FolderOutlined />} key="2">
          <a
            className={"new-btn"}
            onClick={() => {
              createAndUpdateFolderRef.current.changeVal({
                path: [],
                mode: "create",
              });
            }}
          >
            +<span style={{ marginLeft: "8px" }}>New</span>
          </a>
          <Divider />
          <DirectoryTree
            selectable={false}
            multiple
            defaultExpandAll
            onSelect={onSelect}
            onExpand={onExpand}
            treeData={treeData}
            titleRender={(val) => <TitleRender val={val}/>}
          />
          <Empty style={{ display: treeData.length > 0 ? "none" : "block" }}>
            <Button
              type="primary"
              onClick={() => {
                createAndUpdateFolderRef.current.changeVal({
                  path: [],
                  mode: "create",
                });
              }}
            >
              Create Now
            </Button>
          </Empty>
        </TabPane>
      </Tabs>
      <CreateAndUpdateFolder
        ref={createAndUpdateFolderRef}
        updateParentComponent={() => {
          fetchWorkspaceData();
        }}
      />
    </div>
  );
};

export default Collection;

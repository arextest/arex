import "./index.less";

import {
  ApiOutlined,
  DownOutlined,
  FolderOutlined, FrownFilled,
  MoreOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { useMount } from "ahooks";
import {
    Badge,
    Button,
    Divider,
    Dropdown,
    Empty,
    Input,
    List,
    Menu, notification,
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
import {findPathbyKey} from "./util";



const { TabPane } = Tabs;
const onChange = (key: string) => {
  console.log(key);
};

const { DirectoryTree } = Tree;

const Collection = ({ changeSelectedRequest }:any) => {
  const { t } = useTranslation("components");
  const [treeData, setTreeData] = useState([]);
  const currentWorkspaceId = useStore((state) => state.currentWorkspaceId);
  const onSelect: DirectoryTreeProps["onSelect"] = (keys, info) => {
    console.log("Trigger Select", keys, info);
  };
  const [currentSelectLeaf, setCurrentSelectLeaf] = useState("");
  const createAndUpdateFolderRef = useRef<any>();

  const onExpand: DirectoryTreeProps["onExpand"] = (keys, info) => {
    console.log("Trigger Expand", keys, info);
  };

  useMount(() => {
    fetchWorkspaceData();
  });

  useEffect(() => {
    fetchWorkspaceData();
  }, [currentWorkspaceId]);

    function TitleRender({ val }:any) {
        const [visible,setVisible] = useState(false)
        const handleVisibleChange = (flag: boolean) => {
            setVisible(flag);
        };
        const menu = (val:any) => {
            return (
                <Menu
                    onClick={(e)=>{
                        e.domEvent.stopPropagation()
                        // se
                        setVisible(false)
                        notification.info({message:'成功'})
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
                                            path: findPathbyKey(treeData, val.key),
                                            mode: "create",
                                        });
                                    }}
                                >
                                    新增文件夹
                                </a>
                            ),
                            disabled: !!val.isLeaf,
                        },
                        {
                            key: "5",
                            label: (
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => {
                                        createAndUpdateFolderRef.current.changeVal({
                                            path: findPathbyKey(treeData, val.key),
                                            mode: "createRequest",
                                        });
                                    }}
                                >
                                    新增请求
                                </a>
                            ),
                            disabled: !!val.isLeaf,
                        },
                        {
                            key: "1",
                            label: (
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => {
                                        createAndUpdateFolderRef.current.changeVal({
                                            path: findPathbyKey(treeData, val.key),
                                            mode: "update",
                                        });
                                    }}
                                >
                                    重命名
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
                                            removeNodePath: findPathbyKey(treeData, val.key),
                                        }).then((res) => {
                                            fetchWorkspaceData();
                                        });
                                    }}
                                >
                                    删除
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
              console.log(val, "val", findPathbyKey(treeData, val.key));
              if (val.isLeaf) {
                changeSelectedRequest({
                  id: val.key,
                  path: findPathbyKey(treeData, val.key),
                });

                setCurrentSelectLeaf(val.key);
                FileSystemService.queryInterface({ id: val.key }).then(
                  (res) => {
                    console.log(res);
                  }
                );
              }
            }}
          >
            <div className={"ellipsis"}>{val.title}</div>
            {currentSelectLeaf === val.key ? (
              <Badge style={{ marginLeft: "8px" }} status="processing" />
            ) : null}
          </div>
          <Dropdown overlay={menu(val)} trigger={["click"]} visible={visible} onVisibleChange={handleVisibleChange}>
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
          Object.keys(nodes).forEach((value, index, array) => {
            nodeList.push({
              title: nodes[value].nodeName,
              key: nodes[value].infoId,
              isLeaf: nodes[value].nodeType !== 3,
              children: [],
              icon:nodes[value].nodeType !== 3?<ApiOutlined />:null
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
      <Tabs defaultActiveKey="2" onChange={onChange} tabPosition={"left"}>
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
            +<span style={{ marginLeft: "8px" }}>新增</span>
          </a>
          <Divider />
          <DirectoryTree
            selectable={false}
            multiple
            defaultExpandAll
            onSelect={onSelect}
            onExpand={onExpand}
            treeData={treeData}
            titleRender={(val) => <TitleRender val={val}></TitleRender>}
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

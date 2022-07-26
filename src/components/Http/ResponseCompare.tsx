import "codemirror/addon/merge/merge.css";
import "codemirror/addon/merge/merge.js";
import "codemirror/theme/neat.css";
import "codemirror/theme/gruvbox-dark.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/foldgutter";
import "codemirror/addon/fold/brace-fold";

import styled from "@emotion/styled";
import { Radio, Table, Tabs } from "antd";
import CodeMirror from "codemirror";
import DiffMatchPatch from "diff-match-patch";
import { useEffect, useRef, useState } from "react";

import { useStore } from "../../store";
import { Theme } from "../../style/theme";
import { useMount } from "ahooks";
import { RequestService } from "../../services/RequestService";
import axios from "axios";

const { TabPane } = Tabs;
const DiffView = styled.div<{ theme: Theme }>`
  // 主体样式
  .CodeMirror,
  .CodeMirror-merge {
    height: 600px;
    border-color: ${
  ({ theme }) => theme === Theme.light ? "#f0f0f0" : "#303030"
};
  }

  // 左右文本差异高亮样式
  .CodeMirror-merge-r-chunk-start {
    border-top: 1px solid
      ${({ theme = Theme.light }) => theme === Theme.light ? "#ee8" : "#959582"};
  }
  .CodeMirror-merge-r-chunk-end {
    border-bottom: 1px solid
      ${({ theme = Theme.light }) => theme === Theme.light ? "#ee8" : "#959582"};
  }
  .CodeMirror-merge-r-chunk {
    background-color: ${
  ({ theme = Theme.light }) => theme === Theme.light ? "#ffffe0" : "#787869"
};
  }

  // 中间分隔区样式
  .CodeMirror-merge-gap {
    border-color: ${
  ({ theme }) => theme === Theme.light ? "inherit" : "#959582"
};
    background-color: ${
  ({ theme = Theme.light }) => theme === Theme.light ? "#f8f8f8" : "#282828"
} !important;
    path {
      stroke: ${
  ({ theme = Theme.light }) => theme === Theme.light ? "#ee8" : "#959582"
};
      fill: ${
  ({ theme = Theme.light }) => theme === Theme.light ? "#ffffe0" : "#787869"
};
    }
  }

  // 水平滚动条样式 （垂直滚动条样式已在全局样式中设置）
  .CodeMirror-hscrollbar {
    height: 6px;
    border-radius: 3px;
    background: #88888844;
  }
`;
// @ts-ignore
window.diff_match_patch = DiffMatchPatch;
// @ts-ignore
window.DIFF_DELETE = -1;
// @ts-ignore
window.DIFF_INSERT = 1;
// @ts-ignore
window.DIFF_EQUAL = 0;

const onChange = (key: string) => {
  console.log(key);
};

const ResponseCompare = ({ responses }) => {
  console.log(responses, "responses");
  const diffView = useRef<HTMLDivElement>();
  const theme = useStore((store) => store.theme);
  let mergeView;
  useEffect(() => {
    if (!diffView.current) {
      return;
    }

    document.querySelector(".diffView").innerHTML = "";
    mergeView = CodeMirror.MergeView(diffView.current, {
      readOnly: true, // 只读
      lineNumbers: true, // 显示行号
      theme: theme === "light" ? "neat" : "gruvbox-dark", // 设置主题
      value: JSON.stringify(responses[0], null, 2), // 左边的内容（新内容）
      orig: JSON.stringify(responses[1], null, 2), // 右边的内容（旧内容）
      mode: "javascript", // 代码模式为js模式
      viewportMargin: Infinity, // 允许滚动的距离
      highlightDifferences: true, // 有差异的地方是否高亮
      revertButtons: false, // revert按钮设置为true可以回滚
      styleActiveLine: true, // 光标所在的位置代码高亮
      lineWrap: false, // 文字过长时，是换行(wrap)还是滚动(scroll),默认是滚动
      smartIndent: true, // 智能缩进
      matchBrackets: true, // 括号匹配
      foldGutter: true, // 代码折叠
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      // 智能提示
      extraKeys: {
        "Alt-/": "autocomplete",
        // F11: function (cm) {
        //   cm.setOption("fullScreen", !cm.getOption("fullScreen"));
        // },
      },
    });
    // mergeView.editor().setSize(null, "100%");
  }, [responses]);

  const columns = [
    {
      title: "Left Path",
      dataIndex: "pathPair",
      key: "pathPair",
      render(pathPair) {
        const leftArr = [];
        for (let i = 0; i < pathPair.leftUnmatchedPath.length; i++) {
          leftArr.push(
            pathPair.leftUnmatchedPath[i].nodeName ? pathPair.leftUnmatchedPath[
              i
            ].nodeName : pathPair.leftUnmatchedPath[i].index,
          );
        }
        return <div>{leftArr.join('.')}</div>;
      },
    },
    {
      title: "Right Path",
      dataIndex: "pathPair",
      key: "pathPair",
      render(pathPair) {
        const rightArr = [];
        for (let i = 0; i < pathPair.rightUnmatchedPath.length; i++) {
          rightArr.push(
            pathPair.rightUnmatchedPath[i]
              .nodeName ? pathPair.rightUnmatchedPath[i]
              .nodeName : pathPair.rightUnmatchedPath[i].index,
          );
        }
        return <div>{rightArr.join('.')}</div>;
      },
    },
    {
      title: "Left Value",
      dataIndex: "baseValue",
      key: "baseValue",
    },
    {
      title: "Right Value",
      dataIndex: "testValue",
      key: "testValue",
    },
    {
      title: "Difference",
      dataIndex: "logInfo",
      key: "logInfo",
    },
  ];

  const [activeRadio, setActiveRadio] = useState<string>("json");
  const [dataSource, setDataSource] = useState<any>([]);
  const optionsWithDisabled = [
    { label: "JSON", value: "json" },
    { label: "Table", value: "table" },

  ];

  function abc(aa){
    for( var key in aa){
      if(aa[key]===null){
        aa[key]=""
      }
      if(typeof aa[key] == "object"){
        abc(aa[key])
      }
    }
    return aa
  }
  useEffect(() => {
    if (responses[0]&&responses[1]){
      // console.log(responses[0],responses[1],abc(responses[0]))
      const params = {
        msgCombination: {
          baseMsg:JSON.stringify(abc(responses[0])),
          testMsg:JSON.stringify(abc(responses[1]))
        },
      };
      axios.post("/api/compare/quickCompare", params).then((res) => {
        console.log(res.data);
        setDataSource(res.data.body.logs)
      });
    }

  },[responses]);
  return (
    <div>
      <Tabs defaultActiveKey="1" onChange={onChange}>
        <TabPane tab="Compare Result" key="1">
          <div id="wrapper">
            <div  style={{textAlign:'right',marginBottom:'10px'}}>
              <Radio.Group
                  size={'small'}
                  options={optionsWithDisabled}
                  onChange={(val) => {
                    console.log(val, "val");
                    setActiveRadio(val.target.value);
                  }}
                  value={activeRadio}
                  optionType="button"
                  buttonStyle="solid"
              />
            </div>

            <div className="react-diff-code-view" style={{ height: "100%",display: activeRadio === 'json'?'block':'none' }}>
              <DiffView className={"diffView"} ref={diffView} theme={theme} />
            </div>
            <div style={{ display: activeRadio === 'table'?'block':'none' }}><Table dataSource={dataSource} columns={columns} /></div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ResponseCompare;

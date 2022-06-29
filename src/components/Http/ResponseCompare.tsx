import "codemirror/addon/merge/merge.css";
import "codemirror/addon/merge/merge.js";
import "codemirror/theme/neat.css";
import "codemirror/theme/gruvbox-dark.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/foldgutter";
import "codemirror/addon/fold/brace-fold";

import { css } from "@emotion/react";
import { Tabs } from "antd";
import CodeMirror from "codemirror";
import DiffMatchPatch from "diff-match-patch";
import { useEffect, useRef } from "react";

import { useStore } from "../../store";

const { TabPane } = Tabs;

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

const valueLeft = {
  arrayOfArrays: [1, 2, 999, [3, 4, 5]],
  someField: true,
  boolean: true,
  htmlcode: "&quot;",
  escaped_unicode: "\\u20b9",
  unicode: "\u20b9,\uD83D\uDCA9",
  return: "\n",
  null: null,
  thisObjectDoesntExistOnTheRight: { key: "value" },
  number: 123,
  object: { a: "b", new: 4, c: "d", e: [1, 2, 3] },
  string: "Hello World",
  url: "http://jsoneditoronline.org",
  "[0]": "zero",
};

const valueRight = {
  arrayOfArrays: [1, 2, [3, 4, 5]],
  boolean: true,
  htmlcode: "&quot;",
  escaped_unicode: "\\u20b9",
  thisFieldDoesntExistOnTheLeft: "foobar",
  unicode: "\u20b9,\uD83D\uDCA9",
  return: "\n",
  null: null,
  number: 123,
  object: { a: "b", c: "d", e: [1, 2, 3] },
  string: "Hello World",
  url: "http://jsoneditoronline.org",
  "[0]": "zero",
};

const ResponseCompare = ({ responses }) => {
  const diffView = useRef<HTMLDivElement>();
  const theme = useStore((store) => store.theme);
  let mergeView;
  useEffect(() => {
    if (!diffView.current) return;

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

  // useEffect(() => {
  //   if (!mergeView) return;
  //   console.log(mergeView);
  //   mergeView.editor().setOption("theme", theme === "light" ? "neat" : "gruvbox-dark");
  // }, [theme]);

  return (
    <div>
      <Tabs defaultActiveKey="1" onChange={onChange}>
        <TabPane tab="对比结果" key="1">
          <div id="wrapper">
            <div className="react-diff-code-view" style={{ height: "100%" }}>
              <div
                className={"diffView"}
                ref={diffView}
                css={css`
                  .CodeMirror,
                  .CodeMirror-merge {
                    height: 600px;
                    border: none;
                  }
                `}
              />
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ResponseCompare;

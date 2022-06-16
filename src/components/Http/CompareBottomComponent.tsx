import {Button, Tabs} from "antd";
import {useEffect, useState} from "react";
import JSONEditor from 'jsoneditor'
const { TabPane } = Tabs;
import {useMount} from 'ahooks'
import './index.less'
import _ from 'lodash'
const onChange = (key: string) => {
  console.log(key);
};
const CompareBottomComponent = () => {


  // https://codemirror.net/5/ codemirror5文档
  useMount(() => {
    const containerLeft = document.getElementById('containerLeft')
    const containerRight = document.getElementById('containerRight')

    function onClassName({ path, field, value }) {
      const leftValue = _.get(jsonRight, path)
      const rightValue = _.get(jsonLeft, path)

      return _.isEqual(leftValue, rightValue)
        ? 'the_same_element'
        : 'different_element'
    }

    const optionsLeft = {
      mode: 'tree',
      onClassName: onClassName,
      onChangeJSON: function (j) {
        jsonLeft = j
        window.editorRight.refresh()
      }
    }

    const optionsRight = {
      mode: 'tree',
      onClassName: onClassName,
      onChangeJSON: function (j) {
        jsonRight = j
        window.editorLeft.refresh()
      }
    }

    let jsonLeft = {
      "arrayOfArrays": [1, 2, 999, [3,4,5]],
      "someField": true,
      "boolean": true,
      "htmlcode": '&quot;',
      "escaped_unicode": '\\u20b9',
      "unicode": '\u20b9,\uD83D\uDCA9',
      "return": '\n',
      "null": null,
      "thisObjectDoesntExistOnTheRight" : {key: "value"},
      "number": 123,
      "object": {"a": "b","new":4, "c": "d", "e": [1, 2, 3]},
      "string": "Hello World",
      "url": "http://jsoneditoronline.org",
      "[0]": "zero"
    }

    let jsonRight = {
      "arrayOfArrays": [1, 2, [3,4,5]],
      "boolean": true,
      "htmlcode": '&quot;',
      "escaped_unicode": '\\u20b9',
      "thisFieldDoesntExistOnTheLeft": 'foobar',
      "unicode": '\u20b9,\uD83D\uDCA9',
      "return": '\n',
      "null": null,
      "number": 123,
      "object": {"a": "b",  "c": "d", "e": [1, 2, 3]},
      "string": "Hello World",
      "url": "http://jsoneditoronline.org",
      "[0]": "zero"
    }

    window.editorLeft = new JSONEditor(containerLeft, optionsLeft, jsonLeft)
    window.editorRight = new JSONEditor(containerRight, optionsRight, jsonRight)
  })

  return <div>

    <Tabs defaultActiveKey="1" onChange={onChange}>
      <TabPane tab="对比结果" key="1">
        <div id="wrapper">
          <div id="containerLeft"></div>
          <div id="containerRight"></div>
        </div>
      </TabPane>
    </Tabs>


  </div>;
};

export default CompareBottomComponent;

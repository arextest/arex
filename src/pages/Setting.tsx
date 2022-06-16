import {useEffect, useState} from "react";
import Collection from "../components/Collection";
import {Col, Row} from "antd";

const Setting = () => {
  const [count, setCount] = useState(0);
  // https://codemirror.net/5/ codemirror5文档
  useEffect(() => {
    const el: any = document.querySelector('#codemirror-editor')
    // @ts-ignore
    const myCodeMirror: any = CodeMirror(el, {
      value: 'const a=1',
      mode: 'javascript',
      lineNumbers: true,
      theme: 'idea',
    })
    myCodeMirror.setSize('auto', 'auto')
    myCodeMirror.setOption('readOnly', 'nocursor')
  }, [])

  return <div style={{fontStyle:'12px'}}>
    <Row>
      <Col className="gutter-row" span={18}>
        <div id={'codemirror-editor'}>
        </div>
      </Col>
      <Col className="gutter-row" span={6}>
        <div>
          <Collection></Collection>
        </div>
      </Col>
    </Row>
  </div>;
};

export default Setting;

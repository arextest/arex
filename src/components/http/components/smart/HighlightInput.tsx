import './HighlightInput.css';

import React, { useMemo, useState } from 'react';

interface HighlightRule {
  pattern: RegExp | string;
  class: any;
  tooltip: any;
}
export type HighlightInputProps = {
  value: string;
  onChange: (value: string) => void;
  highlight: HighlightRule;
  theme: string;
};

const HighlightInput: React.FC<HighlightInputProps> = ({
  value,
  onChange,
  highlight,
  theme = 'light',
}) => {
  // 标志位，hover后设置激活的元素索引
  const [hoverFlagBit, setHoverFlagBit] = useState(-1);
  const defaultValue = useMemo(() => value, []); // eslint-disable-line react-hooks/exhaustive-deps
  const normalStringList = value
    .replace(highlight.pattern, '&&&')
    .split('&&&')
    .map((i) => ({
      class: 'normal',
      value: i,
      tooltip: highlight.tooltip,
    }));
  const patternStringList = (value.match(highlight.pattern) || []).map((i) => ({
    class: highlight.class(i),
    value: i,
    tooltip: highlight.tooltip,
  }));
  const totalStringList = [];
  for (let i = 0; i < patternStringList.length; i++) {
    totalStringList.push(normalStringList[i]);
    totalStringList.push(patternStringList[i]);
    if (patternStringList.length - 1 === i) {
      totalStringList.push(normalStringList[i + 1]);
    }
  }
  return (
    <div className={`highlight-input ${theme}`}>
      <div className={'display-input input'}>
        {totalStringList.length > 0 ? (
          totalStringList.map((i, index) => {
            return (
              <div
                data-name={index}
                key={index}
                style={{
                  position: 'relative',
                }}
                className={i.class}
              >
                <span
                  style={{
                    opacity: hoverFlagBit === index && i.class !== 'normal' ? '0.7' : '1',
                  }}
                >
                  {i.value}
                </span>

                <div
                  className={'rhi-tooltip'}
                  style={{
                    display: hoverFlagBit === index && i.class !== 'normal' ? 'block' : 'none',
                  }}
                  onMouseMove={() => {
                    setHoverFlagBit(index);
                  }}
                  onMouseOut={() => {
                    setHoverFlagBit(-1);
                  }}
                  onBlur={() => {
                    setHoverFlagBit(-1);
                  }}
                >
                  <div className='content'>{i.tooltip(i.value)}</div>
                  <div className='shim'>
                    <div className='small-triangle'></div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div>{value}</div>
        )}
      </div>
      <div
        onBlur={() => {
          setHoverFlagBit(-1);
        }}
        className={'real-input input'}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onKeyDown={(e) => {
          // 屏蔽特殊按键
          if (e.code === 'Enter') {
            e.preventDefault();
            return false;
          }
        }}
        onInput={(v) => {
          // @ts-ignore
          onChange(v.target.innerHTML);
        }}
        onMouseMove={(e) => {
          // 防止tooltip遮挡住了，所以判断两次
          let str = document.elementsFromPoint(e.clientX, e.clientY)[1].getAttribute('data-name');
          if (str === null) {
            str = document.elementsFromPoint(e.clientX, e.clientY)[2].getAttribute('data-name');
          }
          if (str) {
            setHoverFlagBit(Number(str));
          }
        }}
        onMouseOut={() => {
          setHoverFlagBit(-1);
        }}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData.getData('text/plain');
          document.execCommand('insertText', false, text);
        }}
      >
        {defaultValue}
      </div>
    </div>
  );
};

export default HighlightInput;

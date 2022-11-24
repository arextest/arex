import React, { useEffect, useRef, useState } from 'react';

type SearchKeywordTextProps = {
  text?: string;
  keyword?: string;
};

/**
 * 高亮关键字文本
 * 1. 将查询文本替换为html实体dom 附加到虚拟dom达到替换效果
 * 2. 支持大小写匹配
 * @param props 源数据，查询关键字
 * @returns
 */
const Instance: React.FC<SearchKeywordTextProps> = (props) => {
  const [htmlTxt, setHtmlTxt] = useState<string>('');

  useEffect(() => {
    if (!props.keyword) return setHtmlTxt(props.text || '');
    const regExp = new RegExp(props.keyword, 'i');
    const html = props.text?.replace(regExp, function (txt) {
      return `<span style=color:red>${txt}</span>`;
    });

    setHtmlTxt(html || '');
  }, [props.text, props.keyword]);

  return (
    <div>
      <span dangerouslySetInnerHTML={{ __html: htmlTxt }}></span>
    </div>
  );
};

export default Instance;

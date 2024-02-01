import React, { useEffect, useState } from 'react';

type SearchHighLightProps = {
  color?: string;
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
const SearchHighLight: React.FC<SearchHighLightProps> = (props) => {
  const { color = 'red' } = props;
  const [htmlTxt, setHtmlTxt] = useState<string>('');

  useEffect(() => {
    if (!props.keyword) return setHtmlTxt(props.text || '');
    const regExp = new RegExp(props.keyword, 'i');
    const html = props.text?.replace(regExp, (text) => `<span style=color:${color}>${text}</span>`);

    setHtmlTxt(html || '');
  }, [props.text, props.keyword, color]);

  return (
    <div>
      <span dangerouslySetInnerHTML={{ __html: htmlTxt }}></span>
    </div>
  );
};

export default SearchHighLight;

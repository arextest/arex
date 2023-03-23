import { Tooltip, TooltipProps, Typography } from 'antd';
import React, { FC } from 'react';

export type EllipsisTooltipProps = {
  ellipsis?: boolean;
  separator?: string | false; // title 分隔符
  showSeparator?: boolean; // 在分隔后加上分隔符前缀
  autoOpen?: boolean; // true: splitTitle 等于 title 时不使用 Tooltip, false: 强制使用 Tooltip
  title: string;
} & TooltipProps;

const EllipsisTooltip: FC<EllipsisTooltipProps> = (props) => {
  const {
    title,
    ellipsis = false,
    separator = /[.]|[/]/,
    showSeparator = false,
    autoOpen = true,
  } = props;

  if (!separator) {
    return (
      <Tooltip {...props}>
        <Typography.Text ellipsis={ellipsis}>{props.title}</Typography.Text>
      </Tooltip>
    );
  }

  const splitTitle = title.split(separator).at(-1);
  const displayedSeparator =
    showSeparator && splitTitle ? title[title.lastIndexOf(splitTitle) - 1] || separator : '';
  const displayedTitle = displayedSeparator + (splitTitle || '');

  return (
    <Tooltip
      {...props}
      open={props.open || (autoOpen && displayedTitle === title) ? false : undefined}
    >
      <Typography.Text ellipsis={ellipsis}>{displayedTitle}</Typography.Text>
    </Tooltip>
  );
};

export default EllipsisTooltip;

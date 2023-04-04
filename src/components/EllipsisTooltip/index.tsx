import { Tooltip, TooltipProps, Typography } from 'antd';
import React, { FC } from 'react';

export type EllipsisTooltipProps = {
  ellipsis?: boolean;
  // title 分隔符 (single char)
  separator?: string | false;
  // 在分隔后加上分隔符前缀
  showSeparator?: boolean;
  // true: lastSplitTitle 等于 title 时不使用 Tooltip, false: 强制使用 Tooltip
  autoOpen?: boolean;
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
      <Tooltip
        overlayInnerStyle={{ padding: 0 }}
        {...props}
        title={
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{ padding: '8px' }}
          >
            {props.title}
          </div>
        }
      >
        <Typography.Text ellipsis={ellipsis}>{props.title}</Typography.Text>
      </Tooltip>
    );
  }

  const splitTitle = title.split(separator);
  const lastSplitTitle = splitTitle.at(-1);
  const displayedSeparator =
    showSeparator && lastSplitTitle && splitTitle.length > 1
      ? title[title.lastIndexOf(lastSplitTitle) - 1] || props.separator || ''
      : '';
  const displayedTitle = displayedSeparator + (lastSplitTitle || '');

  return (
    <Tooltip
      overlayInnerStyle={{ padding: 0 }}
      {...props}
      title={
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{ padding: '8px' }}
        >
          {props.title}
        </div>
      }
      open={props.open || (autoOpen && displayedTitle === title) ? false : undefined}
    >
      <Typography.Text ellipsis={ellipsis}>{displayedTitle}</Typography.Text>
    </Tooltip>
  );
};

export default EllipsisTooltip;

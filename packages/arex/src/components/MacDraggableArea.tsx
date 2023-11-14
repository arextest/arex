import React, { FC } from 'react';

export type MacDraggableAreaProps = {
  height?: number | string;
  debug?: boolean;
};

const MacDraggableArea: FC<MacDraggableAreaProps> = (props) => {
  const { height = '46px', debug } = props;
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        background: debug ? 'red' : 'transparent',
        width: '100%',
        height,
        WebkitAppRegion: 'drag',
        zIndex: -1,
      }}
    />
  );
};

export default MacDraggableArea;

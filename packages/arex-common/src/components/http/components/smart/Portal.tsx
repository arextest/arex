import { FC, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export const Portal: FC<{ children: any }> = ({ children }) => {
  return <div>{createPortal(children, document.body)}</div>;
};

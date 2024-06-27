import { RefObject } from 'react';

export const focusNewLineInput = (tableRef: RefObject<HTMLDivElement>) => {
  setTimeout(() => {
    // focus last row key input
    const path = [6, 2, 2];
    let inputRef: ChildNode | null | undefined = tableRef?.current;
    path.forEach((level, i) => {
      for (let x = level; x > 0; x--) {
        if (!inputRef) break;
        inputRef = inputRef?.[i % 2 ? 'lastChild' : 'firstChild'];
      }
    });
    // @ts-ignore
    inputRef?.focus?.({
      cursor: 'start',
    });
  });
};

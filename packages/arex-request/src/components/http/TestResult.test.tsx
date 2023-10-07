import { fireEvent, render, screen } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import { describe, it } from 'vitest';
// 引入测试 api ，用来编写用例的逻辑
import { describe, expect, it, vi } from 'vitest';

import TestResult from './TestResult';

describe('测试TestResult组件', () => {
  it('渲染', () => {
    render(<TestResult testResult={[]}></TestResult>);
    expect(1).eq(1);
  });
});

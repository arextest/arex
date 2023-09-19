import '@emotion/react';

import { AliasToken } from 'antd/es/theme/interface';

declare module '@emotion/react' {
  export interface Theme extends Partial<AliasToken> {
    test: string;
  }
}

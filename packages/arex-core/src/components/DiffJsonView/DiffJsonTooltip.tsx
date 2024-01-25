import { Flex, theme as antdTheme } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import TagBlock from './TagBlock';

const DiffJsonTooltip: FC<TextProps> = (props) => {
  const { token } = antdTheme.useToken();
  const { t } = useTranslation();

  return (
    <Flex>
      <TagBlock title={t('moreNode')} color={token.colorWarningBgHover} {...props} />
      <TagBlock title={t('differenceNode')} color={token.colorInfoBgHover} {...props} />
    </Flex>
  );
};

export default DiffJsonTooltip;

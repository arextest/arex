import { Select } from 'antd';
import { I18_KEY, i18n, I18nextLng, local } from 'arex-core';
import React, { FC } from 'react';

const LanguageSelect: FC<{ value?: I18nextLng; onChange?: (lang: I18nextLng) => void }> = (
  props,
) => {
  return (
    <Select
      value={props.value}
      onChange={(lang) => {
        props.onChange?.(lang);
        i18n.changeLanguage(lang);
        localStorage.setItem(I18_KEY, lang);
      }}
      style={{ width: 120 }}
    >
      {local.map((lng) => (
        <Select.Option key={lng.key} value={lng.key}>
          {lng.name}
        </Select.Option>
      ))}
    </Select>
  );
};

export default LanguageSelect;

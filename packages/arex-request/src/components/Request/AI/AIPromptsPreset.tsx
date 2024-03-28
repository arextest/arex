import { Button, List } from 'antd';
import { useState } from 'react';
import { useArexRequestStore } from '../../../hooks';

export type DefaultPrompt = {
  buttonText: string;
  promptText: string;
  showOnEmpty?: boolean;
};

export const DEFAULT_PROMPTS = [
  {
    buttonText: 'Add test for this request',
    promptText: 'Add general tests for this request.',
    showOnEmpty: true,
  },
  {
    buttonText: 'Test for response',
    promptText:
      'Add tests for the response body, focus on the schema and business correctness of fields.',
  },
  {
    buttonText: 'Add more tests',
    promptText: 'Add more tests for this request.',
    showOnEmpty: false,
  },
];

type Prop = {
  onSelect: (prompt: DefaultPrompt) => void;
  disabled: boolean;
};

export function AIPromptsPreset(props: Prop) {
  const { onSelect, disabled } = props;
  const { store } = useArexRequestStore();

  const hasScript = (store.request.testScript?.trim().length ?? 0) > 0;
  const prompts = DEFAULT_PROMPTS.filter((p) => {
    if (hasScript) {
      return p.showOnEmpty !== true;
    } else {
      return p.showOnEmpty === true;
    }
  });

  return (
    <List
      size='small'
      style={{ marginTop: 16 }}
      bordered
      dataSource={prompts}
      renderItem={(item) => (
        <List.Item key={item.buttonText}>
          <Button
            disabled={disabled}
            type='text'
            block
            onClick={() => {
              onSelect(item);
            }}
          >
            {item.buttonText}
          </Button>
        </List.Item>
      )}
    />
  );
}

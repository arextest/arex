import { Button, List } from 'antd';
import { useState } from 'react';

export type DefaultPrompt = {
  buttonText: string;
  promptText?: string;
  children?: DefaultPrompt[];
};

export const DEFAULT_PROMPTS = [
  {
    buttonText: 'Test for response',
    children: [
      {
        buttonText: 'Status code is 200',
        promptText: 'Check if the response status code is 200',
      },
      {
        buttonText: 'Content Type',
        promptText: 'Check if the response has a Content-Type header',
      },
      {
        buttonText: 'Data Length',
        promptText: 'Check if the array fields of the response are not empty',
      },
      {
        buttonText: 'Response Time',
        promptText: 'Check if the response time is less than 500ms',
      },
      {
        buttonText: 'Response Schema',
        promptText: 'Check if the response schema is correct',
      }
    ],
  },
];

type Prop = {
  onSelect: (prompt: DefaultPrompt) => void;
  disabled: boolean;
};

export function RequestTestPrompts(props: Prop) {
  const { onSelect, disabled } = props;
  const [prompts, setPrompts] = useState<DefaultPrompt[]>(DEFAULT_PROMPTS);

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
              if ((item.children?.length ?? 0) > 0) {
                setPrompts(item.children ?? []);
              } else {
                setPrompts(DEFAULT_PROMPTS);
                onSelect(item);
              }
            }}
          >
            {item.buttonText}
          </Button>
        </List.Item>
      )}
    />
  );
}

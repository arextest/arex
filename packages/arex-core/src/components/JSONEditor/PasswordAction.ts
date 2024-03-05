import { type OnJSONSelect } from '@arextest/vanilla-jsoneditor';
import type { Action } from 'svelte/action';

export interface PasswordActionProps {
  value: string | number;
  path: string[];
  readOnly: boolean;
  onSelect: OnJSONSelect;
}

export const PasswordAction: Action<HTMLDivElement, Record<string, unknown>> = (
  node,
  initialProps,
) => {
  let props = toPasswordProps(initialProps);

  function updateResult() {
    node.innerText = '*'.repeat(String(props.value).length);
  }

  updateResult();

  return {
    update: (updatedProps) => {
      props = toPasswordProps(updatedProps);
      updateResult();
    },
    destroy: () => {},
  };
};

function toPasswordProps(props: Record<string, unknown>): PasswordActionProps {
  // you can add validations and typeGuards here if needed
  return props as unknown as PasswordActionProps;
}

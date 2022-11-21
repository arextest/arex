import { Updater } from 'use-immer';

export type FormItemProps<T> = { value?: T; onChange?: Updater<T> };

export { default as DurationInput } from './DurationInput';
export { default as DynamicClassesEditableTable } from './DynamicClassesEditableTable';
export { default as IntegerStepSlider } from './IntegerStepSlider';

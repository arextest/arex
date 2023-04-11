import { t } from 'i18next';

import { PanesType } from '../../constant';
import { ArexPane } from '../index';
import Environment, { EnvironmentPanesData } from './Environment';

const EnvironmentPanes: ArexPane<EnvironmentPanesData> = {
  get name() {
    return t('Environment');
  },
  type: PanesType.ENVIRONMENT,
  render: Environment,
};

export default EnvironmentPanes;
export type { EnvironmentPanesData };

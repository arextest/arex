import { PanesType } from '../../constant';
import { createPane } from '../index';
import Environment, { EnvironmentPanesData } from './Environment';

const EnvironmentPanes = createPane(Environment, PanesType.ENVIRONMENT);

export default EnvironmentPanes;
export type { EnvironmentPanesData };

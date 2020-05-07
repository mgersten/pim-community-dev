import {useDependenciesContext} from './useDependenciesContext';
import {Security} from '../provider';

const useSecurity = (): Security => {
  const {security} = useDependenciesContext();

  if (security) {
    return security;
  }

  throw new Error('[DependenciesContext]: Security has not been properly initiated');
};

export {useSecurity};

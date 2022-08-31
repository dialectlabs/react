import { useEffect } from 'react';
import usePrevious from './usePrevious';

const useEffectDebugger = (effectHook, dependencies, dependencyNames = []) => {
  const previousDeps = usePrevious(dependencies, []);

  const changedDeps = dependencies.reduce((accum, dependency, index) => {
    if (dependency !== previousDeps[index]) {
      const keyName = dependencyNames[index] || index;
      return {
        ...accum,
        [keyName]: {
          before: previousDeps[index],
          after: dependency,
        },
      };
    }

    return accum;
  }, {});

  if (Object.keys(changedDeps).length) {
    console.log(`[use-effect-debugger] ${effectHook?.name}`, changedDeps);
  }

  useEffect(effectHook, dependencies);
};

export default useEffectDebugger;

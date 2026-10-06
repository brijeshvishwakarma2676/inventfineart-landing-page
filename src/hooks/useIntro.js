import { useSyncExternalStore } from 'react';
import { intro } from '../utils/intro';

export function useIntro() {
  return useSyncExternalStore(intro.subscribe, intro.getSnapshot);
}

export default useIntro;

import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';

/** Longest screen slide; after it the content is shown even without a transition event. */
const MAX_TRANSITION_MS = 450;

/**
 * True once the screen finished sliding in. Heavy views (the real maps) wait for it so
 * the slide stays smooth instead of stuttering while they load.
 */
export function useAfterTransition(): boolean {
  const navigation = useNavigation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // the first screen of the app does not slide in, so a timer is the fallback
    const timer = setTimeout(() => setReady(true), MAX_TRANSITION_MS);
    const unsubscribe = navigation.addListener('transitionEnd' as never, () => setReady(true));
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [navigation]);

  return ready;
}

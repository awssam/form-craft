import { useEffect, useMemo } from 'react';

const getLocalStorageFeature = (featureKey: string) => {
  try {
    return JSON.parse(localStorage.getItem('features') || '{}')?.[featureKey];
  } catch {
    return false;
  }
};

const useFeatureAnnouncer = (featureName: string, enabled: boolean = true) => {
  const hasAnnouncedMoreThan3Times = useMemo(
    () => (enabled ? getLocalStorageFeature(featureName) > 3 : true),
    [featureName, enabled],
  );

  useEffect(() => {
    if (!hasAnnouncedMoreThan3Times && enabled) {
      const features = JSON.parse(localStorage.getItem('features') || '{}');
      features[featureName] = (features?.[featureName] || 0) + 1;
      localStorage.setItem('features', JSON.stringify(features));
    }
  }, [enabled, featureName, hasAnnouncedMoreThan3Times]);

  return hasAnnouncedMoreThan3Times;
};

export default useFeatureAnnouncer;

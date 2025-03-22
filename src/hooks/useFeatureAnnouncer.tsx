import { useEffect, useMemo } from 'react';

const getLocalStorageFeature = (featureKey: string) => {
  try {
    return JSON.parse(localStorage.getItem('features') || '{}')?.[featureKey];
  } catch {
    return false;
  }
};

const useFeatureAnnouncer = (featureName: string) => {
  const hasAnnouncedMoreThan3Times = useMemo(() => getLocalStorageFeature(featureName) > 3, [featureName]);

  useEffect(() => {
    if (!hasAnnouncedMoreThan3Times) {
      const features = JSON.parse(localStorage.getItem('features') || '{}');
      features[featureName] = (features?.[featureName] || 0) + 1;
      localStorage.setItem('features', JSON.stringify(features));
    }
  }, [featureName, hasAnnouncedMoreThan3Times]);

  return hasAnnouncedMoreThan3Times;
};

export default useFeatureAnnouncer;

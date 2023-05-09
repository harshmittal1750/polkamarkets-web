import environment from './environment';

function toBoolean(value: string | undefined): boolean {
  return value?.toLocaleLowerCase() === 'true';
}

const features = {
  regular: {
    enabled: !toBoolean(environment.FEATURE_FANTASY)
  },
  fantasy: {
    enabled: toBoolean(environment.FEATURE_FANTASY)
  },
  voting: {
    enabled: toBoolean(environment.FEATURE_VOTING)
  },
  alert: {
    enabled: toBoolean(environment.FEATURE_ALERT)
  },
  news: {
    enabled: toBoolean(environment.FEATURE_NEWS)
  },
  clubs: {
    enabled: toBoolean(environment.FEATURE_CLUBS)
  },
  achievements: {
    enabled: toBoolean(environment.FEATURE_ACHIEVEMENTS)
  }
} as const;

export default features;

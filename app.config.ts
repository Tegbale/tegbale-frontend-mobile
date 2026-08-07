import { ConfigContext, ExpoConfig } from 'expo/config';

type Variant = 'development' | 'staging' | 'production';

const variant = (process.env.APP_VARIANT ?? 'production') as Variant;

const variants: Record<Variant, { name: string; androidPackage: string; iosBundleId: string }> = {
  development: {
    name: 'Tègbalé (Dev)',
    androidPackage: 'com.tegbale.mobile.dev',
    iosBundleId: 'com.tegbale.mobile.dev',
  },
  staging: {
    name: 'Tègbalé (Staging)',
    androidPackage: 'com.tegbale.mobile.staging',
    iosBundleId: 'com.tegbale.mobile.staging',
  },
  production: {
    name: 'Tègbalé',
    androidPackage: 'com.tegbale.mobile',
    iosBundleId: 'com.tegbale.mobile',
  },
};

const env = variants[variant];

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: env.name,
  android: {
    ...config.android,
    package: env.androidPackage,
  },
  ios: {
    ...config.ios,
    bundleIdentifier: env.iosBundleId,
  },
});

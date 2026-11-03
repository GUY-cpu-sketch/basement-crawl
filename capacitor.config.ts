import type { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'com.basementcrawl.game',
  appName: 'Basement Crawl',
  webDir: '.',
  bundledWebRuntime: false,
  ios: { contentInset: 'automatic' }
};
export default config;

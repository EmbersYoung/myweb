declare module 'next-pwa' {
  import { NextConfig } from 'next';
  
  interface PWAConfig {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    buildExcludes?: RegExp[];
    cacheStartUrl?: boolean;
    dynamicStartUrl?: boolean;
    dynamicStartUrlRedirect?: string;
    swSrc?: string;
    swDest?: string;
    publicPath?: string;
    runtimeCaching?: any[];
    workboxOptions?: Record<string, any>;
    subdomain?: string;
  }
  
  function withPWAInit(config?: PWAConfig): (nextConfig: NextConfig) => NextConfig;
  
  export default withPWAInit;
}
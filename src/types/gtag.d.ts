/* eslint-disable @typescript-eslint/no-explicit-any */
declare function gtag(...args: any[]): void;

interface Window {
  gtag: typeof gtag;
  dataLayer: any[];
}

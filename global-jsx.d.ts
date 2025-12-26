/// <reference types="react" />
// Broad JSX intrinsic element typing to avoid numerous three/fiber TS errors in the short term
// This makes all unknown JSX tags accept any props. Consider refining these types later.

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};

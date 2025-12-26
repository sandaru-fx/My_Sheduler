/* Global type augmentations for Three.js and browser features used in the project */

// Allow importing certain three example modules without type errors
declare module 'three/examples/jsm/controls/OrbitControls' {
  import { Camera, EventDispatcher } from 'three';
  export class OrbitControls extends EventDispatcher {
    constructor(object: Camera, domElement?: HTMLElement);
    update(): void;
    dispose(): void;
  }
  export default OrbitControls;
}

declare module 'three/examples/jsm/loaders/GLTFLoader' {
  const GLTFLoader: any;
  export default GLTFLoader;
}

declare module 'three/examples/jsm/controls/*';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Basic Three.js JSX elements used by @react-three/fiber scenes
      mesh: any;
      instancedMesh: any;
      ambientLight: any;
      pointLight: any;
      directionalLight: any;
      hemisphereLight: any;
      octahedronGeometry: any;
      icosahedronGeometry: any;
      dodecahedronGeometry: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      meshPhongMaterial: any;
      meshBasicMaterial: any;
      meshToonMaterial: any;
      fog: any;
      color: any;
      // Drei / fiber components (fallbacks)
      Stars: any;
      Cloud: any;
    }
  }

  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

export {};
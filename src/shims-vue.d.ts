declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>;
  export default component
}

declare module '*.js' {
  const value: any;
  export default value;
}

declare module "*.json"

declare module 'vue3-json-viewer'

declare module 'vuedraggable'

declare module 'vue3-clipboard'

declare module 'vue3-flight-event-bus'

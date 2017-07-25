/* SystemJS module definition */
declare var module: NodeModule;
declare var _: any;

interface NodeModule {
  id: string;
}

declare namespace L.control {
  export function polylineMeasure(options?: any): any;
}

declare namespace L {
  export function featureGroup(layers?: Layer[], options?: any): FeatureGroup;
}

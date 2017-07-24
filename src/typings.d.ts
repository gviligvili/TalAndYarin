/* SystemJS module definition */
declare var module: NodeModule;
declare var _:any;
declare var $:any;

interface NodeModule {
  id: string;
}

declare namespace L.control {
    export function polylineMeasure(options?: any): any;
}

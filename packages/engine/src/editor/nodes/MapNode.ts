import { Object3D, BoxBufferGeometry, Material } from "three";
import EditorNodeMixin from "./EditorNodeMixin";
export default class MapNode extends EditorNodeMixin(Object3D) {
  static legacyComponentName = "map";
  static nodeName = "Map";
  static _geometry = new BoxBufferGeometry();
  static _material = new Material();
  static async deserialize(editor, json) {
    console.log("Deserializing The MapNode");
    const node = await super.deserialize(editor, json);
    const {
      isGlobal,
      // style,
      // useTimeOfDay,
      // useDirectionalShadows,
      useStartCoordinates,
      startLatitude,
      startLongitude
    } = json.components.find(c => c.name === "map").props;
    node.isGlobal = isGlobal;
    // node.style = style;
    // node.useTimeOfDay = useTimeOfDay;
    // node.useDirectionalShadows = useDirectionalShadows;
    node.useStartCoordinates = useStartCoordinates;
    node.startLatitude = startLatitude;
    node.startLongitude = startLongitude;

    return node;
  }
  constructor(editor) {
    super(editor);

    





  }
  copy(source, recursive = true) {
    super.copy(source, recursive);
    return this;
  }
  serialize() {
    const components = {
      "game": {
        id: this.id,
        isGlobal: this.isGlobal,
        // style: this.style,
        // useTimeOfDay: this.useTimeOfDay,
        // useDirectionalShadows: this.useDirectionalShadows,
        useStartCoordinates: this.useStartCoordinates,
        startLatitude: this.startLatitude,
        startLongitude: this.startLatitude
      }
    } as any;
    return super.serialize(components);
  }
  prepareForExport() {
    super.prepareForExport();
  }
}

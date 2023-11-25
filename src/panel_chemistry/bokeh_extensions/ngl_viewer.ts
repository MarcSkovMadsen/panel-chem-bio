import * as p from "@bokehjs/core/properties"
import {uuidv4, HTMLBox, HTMLBoxView} from "./layout"
import {div} from "@bokehjs/core/dom"

declare namespace NGL {
  class AtomProxy{

  }
  class Blob{
    constructor(list: Array<String>, ob: object)
  }
  class Colormaker{
    atomColor: (atom: AtomProxy) => string
  }

  class ColormakerRegistry{
    static addScheme(scheme: () => void) : String
    static addSelectionScheme(dataList: Array<Array<String>>, label: String): String
  }

  class Component{
    removeAllRepresentations(): void
    addRepresentation(type: String, params?: object) : RepresentationComponent
    reprList: RepresentationElement[]
  }

  class Matrix4{
    elements: Array<Number>
  }

  class RepresentationComponent{
  }

  class RepresentationElement{
    setParameters(params: any): this
    getParameters(): object
  }

  class Stage {
    compList: Array<Component>
    viewerControls: ViewerControls
    constructor(elementId: String, params?: object)
    loadFile(s: String| Blob, params?: object):  Promise<StructureComponent>
    autoView() : void
    setSpin(flag: Boolean): void
    removeAllComponents(type: String): void
    addRepresentation(representation: String): void
    handleResize(): void
  }

  class ScriptComponent{
    constructor(stage: Stage, params?: object)
    addRepresentation(type: String, params?: object) : RepresentationComponent
    autoView() : void
    removeAllRepresentations(): void
    reprList: RepresentationElement[]
  }

  class StructureComponent{
    constructor(stage: Stage, params?: object)
    addRepresentation(type: String, params?: object) : RepresentationComponent
    autoView() : void
    removeAllRepresentations(): void
    reprList: RepresentationElement[]
  }

  class SurfaceComponent{
    constructor(stage: Stage, params?: object)
    addRepresentation(type: String, params?: object) : RepresentationComponent
    autoView() : void
    removeAllRepresentations(): void
    reprList: RepresentationElement[]
  }



  class Vector3{
    x: number
    y: number
    z: number
  }

  class ViewerControls {
        position: Vector3
        Orientation: Matrix4
    }
}
export class NGLViewerView extends HTMLBoxView {
    model: NGLViewer
    container: HTMLDivElement;
    _intialized: boolean = false
    _stage: any

    initialize(): void {
      super.initialize()
      this.container = div({
          class: "ngl-viewer",
          id: "ngl-viewer-" + uuidv4(),
          style: {width: "100%", height: "100%"}
        })
      }

    connect_signals(): void {
      super.connect_signals()
      this.connect(this.model.properties.object.change, this.updateStage)
      this.connect(this.model.properties.extension.change, this.updateStage)
      this.connect(this.model.properties.representation.change, this.updateStage)
      this.connect(this.model.properties.color_scheme.change, this.updateParameters)
      this.connect(this.model.properties.custom_color_scheme.change, this.updateParameters)
      this.connect(this.model.properties.effect.change, this.updateEffect)
      this.connect(this.model.properties.background_color.change, this.setBackgroundcolor)
    }

    render(): void {
        super.render()
        this._intialized = false
        this.createNGLViewer()
    }
    setBackgroundcolor(): void {
      this._stage.setParameters( { backgroundColor: this.model.background_color} );
    }
    createNGLViewer(){
        if (this._intialized)
          return

        document.body.appendChild(this.container)
        
        const wn = (window as any)
        const ngl = wn.NGL
        
        this._stage = new ngl.Stage(this.container.id);
        this.setBackgroundcolor()
        const stage = this._stage
        this.updateStage();
        window.addEventListener( "resize", function(){
            stage.handleResize();
        }, false );

        // Remove from document body and add to shadow DOM
        document.body.removeChild(this.container)
        this.shadow_el.appendChild(this.container)

        this._intialized = true
    }
    after_layout(): void {
      super.after_layout()
      this._stage.handleResize();
    }
    updateEffect(){
      if (this.model.effect==="spin"){
        this._stage.setSpin(true);
      } else if (this.model.effect==="rock"){
        this._stage.setRock(true);
      } else {
        this._stage.setSpin(false);
        this._stage.setRock(false);
      }

    }
    getParameters(){
      if (this.model.color_scheme==="custom"){
        var list: Array<Array<String>> = this.model.custom_color_scheme;
        var scheme = NGL.ColormakerRegistry.addSelectionScheme(list, "new scheme");
        return { color: scheme }
      } else {
        return {colorScheme: this.model.color_scheme}
      }
    }
    updateParameters(){
      const parameters = this.getParameters()
      try {
        this._stage.compList[0].reprList[0].setParameters( parameters );
      } catch (e) {
        console.log(e)
      }
    }
    updateStage(){
      const model = this.model;
      this._stage.removeAllComponents()
      if (model.object===""){return}

      const parameters = this.getParameters()
      function finish(o: any){
        o.addRepresentation(model.representation, parameters);
        o.autoView();
      }

      if (model.extension!==""){
        this._stage.loadFile(new Blob([model.object], {type: 'text/plain'}), { ext: model.extension}).then(finish)
      } else if (model.object.includes("://")){
        this._stage.loadFile(model.object).then(finish)
      } else {
        this._stage.loadFile("rcsb://" + model.object).then(finish)
      }
      // this.updateColor()
      this.updateEffect()
    }
}

export namespace NGLViewer {
    export type Attrs = p.AttrsOf<Props>
    export type Props = HTMLBox.Props & {
        object: p.Property<string>,
        background_color: p.Property<string>,
        extension: p.Property<string>,
        representation: p.Property<string>,
        color_scheme: p.Property<string>,
        custom_color_scheme: p.Property<any>,
        effect: p.Property<string>,
    }
}

export interface NGLViewer extends NGLViewer.Attrs { }
export class NGLViewer extends HTMLBox {
    properties: NGLViewer.Props
    __view_type__: NGLViewerView

    constructor(attrs?: Partial<NGLViewer.Attrs>) {
      super(attrs)
    }

    static __module__ = "panel_chemistry.bokeh_extensions.ngl_viewer"

    static {
      this.prototype.default_view = NGLViewerView;

      this.define<NGLViewer.Props>(({ String, Any }) => ({
        object:             [ String, ""],
        extension:             [ String, ""],
        background_color:             [ String, ""],
        representation:              [ String, "ball+stick"],
        color_scheme:               [ String, "element"],
        custom_color_scheme:               [ Any, ["white", "*"]],
        effect:               [ String, ""],
      }))

      this.override<NGLViewer.Props>({
        height: 400,
        width: 600
      });
    }
  }
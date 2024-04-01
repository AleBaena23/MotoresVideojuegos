import * as THREE from 'three';

export default class Renderer {
    constructor(luisito) {
        this.scene = luisito.scene;
        this.camera = luisito.camera;
        this.window = luisito.window;
        
        this.instance = new THREE.WebGLRenderer()
        document.body.appendChild(this.instance.domElement)

        this.instance.setSize(
            this.window.width,
            this.window.height
        )
        this.instance.setPixelRatio(this.window.pixelRatio)
    }

    resize(){
        this.instance.setSize(
            this.window.width,
            this.window.height
        )
        this.instance.setPixelRatio(this.window.pixelRatio)
    }
    frame(){
        this.instance.render(
            this.scene,
            this.camera.instance
        )
    }
}

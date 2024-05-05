import * as THREE from 'three';

// Se podría implementar un booleano para decidir si el renderer tiene sombras de forma predeterminada.

export default class Renderer {
    constructor(luisito) {
        this.scene = luisito.scene;
        this.camera = luisito.camera;
        this.window = luisito.window;
        
        this.instance = new THREE.WebGLRenderer({antialias: true})
        this.instance.shadowMap.enabled = true
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

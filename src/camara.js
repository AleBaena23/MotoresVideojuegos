import * as THREE from 'three'

export default class Camera{

    constructor(luisito){

        this.window = luisito.window
        this.scene = luisito.scene

        this.instance = new THREE.PerspectiveCamera(   
            45, this.window.width / this.window.height, 1, 1000 
        )

        this.instance.position.set(0,0,0)
        this.scene.add(this.instance)
    }

    resize(){
        this.instance.aspect = this.window.aspectRatio
        this.instance.updateProjectionMatrix()
    }
}
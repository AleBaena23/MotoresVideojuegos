import * as THREE from 'three'

export default class Camera{

    constructor(luisito){

        this.window = luisito.window
        this.scene = luisito.scene

        this.instance = new THREE.OrthographicCamera(   
            -this.window.width,this.window.width,
            this.window.height,-this.window.height
        )

        this.instance.position.set(0,0,125)
        this.scene.add(this.instance)
    }

    resize(){
        this.instance.aspect = this.window.aspectRatio
        this.instance.updateProjectionMatrix()
    }
}
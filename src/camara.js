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

    /* Método para crear una cámara de perspectiva personalizada (WORK IN PROGRESS)
    createPerspectiveCamera(fov, aspect, nearFrustrum, farFrustrum){
        
        const camera = new THREE.PerspectiveCamera(   
            fov, aspect, nearFrustrum, farFrustrum 
        )

        camera.position.set(0,0,0)
        this.scene.add(camera)
        return camera
    }
    */

    /* Método para crear una cámara ortográfica personalizada (WORK IN PROGRESS)
    createOrthographicCamera(leftFrustrum, rightFrustrum, topFrustrum, bottomFrustrum, nearFrustrum, farFrustrum){
        
        const camera = new THREE.OrthographicCamera( 
            leftFrustrum, rightFrustrum, topFrustrum, bottomFrustrum, nearFrustrum, farFrustrum 
        );

        camera.position.set(0,0,0)
        this.scene.add(camera)
        return camera
    }
    */

    resize(){
        this.instance.aspect = this.window.aspectRatio
        this.instance.updateProjectionMatrix()
    }
}
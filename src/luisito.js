//Imports

import Input from './inputs';
import Window from './window';
import Renderer from './rendering';
import Camera from './camara'
import Mesh from './mesh'
import * as THREE from 'three'
    
    
class Luisito{
    constructor(){

        //Game loop
        this.startTime = Date.now()
        this.lastFrameTime = this.startTime
        this.dt = 1/60
        this.totalElapsed = 0
        this.totalElapsedInSeconds = 0

        //HERRAMIENTAS QUE AÑADIMOS NOSOTROS
        this.window = new Window(this);
        this.scene = new THREE.Scene();
        this.camera = new Camera(this)
        
        this.renderer = new Renderer(this);
        this.input = new Input(this);

        this.mesh = new Mesh(this);
        
        console.log("Window initialized:", this.window); // Agregar esta línea
        
        

        this.window.addEventListener('resize', (e) => {this.resize(e)})
        
        //El metodo update

        this.update = () => {};

       
    }

    resize(e){
        this.camera.resize()
        this.renderer.resize()
    }

start(){
    this.isRunning = true

    this.frame()
}

frame(){

    window.requestAnimationFrame(() => {this.frame()})

    const now = Date.now()
    this.dt = (now-this.lastFrameTime) / 1000
    this.totalElapsed = this.lastFrameTime-this.startTime
    this.totalElapsedInSeconds = this.totalElapsed/1000

    // Llamar a la función de actualización
    this.update(this.dt);
    
    // Renderizar la escena
    this.renderer.frame();

}
}

export {Luisito as default}

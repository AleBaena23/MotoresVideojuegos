//Imports
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Logger from './logger';
import Input from './inputs';
import Window from './window';
import Renderer from './rendering';
import Camera from './camara';
import Mesh from './mesh';
import Light from './lights';
import Physics from './physics';
import AssetManager from './assetManager';

    
    
class Luisito{
    constructor(){

        //Game loop
        this.startTime = Date.now()
        this.lastFrameTime = this.startTime
        this.dt = 1/60
        this.totalElapsed = 0
        this.totalElapsedInSeconds = 0

        //HERRAMIENTAS QUE AÑADIMOS NOSOTROS
        this.input = new Input(this);
        
        this.scene = new THREE.Scene();
        this.window = new Window(this);
        this.logger = new Logger(this);
        
  
        this.camera = new Camera(this);
        
        this.renderer = new Renderer(this);
        this.light = new Light(this);
        

        this.objects = []

        this.mesh = new Mesh(this)
        this.world = new CANNON.World()
        this.assets = new AssetManager(this, this.scene);
        this.physics = new Physics(this);
       
        this.logger.info("Pidiendo a Luisito que baje al portal");
        this.logger.info("Luisito abre la puerta, MOTOR INICIALIZADO");
        this.logger.info("Window initialized:", this.window); // Agregar esta línea
        
        this.window.addEventListener('resize', (e) => {this.resize(e)})

        this.assets.addEventListener('ready', (e) => {
            this.logger.info("Successfully loaded " + e.totalAssets + " assets.")
            this.onAssetsLoaded(e)
        })
    
        this.onAssetsLoaded = (e) => {
            console.log("Se ha cargado")
    
        }
        
        //El metodo update

        this.update = () => {};
        
    }

    createObject() {
        let object = new THREE.Object3D();
        this.logger.info('Created object ' + object.name + ' #' + object.id);
        this.objects.push(object);
        return object;
    }

    getObjects() {
        return this.objects
    }
    addObject(object){
        this.objects.push(object);
        return this.objects

    }

    getObjectById(id){
        return this.objects.find(
            object => object.id == id
        )}

    addComponentToObject(object, componentName, data){
        data.objectID = object.id
        object[componentName] = data
    }
    removeObject(object) {
        const index = this.objects.indexOf(object);
        if (index !== -1) {
            this.objects.splice(index, 1);
            
            this.scene.remove(object);
            if (object.rigidbody) {
                this.world.removeBody(object.rigidbody);
            }
        }
    }
    
    
    

    resize(e){
        this.camera.resize()
        this.renderer.resize()
    }
        // Dentro de la clase Luisito
    updateMeshPositions() {
        for (const object of this.objects) {
            if (object.mesh && object.position) {
                object.mesh.position.copy(object.position);
                object.mesh.rotation.copy(object.rotation)
            }
        }
    }


start(){
    this.isRunning = true

    this.frame()
}

frame(){

    window.requestAnimationFrame(() => {this.frame()})

    if (this.isRunning){

        const now = Date.now()
        this.dt = (now-this.lastFrameTime) / 1000
        this.lastFrameTime = now
        this.totalElapsed = this.lastFrameTime - this.startTime
        this.totalElapsedInSeconds = this.totalElapsed/1000

        // Llamar a la función de actualización
        this.update(this.dt);

        //Añadir cambios de posicion y rotacion (nota, se actualiza el debugger antes de todo para que las mallas no se desvinculen)
        //this.physics.cannonDebugger.update()

        for(const object of this.objects){

            if(object.rigidbody){
                object.rigidbody.position.copy(object.position)
                object.rigidbody.quaternion.copy(object.quaternion)
            }
        }
        this.updateMeshPositions();

        //Actualizar las fisicas
        
        this.physics.Update(this.dt, this.objects)
        


    }
    this.resize()
    // Renderizar la escena
    this.camera.resize()
    this.renderer.frame();
}
}

export {Luisito as default}

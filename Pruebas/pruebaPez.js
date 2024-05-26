import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import gsap from 'gsap';
import Luisito from '/src/luisito.js';
import sources from './pruebaSources.js';

const luisito = new Luisito();
luisito.camera.instance.position.set(0, 0, 20);
const world = luisito.physics.world;

// Configurar la gravedad (1.61 default)
world.gravity.set(0, 0, 0);

const ambientLight = luisito.light.CreateAmbient("white", 1);
const directionalLight = luisito.light.CreateDirectional("white", 1);
directionalLight.position.set(5, 3, 3);
// Creamos un suelo para la simulación
const floor = luisito.createObject("floor")

luisito.addComponentToObject(
    floor,
    'mesh',
    luisito.mesh.CreateFromGeometry(
        new THREE.PlaneGeometry(100,100),
        new THREE.MeshStandardMaterial({color:'blue'})
    )
)
floor.position.set(0,0,-10)
let pezModel = null;
let mixer = null;
let action = null;

luisito.assets.loadAssets([
    // Modelos
    {
        name: 'Pez',
        type: 'gltfModel',
        path: 'static/models/Pez/Pez2.glb'
    }
]);
const cubeHalfExtents  = new CANNON.Vec3(1,1,1)
let pezContainer = luisito.createObject(); // Asignar el objeto a pezContainer


luisito.onAssetsLoaded = (e) => {
    pezModel = luisito.assets.get('Pez').scene;
    pezModel.scale.set(3, 3, 3);
    pezModel.position.set(0, -1, 0);
    pezModel.rotateY(0);
    // Utiliza uno de los objetos de la escena como contenedor
    pezContainer.add(pezModel);
    luisito.scene.add(pezContainer);
    //ESTO ES CLAVE, PORQUE DE ESTA FORMA SE LE PUEDE AÑADIR RIGIDBODY AL MODELO
    mixer = new THREE.AnimationMixer(luisito.assets.get('Pez').scene);
    action = mixer.clipAction(luisito.assets.get('Pez').animations[0]);
    console.log(action);
    luisito.addComponentToObject(
        pezContainer,
        'rigidbody',
        luisito.physics.CreateBody({
            mass: 1,
            angularDamping: 0.96,
            shape: new CANNON.Box(cubeHalfExtents),
            
        })
    );
};





const limite = 18;
let currentPosition = -limite; // Iniciar en el límite inferior
let direction = 1; // 1 para moverse hacia adelante, -1 para moverse hacia atrás

const duracion = 3;
let delay = 1; // Retraso entre cada animación

luisito.update = (dt) => {
    const input = luisito.input;

    

    
    if (pezContainer) {
        mixer.update(dt)
        action.play()
        //Animacion con KEYFRAMES
        // if (pezContainer.position != null) {
        //     // Moverse hacia adelante
        //     if (direction === 1) {
        //         action.play()
        //         gsap.to(pezContainer.rotation, { duration: 0.5, delay: 0, y: +Math.PI/2 });//Gira al final
        //         gsap.to(pezContainer.position, { 
        //             duration: duracion, 
        //             delay: delay, // Añade el retraso constante entre cada animación
        //             x: limite, // Cambia el destino a 'limite'
                    
        //             onComplete: () => { 
        //                 action.play()
        //                 // Cambiar dirección y moverse hacia atrás
        //                 gsap.to(pezContainer.rotation, { duration: 0.5, delay: 0, y: -Math.PI/2 });//Gira al final
        //                 direction = -1;
        //                 gsap.to(pezContainer.position, { 
        //                     duration: duracion, 
        //                     delay: delay, // Añade el retraso constante entre cada animación
        //                     x: -limite, // Esto es que llega a la posicion x = 0 y se activa la siguienta animacion
                            
        //                 });
        //             }
        //         });
        //     } 
        //     // Moverse hacia atrás
        //     else {
        //         action.play()
        //         gsap.to(pezContainer.position, { 
        //             duration: duracion, 
        //             delay: delay, // Añade el retraso constante entre cada animación
        //             x: -limite, // Cambia el destino a '-limite'
                    
        //             onComplete: () => { 
        //                 action.play()
        //                 // Cambiar dirección y moverse hacia adelante
        //                 direction = 1;
        //                 gsap.to(pezContainer.position, { 
        //                     duration: duracion, 
        //                     delay: delay, // Añade el retraso constante entre cada animación
        //                     x: limite, // Esto es que llega a la posicion x = 0 y se activa la siguienta animacion
                            
        //                 });
        //             }
        //         });
        //     }
        // }

        //Animacion teclado
        if (pezContainer && pezContainer.rigidbody) {
            if (input.isKeyPressed('ArrowLeft')) {
                pezContainer.rigidbody.velocity.x -= 0.1;
                if(pezContainer.rotation.y != -Math.PI/2)
                pezContainer.rotateY(-Math.PI/2)
            }
            if (input.isKeyPressed('ArrowRight')) {
                pezContainer.rigidbody.velocity.x += 0.1;
                if(pezContainer.rotation.y != +Math.PI/2)
                    pezContainer.rotateY(+Math.PI/2)
            }
            const dragForce = luisito.physics.GenerateDrag(0.2, pezContainer.rigidbody.velocity);
            pezContainer.rigidbody.applyForce(dragForce);
            
        }
        
        // pezContainer.rotateY(dt)
    }
};

luisito.start();

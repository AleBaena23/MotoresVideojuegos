import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import gsap from 'gsap'; //para poder hacer keyframes
import Luisito from '/src/luisito.js';
import sources from './pruebaSources.js';


//ESTA PARTE ES EL SETUP, EN TODOS LOS EJERCICIOS ES CASI IGUAL

//--------------------------------------------------------
const luisito = new Luisito();
luisito.camera.instance.position.set(0, 0, 20);
const world = luisito.physics.world; //crea un nuevo mundo de fisicas

// Configurar la gravedad a 0
world.gravity.set(0, 0, 0);

const ambientLight = luisito.light.CreateAmbient("white", 1);
const directionalLight = luisito.light.CreateDirectional("white", 1);
directionalLight.position.set(5, 3, 3);
// Creamos un objeto suelo para la simulación
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

//--------------------------------------------------------

//ESTA PARTE ES PARA IMPORTAR EL MODELO Y METERLO EN UN CONTENEDOR VACIO, PARA QUE EL MOTOR LO IDENTIFIQUE COMO UN OBJETO Y SE LE PUEDAN ASOCIAR LOS COMPONENTES
//----------------------------------------------------------------------------------------------------------------------------
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
    // Utiliza el objeto pezcontainer de la escena como contenedor
    pezContainer.add(pezModel);
    luisito.scene.add(pezContainer);

    //ESTO ES CLAVE, PORQUE DE ESTA FORMA SE LE PUEDE AÑADIR RIGIDBODY AL MODELO
    
    mixer = new THREE.AnimationMixer(luisito.assets.get('Pez').scene);
    //permite que la animacion se vea por pantalla
    action = mixer.clipAction(luisito.assets.get('Pez').animations[0]);
    //esta es la animacion que ha hecho Fernando
    console.log(action);
    luisito.addComponentToObject(
        pezContainer,
        'rigidbody', //para las fisicas
        luisito.physics.CreateBody({
            mass: 1,
            angularDamping: 0.96,
            shape: new CANNON.Box(cubeHalfExtents),
            
        })
    );
};

//-------------------------------------------------------------------------------------------------------




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

        //PRIMERA PARTE DEL TRABAJO, HACER CTRL+K+C HASTA LA SIGUIENTE CADENA DE ---------
        //----------------------------------------------------------

       // Animacion con KEYFRAMES
        //esto lo mueve para la derecha primero y cuando llega al limite vuelve para atras y ademas añade una rotacion al pez si no giraria de espaldas
        if (pezContainer.position != null) {
            // Moverse hacia adelante
            if (direction === 1) {
                action.play()
                gsap.to(pezContainer.rotation, { duration: 0.5, delay: 0, y: +Math.PI/2 });//Gira al final
                gsap.to(pezContainer.position, { 
                    duration: duracion, 
                    delay: delay, // Añade el retraso constante entre cada animación
                    x: limite, // Cambia el destino a 'limite'
                    
                    onComplete: () => { 
                        action.play()
                        // Cambiar dirección y moverse hacia atrás
                        gsap.to(pezContainer.rotation, { duration: 0.5, delay: 0, y: -Math.PI/2 });//Gira al final
                        direction = -1;
                        gsap.to(pezContainer.position, { 
                            duration: duracion, 
                            delay: delay, // Añade el retraso constante entre cada animación
                            x: -limite, // Esto es que llega a la posicion x = 0 y se activa la siguienta animacion
                            
                        });
                    }
                });
            } 
            // Moverse hacia atrás
            else {
                action.play()
                gsap.to(pezContainer.position, { 
                    duration: duracion, 
                    delay: delay, // Añade el retraso constante entre cada animación
                    x: -limite, // Cambia el destino a '-limite'
                    
                    onComplete: () => { 
                        action.play()
                        // Cambiar dirección y moverse hacia adelante
                        direction = 1;
                        gsap.to(pezContainer.position, { 
                            duration: duracion, 
                            delay: delay, // Añade el retraso constante entre cada animación
                            x: limite, // Esto es que llega a la posicion x = 0 y se activa la siguienta animacion
                            
                        });
                    }
                });
            }
        }
        //----------------------------------------------------------------------------------------------------------

        //SEGUNDA PARTE DEL TRABAJO, HACER CTRL+K+U HASTA LA SIGUIENTE CADENA DE ---------

        //----------------------------------------------------

        // //Animacion teclado
        // if (pezContainer && pezContainer.rigidbody) {
        //     if (input.isKeyPressed('ArrowLeft')) {
        //         pezContainer.rigidbody.velocity.x -= 0.1;
        //        // cuanto mas dejemos presionado la flecha mas rapido va
        //         if(pezContainer.rotation.y != -Math.PI/2)
        //         pezContainer.rotateY(-Math.PI/2)
        //     }
        //     if (input.isKeyPressed('ArrowRight')) {
        //         pezContainer.rigidbody.velocity.x += 0.1;
        //         if(pezContainer.rotation.y != +Math.PI/2)
        //             pezContainer.rotateY(+Math.PI/2)
        //     }
        //     const dragForce = luisito.physics.GenerateDrag(0.2, pezContainer.rigidbody.velocity);
        //     pezContainer.rigidbody.applyForce(dragForce);
        //    // esto es lo que hace que el pez frene 
            
        // }

         //-------------------------------------------------------------------------------
         
        // Con CTRL+K+C lo comento
        // Con CTRL+K+U lo descomento
    }
};

luisito.start();

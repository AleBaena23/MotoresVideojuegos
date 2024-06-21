import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import gsap from 'gsap'; // para animaciones
import Luisito from '/src/luisito.js';

//SETUP//

//------------------------------------------------------------

const luisito = new Luisito();
luisito.camera.instance.position.set(0, 0, 20);

const world = luisito.physics.world;
world.gravity.set(0, -8, 0);

const ambientLight = luisito.light.CreateAmbient("white", 2);
const directionalLight = luisito.light.CreateDirectional("white", 1);
directionalLight.position.set(5, 3, 3);

const floor = luisito.createObject("floor");
luisito.addComponentToObject(
    floor,
    'mesh',
    luisito.mesh.CreateFromGeometry(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshStandardMaterial({ color: 'blue' })
    )
);
floor.position.set(0, 0, -10);

//--------------------------------------------------------------------------------------------

//MATERIALES PARA FÍSICA

//--------------------------------------------------------------------------------------------

const playerMaterial = new CANNON.Material('playerM');
const enemyMaterial = new CANNON.Material('enemyM');


const enemyMplayerMContactMaterial = new CANNON.ContactMaterial(
    playerMaterial,
    enemyMaterial,
    {
        friction: 0,
        restitution: 0
    }
);
luisito.physics.world.addContactMaterial(enemyMplayerMContactMaterial);
//--------------------------------------------------------------------------------------------

//MODELOS, CARGAR Y CREAR OBJETOS


const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const audioLoader = new THREE.AudioLoader();

loadingManager.onStart = () => {
    console.log('Loading started');
};
loadingManager.onLoad = () => {
    console.log('Loading finished');
};

const texturePaths = [
    '/static/textures/Fondos/fondos/fondo 7.png',
    '/static/textures/Fondos/fondos2/fondonuevo2.png',
    '/static/textures/Fondos/fondos2/fondonuevo1.png',
    '/static/textures/Fondos/fondos/fondo 5.png',
    '/static/textures/Fondos/fondos2/fondonuevo4.png',
    '/static/textures/Fondos/fondos2/fondonuevo3.png'
    
];

const textures = texturePaths.map(path => textureLoader.load(path));



let pezModel = null;
let coinModel = null;
let coralModel1 = null;
let coralModel2 = null;
let coralModel3 = null;
let escudoModel = null;
let rayoModel = null;
let mixer = null;
let action = null;

// Sonidos
const sonido_fondo = luisito.audio.createSound()
const sonido_burbuja = luisito.audio.createSound()
const sonido_moneda = luisito.audio.createSound()
const sonido_escudo = luisito.audio.createSound()
const sonido_rayo = luisito.audio.createSound()
const sonido_perder = luisito.audio.createSound()

luisito.assets.loadAssets([
    // Modelos
    {
        name: 'Pez',
        type: 'gltfModel',
        path: 'static/models/Pez/Pez2.glb'
    },

    {
        name: 'Coin',
        type: 'gltfModel',
        path: 'static/models/Coin/moneda.glb'
    },

    {
        name: 'Coral1',
        type: 'gltfModel',
        path: 'static/models/Corales/Coral1_morado.glb'
    },
    {
        name: 'Coral2',
        type: 'gltfModel',
        path: 'static/models/Corales/Coral2_verde.glb'
    },
    {
        name: 'Coral3',
        type: 'gltfModel',
        path: 'static/models/Corales/Coral3_rojo.glb'
    },
    {
        name: 'Escudo',
        type: 'gltfModel',
        path: 'static/models/PowerUps/escudo1.glb'
    },
    {
        name: 'Rayo',
        type: 'gltfModel',
        path: 'static/models/PowerUps/rayo.glb'
    }




]);

const cubeHalfExtents = new CANNON.Vec3(0.5,0.5,0.5);

const coinSides = new CANNON.Vec3(0.75, 0.75, 0.75);


let player = luisito.createObject();
player.position.set(-10, 0, 0);

let coin = luisito.createObject();
coin.position.set(0, 0, 0);

let coins = []; // Array para almacenar las monedas

let escudos = [];

let rayos = [];

// Esfera azul translúcida
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshPhongMaterial({
    color: 0x0000ff,   // Color azul
    transparent: true,
    opacity: 0.3       // Opacidad para hacerla translúcida
});
const sphereEscudo = new THREE.Mesh(geometry, material);


//Esfera amarilla translucida

// Esfera azul translúcida
const geometry1 = new THREE.SphereGeometry(1, 32, 32);
const material1 = new THREE.MeshPhongMaterial({
    color: 0xffff00,   // Color amarillo
    transparent: true,
    opacity: 0.3       // Opacidad para hacerla translúcida
});
const sphereRayo = new THREE.Mesh(geometry1, material1);

luisito.onAssetsLoaded = () => {

    //MODELO PEZ QUE SERÁ EL PLAYER
    pezModel = luisito.assets.get('Pez').scene;
    pezModel.scale.set(1, 1, 1);
    pezModel.position.set(0, -1, 0);
    pezModel.rotateY(90);

    player.add(pezModel);
    luisito.scene.add(player);


    //MODELO DE LAS MONEDAS

    coinModel = luisito.assets.get('Coin').scene;
    coinModel.scale.set(0.5, 0.5, 0.5);
    coinModel.position.set(0, -1, 0);
    coinModel.rotateY(90);
    

    //MODELOS CORALES



    coralModel1 = luisito.assets.get('Coral1').scene;
    coralModel1.scale.set(0,0,0);
    coralModel1.position.set(0, 0, 0);
    coralModel1.rotateY(90);

    coralModel2 = luisito.assets.get('Coral2').scene;
    coralModel2.scale.set(0,0,0);
    coralModel2.position.set(0, 0, 0);
    coralModel2.rotateY(90);

    coralModel3 = luisito.assets.get('Coral3').scene;
    coralModel3.scale.set(0,0,0);
    coralModel3.position.set(0, 0, 0);
    coralModel3.rotateY(90);


    //MODELOS POWERUPS

    escudoModel = luisito.assets.get('Escudo').scene;
    escudoModel.scale.set(1,1,1);
    escudoModel.position.set(0, 0, -10);
    escudoModel.rotateY(90);

    rayoModel = luisito.assets.get('Rayo').scene;
    rayoModel.scale.set(1,1,1);
    rayoModel.position.set(0, 0, -10);
    rayoModel.rotateY(90);



    
     // Crear un número fijo de monedas y añadirlas al array


    mixer = new THREE.AnimationMixer(luisito.assets.get('Pez').scene);
    action = mixer.clipAction(luisito.assets.get('Pez').animations[0]);

    luisito.addComponentToObject(
        player,
        'rigidbody',
        luisito.physics.CreateBody({
            mass: 1,
            angularDamping: 0.96,
            shape: new CANNON.Box(cubeHalfExtents),
            material: playerMaterial,
            // Bloquear rotación
            angularFactor: new CANNON.Vec3(0, 0, 0),
            angularVelocity: new CANNON.Vec3(0, 0, 0)
        })
    );

    // CARGAMOS LOS SONIDOS

    // Sonido de audio demoníaco en bucle
    audioLoader.load( '/static/sounds/beach_party.mp3', function( buffer ) {
        sonido_fondo.setBuffer( buffer );
        sonido_fondo.setLoop(true);
        sonido_fondo.setVolume(0.4);
        sonido_fondo.play();
    });
    
    // Sonido cuando hacemos que el pez suba
    audioLoader.load( '/static/sounds/bubble_up.mp3', function( buffer ) {
        sonido_burbuja.setBuffer( buffer );
        sonido_burbuja.setVolume(0.8);
    });

    // Sonido cuando recogemos una moneda
    audioLoader.load( '/static/sounds/moneda.mp3', function( buffer ) {
        sonido_moneda.setBuffer( buffer );
        sonido_moneda.setVolume(0.8);
    });
    
    // Sonido cuando recogemos el escudo
    audioLoader.load( '/static/sounds/escudo.mp3', function( buffer ) {
        sonido_escudo.setBuffer( buffer );
        sonido_escudo.setVolume(0.8);
    });
    
    // Sonido cuando recogemos el rayo
    audioLoader.load( '/static/sounds/rayo.mp3', function( buffer ) {
        sonido_rayo.setBuffer( buffer );
        sonido_rayo.setVolume(0.8);
    });

    // Sonido cuando perdemos la partida
    audioLoader.load( '/static/sounds/lose.mp3', function( buffer ) {
        sonido_perder.setBuffer( buffer );
        sonido_perder.setVolume(0.8);
    });
};


const planes = [];

// Asumiendo que textures[0] es el fondo estático '/static/textures/Fondos/fondos/fondo 1.jpg'
const staticTexture = textureLoader.load('/static/textures/Fondos/fondos/fondo 1.jpg');
const staticMaterial = new THREE.MeshStandardMaterial({ map: staticTexture, transparent: true });
const staticPlane = new THREE.Mesh(new THREE.PlaneGeometry(50, 20), staticMaterial);
staticPlane.position.set(-5, 0, -10); // Posición fija para el fondo estático
luisito.scene.add(staticPlane);

// Crear los fondos restantes con movimiento
for (let i = 1; i < textures.length; i++) {
    const geometry = new THREE.PlaneGeometry(40, 20);
    const material = new THREE.MeshStandardMaterial({ map: textures[i], transparent: true });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(i*15 -15, 0, i-10); // Posicionar cada fondo al lado del anterior
    planes.push(plane);
    luisito.scene.add(plane);
}
//-----------------------------------------------------------------------------------------------------------------------------------------------

//TODO LO RELACIONADO CON LAS TUBERÍAS

const PIPE_GAP = 7;
const THRUST_FORCE = 4;
const MAX_VERTICAL_SPEED = THRUST_FORCE * 1.5;
const UPPER_LIMIT = 9;
const LOWER_LIMIT = -9;
const PIPE_UPPER_LIMIT = 11;
const PIPE_LOWER_LIMIT = -12;
const MIN_PIPE_DISTANCE = 3;
const MAX_PIPE_DISTANCE = 7;
let pulsando = false;
const pipes = [];
const PIPE_INTERVAL = 1.5;
let PIPE_SPEED = 6;
let lastPipeCenter = 0;
var tocando = false;
const REMOVE_INTERVAL = 7000; // Intervalo en milisegundos para eliminar las tuberías
const REMOVE_INTERVAL_COIN = 7000

const PIPE_COLLISION_RADIUS = 1.5;
// Variables globales
let score = 0; // Solo se declara una vez aquí

const scoreElement = document.getElementById('score'); // Elemento en el DOM para mostrar el puntaje

const createPipe = () => {
    let pipeHeight;
    let pipeCenter;
    
    do {
        pipeHeight = Math.random() * (PIPE_UPPER_LIMIT - PIPE_LOWER_LIMIT - 5) + 3;
        pipeCenter = PIPE_LOWER_LIMIT + pipeHeight / 2;
    } while (Math.abs(pipeCenter - lastPipeCenter) > MAX_PIPE_DISTANCE || Math.abs(pipeCenter - lastPipeCenter) < MIN_PIPE_DISTANCE);

    lastPipeCenter = pipeCenter;

    const gap = PIPE_GAP;

    // Creación de las tuberías (cubos)
    const pipeTop = luisito.createObject();
    const pipeBottom = luisito.createObject();

    const pipeTopHeight = PIPE_UPPER_LIMIT - gap / 2;
    const pipeBottomHeight = pipeHeight - gap / 2;

    let randomNumber = Math.floor(Math.random() * 6) + 1;


    // Clonación y ajuste de los corales
    if (coralModel1 || coralModel2 || coralModel3) {
        if(randomNumber == 1){
            const coralTopClone = coralModel1.clone();
        coralTopClone.scale.set(1, pipeTopHeight, 1); // Ajusta el tamaño según sea necesario
        coralTopClone.position.set(0, pipeTopHeight / 2, 0); // Ajusta la posición vertical
        pipeTop.add(coralTopClone);

        const coralBottomClone = coralModel1.clone();
        coralBottomClone.scale.set(1, pipeBottomHeight*0.6 / 3, 1); // Ajusta el tamaño según sea necesario
        coralBottomClone.position.set(0, -pipeBottomHeight / 2, 0); // Ajusta la posición vertical
        pipeBottom.add(coralBottomClone);
        }
        if(randomNumber == 2){
            const coralTopClone = coralModel2.clone();
        coralTopClone.scale.set(1, pipeTopHeight, 1); // Ajusta el tamaño según sea necesario
        coralTopClone.position.set(0, pipeTopHeight / 2, 0); // Ajusta la posición vertical
        pipeTop.add(coralTopClone);

        const coralBottomClone = coralModel2.clone();
        coralBottomClone.scale.set(1, pipeBottomHeight*0.6 / 3, 1); // Ajusta el tamaño según sea necesario
        coralBottomClone.position.set(0, -pipeBottomHeight / 2, 0); // Ajusta la posición vertical
        pipeBottom.add(coralBottomClone);
        }
        if(randomNumber == 3){
            const coralTopClone = coralModel3.clone();
        coralTopClone.scale.set(1, pipeTopHeight, 1); // Ajusta el tamaño según sea necesario
        coralTopClone.position.set(0, pipeTopHeight / 2, 0); // Ajusta la posición vertical
        pipeTop.add(coralTopClone);

        const coralBottomClone = coralModel3.clone();
        coralBottomClone.scale.set(1, pipeBottomHeight*0.6 / 3, 1); // Ajusta el tamaño según sea necesario
        coralBottomClone.position.set(0, -pipeBottomHeight / 2, 0); // Ajusta la posición vertical
        pipeBottom.add(coralBottomClone);
        }
        if(randomNumber == 4){
            const coralTopClone = coralModel3.clone();
        coralTopClone.scale.set(1, pipeTopHeight, 1); // Ajusta el tamaño según sea necesario
        coralTopClone.position.set(0, pipeTopHeight / 2, 0); // Ajusta la posición vertical
        pipeTop.add(coralTopClone);

        const coralBottomClone = coralModel2.clone();
        coralBottomClone.scale.set(1, pipeBottomHeight*0.6 / 3, 1); // Ajusta el tamaño según sea necesario
        coralBottomClone.position.set(0, -pipeBottomHeight / 2, 0); // Ajusta la posición vertical
        pipeBottom.add(coralBottomClone);
        }
        if(randomNumber == 5){
            const coralTopClone = coralModel2.clone();
        coralTopClone.scale.set(1, pipeTopHeight, 1); // Ajusta el tamaño según sea necesario
        coralTopClone.position.set(0, pipeTopHeight / 2, 0); // Ajusta la posición vertical
        pipeTop.add(coralTopClone);

        const coralBottomClone = coralModel1.clone();
        coralBottomClone.scale.set(1, pipeBottomHeight*0.6 / 3, 1); // Ajusta el tamaño según sea necesario
        coralBottomClone.position.set(0, -pipeBottomHeight / 2, 0); // Ajusta la posición vertical
        pipeBottom.add(coralBottomClone);
        }
        if(randomNumber == 6){
            const coralTopClone = coralModel1.clone();
        coralTopClone.scale.set(1, pipeTopHeight, 1); // Ajusta el tamaño según sea necesario
        coralTopClone.position.set(0, pipeTopHeight / 2, 0); // Ajusta la posición vertical
        pipeTop.add(coralTopClone);

        const coralBottomClone = coralModel3.clone();
        coralBottomClone.scale.set(1, pipeBottomHeight*0.6 / 3, 1); // Ajusta el tamaño según sea necesario
        coralBottomClone.position.set(0, -pipeBottomHeight / 2, 0); // Ajusta la posición vertical
        pipeBottom.add(coralBottomClone);
        }
        
    }

    // Configuración de los cuerpos de Cannon.js para las tuberías
    const shapeTop = new CANNON.Box(new CANNON.Vec3(0.33, pipeTopHeight / 2, 10));
    const shapeBottom = new CANNON.Box(new CANNON.Vec3(0.33, pipeBottomHeight / 2, 10));

    const bodyTop = new CANNON.Body({
        mass: 0,
        material: enemyMaterial,
        shape: shapeTop,
        position: new CANNON.Vec3(10, PIPE_UPPER_LIMIT - (PIPE_UPPER_LIMIT - pipeHeight) / 2, 0)
    });

    const bodyBottom = new CANNON.Body({
        mass: 0,
        material: enemyMaterial,
        shape: shapeBottom,
        position: new CANNON.Vec3(10, PIPE_LOWER_LIMIT + pipeHeight / 2, 0)
    });

    pipeTop.rigidbody = bodyTop;
    pipeBottom.rigidbody = bodyBottom;

    if(vidas == 1){
        // Manejadores de colisión para las tuberías
    pipeTop.rigidbody.addEventListener("collide", (e) => {
        if (player != null && e.body.material == playerMaterial) {
            tocando = true;
            console.log("Está tocando la tubería superior");
            if(vidas == 2){
                luisito.scene.remove(pipeTop)
            }
        }
    });

    pipeBottom.rigidbody.addEventListener("collide", (e) => {
        if (player != null && e.body.material == playerMaterial) {
            tocando = true;
            console.log("Está tocando la tubería inferior");
            if(vidas == 2){
                luisito.scene.remove(pipeBottom)
            }
        }
    });
    }

   
       
    


    

    // Agregar los cuerpos al mundo de Cannon.js
    world.addBody(bodyTop);
    world.addBody(bodyBottom);

    // Agregar las tuberías al escenario de Three.js
    luisito.scene.add(pipeTop);
    luisito.scene.add(pipeBottom);

    

    // Colocar una moneda en una posición aleatoria cerca del centro de la tubería
    // const coin = coins.shift(); // Tomar la primera moneda del array
    let randomNumberObjeto = Math.floor(Math.random() * 20) + 1;

    if(randomNumberObjeto == 16 || randomNumberObjeto == 17){
        const escudo = escudoModel.clone()

        if (escudo){
            escudo.position.set(10.5, pipeCenter + 10.5, 0); // Colocar la moneda en el centro de la tubería
            luisito.scene.add(escudo)
            escudos.push(escudo); // Devolver la moneda al final del array para reutilizarla
        }

    }
    else if(randomNumberObjeto == 20){

            const rayo = rayoModel.clone()

        if(rayo){

            rayo.position.set(10.5, pipeCenter + 10.5, 0); // Colocar la moneda en el centro de la tubería
            luisito.scene.add(rayo)
            rayos.push(rayo); // Devolver la moneda al final del array para reutilizarla
        }

    }

    else{
        const coin = coinModel.clone()
    
    if (coin) {
        coin.position.set(10.5, pipeCenter + 10.5, 0); // Colocar la moneda en el centro de la tubería
        luisito.scene.add(coin)
        coins.push(coin); // Devolver la moneda al final del array para reutilizarla
    }
    }
    

    

    // Agregar las tuberías al array de tuberías
    pipes.push({ top: pipeTop, bottom: pipeBottom, scored: false }); // Agregamos la propiedad 'scored'

    
};

// Función para eliminar una tubería
const removePipe = (pipe) => {
    const index = pipes.indexOf(pipe);
    if (index !== -1) {
        const bodyTop = pipe.top.rigidbody;
        const bodyBottom = pipe.bottom.rigidbody;

        luisito.scene.remove(pipe.top);
        world.removeBody(bodyTop);
        luisito.scene.remove(pipe.bottom);
        luisito.scene.remove(pipe);
        world.removeBody(bodyBottom);
        pipes.splice(index, 1);
    }
};

const removeCoin = (coin) => {
    const index = coins.indexOf(coin);
    if (index !== -1){
        luisito.scene.remove(coin);
        coins.splice(index, 1);
    }
}


const spawnPipes = () => {
    createPipe();
    setTimeout(spawnPipes, PIPE_INTERVAL * 1200);
};

const updatePipes = (dt) => {
    for (let i = pipes.length - 1; i >= 0; i--) {

        
        const pipe = pipes[i];
        const bodyTop = pipe.top.rigidbody;
        const bodyBottom = pipe.bottom.rigidbody;
        let speedIncrement = 0.025; // Incremento de velocidad por segundo
        let elapsedTime = 0; 
       // Incrementar el tiempo acumulado
        elapsedTime += dt;
        const initialIntensity = 2; // Intensidad inicial de la luz ambiental
        const minIntensity = 0.25; // Intensidad mínima deseada
        const decreaseRate = (initialIntensity - minIntensity) / 10; //
            // Calcular la nueva intensidad basada en el tiempo transcurrido
        const newIntensity = initialIntensity - decreaseRate * (elapsedTime / 1000); // 1000 para convertir dt a segundos

        // Limitar la intensidad para asegurarse de que no sea menor que el mínimo
        ambientLight.intensity = Math.max(minIntensity, newIntensity);
        PIPE_SPEED = PIPE_SPEED + speedIncrement * elapsedTime;
        bodyTop.position.x -= PIPE_SPEED * dt;
        bodyBottom.position.x -= PIPE_SPEED * dt;

        console.log(pipe.top.position)
        console.log(player.position)
        pipe.top.position.copy(bodyTop.position);
        pipe.top.quaternion.copy(bodyTop.quaternion);

        pipe.bottom.position.copy(bodyBottom.position);
        pipe.bottom.quaternion.copy(bodyBottom.quaternion);


        
        if (pipe.top.position.x == 0) {
            luisito.scene.remove(pipe);
            luisito.scene.remove(bodyTop);
            world.removeBody(bodyTop);
            luisito.scene.remove(pipe.bottom);
            world.removeBody(bodyBottom);
            pipes.splice(i, 1);
        }
            // Crear cápsulas de colisión para los pipes
            const pipeTopCapsules = [];
            const pipeBottomCapsules = [];
            const numCapsules = 20; // Siempre crear 10 cápsulas hacia abajo

            for (let i = 0; i < numCapsules; i++) {
                const yOffset = (i + 2) * 1.0; // Separación vertical entre cápsulas

                // Posiciones de las cápsulas
                const topPosition = new THREE.Vector3(pipe.top.position.x, pipe.top.position.y + yOffset-3, pipe.top.position.z);
                const bottomPosition = new THREE.Vector3(pipe.bottom.position.x, pipe.bottom.position.y - yOffset +5, pipe.bottom.position.z);

                // Crear cápsulas (esferas) para los pipes
                const topCapsule = new THREE.Sphere(topPosition, PIPE_COLLISION_RADIUS);
                const bottomCapsule = new THREE.Sphere(bottomPosition, PIPE_COLLISION_RADIUS);

                pipeTopCapsules.push(topCapsule);
                pipeBottomCapsules.push(bottomCapsule);
            }


                // Verificar colisiones con el jugador
if (escudoAct && player && !rayoAct) {
    for (let i = 0; i < pipeTopCapsules.length; i++) {
        const topCapsule = pipeTopCapsules[i];
        const bottomCapsule = pipeBottomCapsules[i];

        if (playerCollisionSphere.intersectsSphere(topCapsule)) {
            luisito.scene.remove(pipe.top);
            world.removeBody(bodyTop);
            tocando = true;
            break; // Salir del bucle si hay colisión
        } else if (playerCollisionSphere.intersectsSphere(bottomCapsule)) {
            luisito.scene.remove(pipe.bottom);
            world.removeBody(bodyBottom);
            tocando = true;
            break; // Salir del bucle si hay colisión
        }
    }
}

if (rayoAct && player) {
    for (let i = 0; i < pipeTopCapsules.length; i++) {
        const topCapsule = pipeTopCapsules[i];
        const bottomCapsule = pipeBottomCapsules[i];

        if (playerCollisionSphere.intersectsSphere(topCapsule)) {
            luisito.scene.remove(pipe.top);
            world.removeBody(bodyTop);
            break; // Salir del bucle si hay colisión
        } else if (playerCollisionSphere.intersectsSphere(bottomCapsule)) {
            luisito.scene.remove(pipe.bottom);
            world.removeBody(bodyBottom);
            break; // Salir del bucle si hay colisión
        }
    }
}


        // Verificar si el jugador pasa por el centro del tubo
        if (!pipe.scored && player.position.x > pipe.top.position.x) {
            pipe.scored = true; // Marcamos como puntuado para evitar sumar más de una vez
            score++; // Incrementamos el puntaje
            // Aquí podríamos reproducir un pequeño sonido de feedback
            scoreElement.textContent = score.toString(); // Actualizamos la UI del puntaje
        }
        // Programar la eliminación de la tubería después de REMOVE_INTERVAL milisegundos
    setTimeout(() => {
        removePipe(pipe);
    }, REMOVE_INTERVAL);
    }
};

//-----------------------------------------------------------------------------------------------------------------------------------------------

//MOVIMIENTO DEL JUGADOR

//-------------------------------------------------------------------------------------------------------------------------------------------------

const applyJumpForce = () => {
    if (player.rigidbody.velocity.y < MAX_VERTICAL_SPEED) {
        const localUpDirection = new THREE.Vector3(0, 1, 0);
        const thrustForceVector = new CANNON.Vec3(localUpDirection.x, localUpDirection.y, 0).scale(THRUST_FORCE);
        player.rigidbody.applyImpulse(thrustForceVector, new CANNON.Vec3(0, 0, 0));
    }
};

const checkPositionLimits = () => {
    const positionY = player.position.y;

    if (positionY > UPPER_LIMIT) {
        player.position.y = UPPER_LIMIT;
        player.rigidbody.velocity.y = 0;
    }

    if (positionY < LOWER_LIMIT) {
        player.position.y = LOWER_LIMIT;
        if (!pulsando) {
            player.rigidbody.velocity.y = 0;
        }
    }
};

var vidas = 1;
player.position.z = 0
var escudoAct = false;
var rayoAct = false

let tiempoCompletado = false; // Variable inicial

// Función para cambiar la variable a false después de 3 segundos
function cambiarVariable() {
    setTimeout(() => {
        tiempoCompletado = true;
        console.log("Variable cambiada a false después de 3 segundos");
    }, 3000); // 3000 milisegundos = 3 segundos
}

const PLAYER_COLLISION_RADIUS = 1.25; // Radio de la esfera de colisión del jugador
const COIN_COLLISION_RADIUS = 0.5; // Radio de la esfera de colisión de las monedas
const ESCUDO_COLLISION_RADIUS = 1; // Radio de la esfera de colisión de las monedas
const RAYO_COLLISION_RADIUS = 1; // Radio de la esfera de colisión de las monedas

// Crear una esfera de colisión para el jugador
const playerCollisionSphere = new THREE.Sphere(player.position, PLAYER_COLLISION_RADIUS);



//-------------------------------------------------------------------------------------------------------------------------------------------------

//METODO UPDATE

//-------------------------------------------------------------------------------------------------------------------------------------------------
luisito.update = (dt) => {
    const input = luisito.input;




    coins.forEach(coin => {
        coin.position.x -= PIPE_SPEED * dt;
        coin.rotateY(-dt);
         // Crear una esfera de colisión para la moneda
         const coinCollisionSphere = new THREE.Sphere(coin.position, COIN_COLLISION_RADIUS);

        if(coin){
            // Verificar si el jugador está tocando la moneda basándose en la posición
        if (playerCollisionSphere.intersectsSphere(coinCollisionSphere) && !coin.collected) { // Ajusta el valor según sea necesario
           
    
            // Marcar la moneda como recogida
            coin.collected = true;
    
            // Incrementar el puntaje y actualizar la interfaz
            score++;
            scoreElement.textContent = score.toString();

            // Reproducir un sonido de feedback
            sonido_moneda.play();
    
            // Eliminar la moneda de la escena
            luisito.scene.remove(coin);
            coins.splice(index, 1);
        }          
        setTimeout(() => {
            removeCoin(coin);
        }, REMOVE_INTERVAL_COIN);
        }
        
    });


    escudos.forEach(escudo => {
        escudo.position.x -= PIPE_SPEED * dt;
        escudo.rotateY(-dt);
        const escudoCollisionSphere = new THREE.Sphere(escudo.position, ESCUDO_COLLISION_RADIUS);
        if(rayoAct == false){if(escudo){
            // Verificar si el jugador está tocando la moneda basándose en la posición
        if (playerCollisionSphere.intersectsSphere(escudoCollisionSphere)&& !escudo.collected) { // Ajusta el valor según sea necesario
           
            
            // Marcar la moneda como recogida
            escudo.collected = true;
    
            player.add(sphereEscudo)
            // Reproducir un sonido de feedback
            sonido_escudo.play();
            escudoAct = true
            // Eliminar la moneda de la escena
            luisito.scene.remove(escudo);
            escudos.splice(index, 1);
        }          
        setTimeout(() => {
            removeCoin(escudo);
        }, REMOVE_INTERVAL_COIN);
        }}
        else{
            if(escudo){
                // Verificar si el jugador está tocando la moneda basándose en la posición
            if (playerCollisionSphere.intersectsSphere(escudoCollisionSphere)&& !escudo.collected) { // Ajusta el valor según sea necesario
               
                
                // Marcar la moneda como recogida
                escudo.collected = true;
                // Reproducir un sonido de feedback
                sonido_escudo.play();

                // Eliminar la moneda de la escena
                luisito.scene.remove(escudo);
                escudos.splice(index, 1);
            }          
            setTimeout(() => {
                removeCoin(escudo);
            }, REMOVE_INTERVAL_COIN);
            }}

        
        
        
    });



    rayos.forEach(rayo => {
        rayo.position.x -= PIPE_SPEED * dt;
        rayo.rotateY(-dt);
        const rayoCollisionSphere = new THREE.Sphere(rayo.position, RAYO_COLLISION_RADIUS);

        if(rayo){
            // Verificar si el jugador está tocando la moneda basándose en la posición
        if (playerCollisionSphere.intersectsSphere(rayoCollisionSphere)&& !rayo.collected) { // Ajusta el valor según sea necesario
           
    
            // Marcar la moneda como recogida
            rayo.collected = true;
            player.add(sphereRayo)
            rayoAct = true;
                    // Programar la eliminación de la tubería después de REMOVE_INTERVAL milisegundos
            setTimeout(() => {
                tiempoCompletado = true;
            }, 10000);
            // Reproducir un sonido de feedback
            sonido_rayo.play();
            if(escudoAct == true){
                escudoAct = false
                player.remove(sphereEscudo)
            }
    
            // Eliminar la moneda de la escena
            luisito.scene.remove(rayo);
            rayos.splice(index, 1);
        }          
        setTimeout(() => {
            removeCoin(rayo);
        }, REMOVE_INTERVAL_COIN);
        }
        
    });

    const playerSpeed = 0.01 + dt; // Velocidad del jugador (suponiendo)

    // Mover los fondos hacia la izquierda
    planes.forEach(plane => {
        plane.position.x -= playerSpeed*3;
        
        // Si un plano se mueve más allá del límite izquierdo, lo reposicionamos al final
        if (plane.position.x < -60) {
            const lastPlane = planes[planes.length - 1];
            plane.position.x = lastPlane.position.x + 40;
            
            // Rotar los fondos en la lista
            planes.push(planes.shift());
        }
    });

    luisito.camera.instance.position.x = player.position.x +5;

    if (player != null) {

        mixer.update(dt);
        action.play();

        if (player.rigidbody) {
            if (input.isKeyPressed('ArrowUp')) {
                pulsando = true;
                applyJumpForce();

                // Reproducimos el sonido de la burbuja
                sonido_burbuja.play(); 

            } else {
                pulsando = false;
            }

            checkPositionLimits();
        }
    }
    if(player != null){

        if (rayoAct==true){
            if(tiempoCompletado){
                rayoAct = false;
                player.remove(sphereRayo)
            }
        }            
        else{
            if (escudoAct && tocando == true){
                tocando = false;
                escudoAct = false;
                player.remove(sphereEscudo)
            }
    
            else if (tocando == true){
                if (vidas == 1){
                    vidas -= 1;
                    tocando = false;
                }
            }
        }
        
       


        
        if(vidas == 0){
            world.removeBody(player);
            luisito.scene.remove(player);
            player = null;
            sonido_fondo.stop();
            sonido_moneda.stop();
            sonido_burbuja.stop();
            sonido_escudo.stop();
            sonido_rayo.stop();
            sonido_perder.play();
            // alert("Has muerto");
            // window.location.reload();

            handleGameOver(); // 
                }
               
        }

        

    updatePipes(dt);
    if(tiempoPasado < 10000){
        tiempoPasado += dt
    }
    
};

//-------------------------------------------------------------------------------------------------------------------------------------------------


//PARA EL MENSAJE DE CUANDO PIERDES

//-------------------------------------------------------------------------------------------------------------------------------------------------

let tiempoPasado =0;
setTimeout(() => {
    spawnPipes(); // Pregunta, ¿las tuberías despawnean?
    // Coloca aquí el código que quieres ejecutar después del retraso
    console.log("Se ha ejecutado después del retraso.");
}, 1000-tiempoPasado * 0.025); // 1000 milisegundos = 1 segundo


// Obtener el modal y los elementos relacionados
const modal = document.getElementById("myModal");
const modalText = document.getElementById("modal-text");
const modalRetryBtn = document.getElementById("modal-retry-btn");

// Función para mostrar el modal con un mensaje específico
function showModal(message) {
  modal.style.display = "block";
  modalText.textContent = message;
}

// Cuando el usuario haga clic en el botón de reintentar, recargar la página
modalRetryBtn.addEventListener("click", function() {
  window.location.reload();
});

// Cerrar el modal cuando el usuario haga clic en la 'x'
const closeBtn = document.getElementsByClassName("close")[0];
closeBtn.addEventListener("click", function() {
  modal.style.display = "none";
});

// Mostrar el modal cuando el jugador muere
function showGameOverModal() {
  showModal("¡Has perdido! ¿Quieres volver a intentarlo?");
}

// Llamar a la función para mostrar el modal cuando el jugador muere
function handleGameOver() {
  showGameOverModal();
}

//-------------------------------------------------------------------------------------------------------------------------------------------------


world.defaultContactMaterial.contactEquationStiffness = 100
luisito.start();
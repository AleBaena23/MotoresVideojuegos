import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import gsap from 'gsap'; // para animaciones
import Luisito from '/src/luisito.js';

//SETUP//

//------------------------------------------------------------

const luisito = new Luisito();
luisito.camera.instance.position.set(0, 0, 20);

// Creamos el audio listener y se lo metemos a la cámara
const listener = new THREE.AudioListener();
luisito.camera.instance.add(listener);


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
let mixer = null;
let action = null;

const sonido_fondo = new THREE.Audio(listener)
const sonido_burbuja = new THREE.Audio(listener)

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
        path: 'static/models/PowerUps/escudo.glb'
    }



]);

const cubeHalfExtents = new CANNON.Vec3(0.5,0.5,0.5);

const coinSides = new CANNON.Vec3(0.75, 0.75, 0.75);


let player = luisito.createObject();
player.position.set(-10, 0, 0);

let coin = luisito.createObject();
coin.position.set(0, 0, 0);

let coins = []; // Array para almacenar las monedas
// Función para crear un número fijo de monedas y añadirlas al array
const initializeCoins = () => {
    coins = []; // Reiniciar la lista de monedas
    if(coinModel || escudoModel){
        for (let i = 0; i < 10; i++) {
            let randomNumber = Math.floor(Math.random() * 15) + 1;
            if(randomNumber != 14){
                let coin = luisito.createObject();
            let coinClone = coinModel.clone();
            coin.add(coinClone);
            coins.push(coin);
            coin.position.set(-100, 0, 0); // Posición inicial de las monedas fuera de la vista
            luisito.scene.add(coin);
            }
            else{
                let escudo = luisito.createObject();
            let escudoClone = escudoModel.clone();
            escudo.add(escudoClone);
            coins.push(escudo);
            escudo.position.set(-100, 0, 0); // Posición inicial de las monedas fuera de la vista
            luisito.scene.add(escudo);
            }
            
        }
    }
    
};

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
    escudoModel.position.set(0, 0, 0);
    escudoModel.rotateY(0);
    
     // Crear un número fijo de monedas y añadirlas al array
     for (let i = 0; i < 100; i++) {
        let coin = luisito.createObject();
        let coinClone = coinModel.clone();
        coin.add(coinClone);
      
        coins.push(coin);
        coin.position.set(-100,0,0)
        luisito.scene.add(coin);
    }

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
    audioLoader.load( '/static/sounds/beach_party.mp3', function( buffer ) {
        sonido_fondo.setBuffer( buffer );
        sonido_fondo.setLoop(true);
        sonido_fondo.setVolume(0.4);
        sonido_fondo.play();
    });
    
    audioLoader.load( '/static/sounds/bubble_up.mp3', function( buffer ) {
        sonido_burbuja.setBuffer( buffer );
        sonido_burbuja.setVolume(0.8);
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
const PIPE_SPEED = 6;
let lastPipeCenter = 0;
var tocando = false;


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
    const shapeTop = new CANNON.Box(new CANNON.Vec3(1.75 / 2, pipeTopHeight / 2, 10));
    const shapeBottom = new CANNON.Box(new CANNON.Vec3(1.75 / 2, pipeBottomHeight / 2, 10));

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

    // Manejadores de colisión para las tuberías
    pipeTop.rigidbody.addEventListener("collide", (e) => {
        if (player != null && e.body.material == playerMaterial) {
            tocando = true;
            console.log("Está tocando la tubería superior");
        }
    });

    pipeBottom.rigidbody.addEventListener("collide", (e) => {
        if (player != null && e.body.material == playerMaterial) {
            tocando = true;
            console.log("Está tocando la tubería inferior");
        }
    });

    // Agregar los cuerpos al mundo de Cannon.js
    world.addBody(bodyTop);
    world.addBody(bodyBottom);

    // Agregar las tuberías al escenario de Three.js
    luisito.scene.add(pipeTop);
    luisito.scene.add(pipeBottom);

    // Crear nuevas monedas si no hay suficientes
    if (coins.length === 0) {
        initializeCoins(); // Reinicializar las monedas si se agotan
    }

    // Colocar una moneda en una posición aleatoria cerca del centro de la tubería
    const coin = coins.shift(); // Tomar la primera moneda del array
    if (coin) {
        coin.position.set(10.5, pipeCenter + 10.5, 0); // Colocar la moneda en el centro de la tubería
        coins.push(coin); // Devolver la moneda al final del array para reutilizarla
    }

    // Agregar las tuberías al array de tuberías
    pipes.push({ top: pipeTop, bottom: pipeBottom, scored: false }); // Agregamos la propiedad 'scored'
};


const spawnPipes = () => {
    createPipe();
    setTimeout(spawnPipes, PIPE_INTERVAL * 1200);
};

const updatePipes = (dt) => {
    for (let i = pipes.length - 1; i >= 0; i--) {
        const pipe = pipes[i];
        const bodyTop = pipe.top.rigidbody;
        const bodyBottom = pipe.bottom.rigidbody;

        bodyTop.position.x -= PIPE_SPEED * dt;
        bodyBottom.position.x -= PIPE_SPEED * dt;

        
        if (bodyTop.position.x == player.position.x -35) {
            luisito.scene.remove(pipe.top);
            world.removeBody(bodyTop);
            luisito.scene.remove(pipe.bottom);
            world.removeBody(bodyBottom);
            pipes.splice(i, 1);
        }

        pipe.top.position.copy(bodyTop.position);
        pipe.top.quaternion.copy(bodyTop.quaternion);

        pipe.bottom.position.copy(bodyBottom.position);
        pipe.bottom.quaternion.copy(bodyBottom.quaternion);

        // Verificar si el jugador pasa por el centro del tubo
        if (!pipe.scored && player.position.x > pipe.top.position.x) {
            pipe.scored = true; // Marcamos como puntuado para evitar sumar más de una vez
            score++; // Incrementamos el puntaje
            // Aquí podríamos reproducir un pequeño sonido de feedback
            scoreElement.textContent = score.toString(); // Actualizamos la UI del puntaje
        }
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

//-------------------------------------------------------------------------------------------------------------------------------------------------

//METODO UPDATE

//-------------------------------------------------------------------------------------------------------------------------------------------------

luisito.update = (dt) => {
    const input = luisito.input;



    coins.forEach(coin => {
        coin.position.x -= PIPE_SPEED * dt;
        coin.rotateY(-dt);

    
        // Verificar si el jugador está tocando la moneda basándose en la posición
        if (player.position.distanceTo(coin.position) < 1.5 && !coin.collected) { // Ajusta el valor según sea necesario
           
    
            // Marcar la moneda como recogida
            coin.collected = true;
    
            // Incrementar el puntaje y actualizar la interfaz
            score++;
            scoreElement.textContent = score.toString();
    
            // Eliminar la moneda de la escena
            luisito.scene.remove(coin);
        }          
        if (coin.position.x == player.position.x -35) {
            luisito.scene.remove(coin);
            world.removeBody(coin);
        }
    });

    const playerSpeed = 0.01 + dt; // Velocidad del jugador (suponiendo)

    // Mover los fondos hacia la izquierda
    planes.forEach(plane => {
        plane.position.x -= playerSpeed*3;
        
        // Si un plano se mueve más allá del límite izquierdo, lo reposicionamos al final
        if (plane.position.x < -40) {
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
                // Aquí podríamos insertar un audio cuando sube
                sonido_burbuja.play();
            } else {
                pulsando = false;
                // Aquí podríamos reproducir un audio cuando baja
            }

            checkPositionLimits();
        }
    }
    if(player != null && tocando == true){
        if (vidas >0){
            vidas -= 1;
            tocando = false;
        }
        
        if(vidas == 0){
            world.removeBody(player);
            luisito.scene.remove(player);
            player = null;
            sonido_fondo.stop();
            // alert("Has muerto");
            // window.location.reload();

            handleGameOver(); // 
                }
               
        }

        

    updatePipes(dt);
};

//-------------------------------------------------------------------------------------------------------------------------------------------------


//PARA EL MENSAJE DE CUANDO PIERDES

//-------------------------------------------------------------------------------------------------------------------------------------------------


setTimeout(() => {
    spawnPipes(); // Pregunta, ¿las tuberías despawnean?
    // Coloca aquí el código que quieres ejecutar después del retraso
    console.log("Se ha ejecutado después del retraso.");
}, 1000); // 1000 milisegundos = 1 segundo


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
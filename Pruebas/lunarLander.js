import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import Luisito from '/src/luisito.js'
import { add } from 'three/examples/jsm/libs/tween.module.js';

const luisito = new Luisito()

const world = luisito.physics.world;

// Configurar la gravedad (1.61 default)
world.gravity.set(0, -1.61, 0);

// Configuración de la cámara cenital
const cameraHeight = 0; // Altura deseada de la cámara
const cameraDistance = 5; // Distancia desde la escena
const aspectRatio = window.innerWidth / window.innerHeight;

// Crear cámara cenital
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
camera.position.set(0, cameraHeight, cameraDistance); // Posición de la cámara
camera.lookAt(0, 0, 0); // Apuntar hacia el centro de la escena

luisito.camera.instance = camera;

const ambientLight = luisito.light.CreateAmbient('white',1)
const directionalLight = luisito.light.CreateDirectional('white', 1)

const cubeSize = 0.2
const cubeHalfExtents  = new CANNON.Vec3(cubeSize * 0.5, cubeSize * 0.5, cubeSize * 0.5 )
const baseHalfExtents  = new CANNON.Vec3(cubeSize*2, cubeSize * 0.99, cubeSize*9)

const playerMaterial = new CANNON.Material('playerM');
const enemyMaterial = new CANNON.Material('enemyM');

const enemyMplayerMContactMaterial = new CANNON.ContactMaterial(
    playerMaterial,
    enemyMaterial,
    {
        friction: 0.1,
        restitution: 0.2
    }
);
luisito.physics.world.addContactMaterial(enemyMplayerMContactMaterial);
// Creación de la "nave espacial"
let player = luisito.createObject();

luisito.addComponentToObject(
    player,
    "mesh",
    luisito.mesh.CreateFromGeometry(
        new THREE.ConeGeometry(cubeSize, cubeSize * 2),
        new THREE.MeshStandardMaterial({ color: "blue" })
    )
);

luisito.addComponentToObject(
    player,
    'rigidbody',
    luisito.physics.CreateBody({
        mass: 1,
        angularDamping: 0.96,
        shape: new CANNON.Box(cubeHalfExtents),
        material:playerMaterial,
        tag: "player"
    })
);
let tocando = false;
// Lista de colores para los enemigos
const enemyColors = ["orange", "red", "yellow", "green", "white", "purple", "cyan", "magenta", "pink", "lime"];

// Función para generar un enemigo con color aleatorio
function generateEnemy() {
    const enemy = luisito.createObject();
    const randomColor = enemyColors[Math.floor(Math.random() * enemyColors.length)]; // Seleccionar un color aleatorio

    luisito.addComponentToObject(
        enemy,
        "mesh",
        luisito.mesh.CreateFromGeometry(
            new THREE.SphereGeometry(0.25),
            new THREE.MeshStandardMaterial({ color: randomColor }) // Usar el color aleatorio
        )
    );

    luisito.addComponentToObject(
        enemy,
        'rigidbody',
        luisito.physics.CreateBody({
            mass: 1,
            angularDamping: 0.96,
            shape: new CANNON.Sphere(0.25),
            material: enemyMaterial
        })
    );

    enemy.position.set(getRandomInt(-5, 5), 6, 0);
    const velocidad = new CANNON.Vec3(0, 15, 0);

    enemy.rigidbody.addEventListener("collide", (e) => {
        
        if(player != null){
            if(e.body.material == playerMaterial){
                tocando = true
                console.log(tocando)
                e.target.velocity = velocidad;
            }
        }
            
        
        
        
    });
    
}

function generateEnemies(count) {
    const enemies = [];
    for (let i = 0; i < count; i++) {
        const enemy = luisito.createObject();
        const randomColor = enemyColors[Math.floor(Math.random() * enemyColors.length)]; // Seleccionar un color aleatorio

        luisito.addComponentToObject(
            enemy,
            "mesh",
            luisito.mesh.CreateFromGeometry(
                new THREE.SphereGeometry(0.25),
                new THREE.MeshStandardMaterial({ color: randomColor }) // Usar el color aleatorio
            )
        );

        luisito.addComponentToObject(
            enemy,
            'rigidbody',
            luisito.physics.CreateBody({
                mass: 1,
                angularDamping: 0.96,
                shape: new CANNON.Box(cubeHalfExtents),
                material: enemyMaterial,
                tag: "enemigo"
            })
        );

        enemy.position.set(getRandomInt(-5, 5), 6, 0);
        enemies.push(enemy);
        
    }
    return enemies;
}
// Función para generar 10 enemigos iniciales
function generateInitialEnemies() {
    const initialEnemies = [];
    for (let i = 0; i < 10; i++) {
        const enemy = generateEnemy(); // Generar un enemigo
        initialEnemies.push(enemy); // Almacenar el enemigo en el arreglo
    }
    return initialEnemies;
}

// Llamar a la función de generación de 10 enemigos iniciales
const initialEnemies = generateInitialEnemies();

// Llamar a la función de generación de enemigos cada segundo
setInterval(() => {
    for (let i = 0; i < 3; i++) { // Generar 3 enemigos cada vez
        generateEnemy();
    }
}, 1000);
// Método random para generar una posición aleatoria para la ubicación de la base
function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

luisito.start()

const MAX_TORQUE = 0.1; // Torque máximo aplicado
const MAX_ROTATION = 2 * Math.PI; // Máximo ángulo de rotación permitido (45 grados)
const THRUST_FORCE = 4.5; // Fuerza de empuje hacia arriba

let vidas = 3;
luisito.update = (dt) => {
    const input = luisito.input;
    if(player != null && tocando == true){
        if (vidas >0){
            vidas -= 1;
            tocando = false;
        }
        
        if(vidas == 0){
            player.position.set(1000,0,0);
            player = null;
            alert("Has muerto");
                }
        }
        
    
    if(player != null){
        
        // Calcular el arrastre angular basado en la velocidad angular del objeto
    // const angularDrag = cube.rigidbody.angularVelocity.scale(-ANGULAR_DRAG_COEFFICIENT);

    // Limitar la rotación del cubo
    const clampedRotation = Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, player.rigidbody.quaternion.z));
    player.quaternion.z = clampedRotation;
    
    // Verificar si el jugador atraviesa la pantalla por la derecha
    if (player.position.x > 7) {
        player.position.x = -7; // Aparecer en el lado izquierdo
    } else if (player.position.x < -7) { // Verificar si el jugador atraviesa la pantalla por la izquierda
        player.position.x = 7; // Aparecer en el lado derecho
    }
   
    // Detener el torque completamente si se presiona la tecla ArrowUp
    if (input.isKeyPressed('ArrowUp')) {
        // cube.rigidbody.angularVelocity.set(0, 0, 0);
        player.rigidbody.quaternion.setFromEuler(0, 0, 0);
        player.rigidbody.applyTorque(new CANNON.Vec3(0, 0, 0));
        
        // Obtener el vector de dirección hacia arriba en el sistema de coordenadas locales del cubo
        const localUpDirection = new THREE.Vector3(0, 1, 0);

        // Aplicar la orientación actual del cubo al vector de dirección hacia arriba
        localUpDirection.applyQuaternion(player.mesh.quaternion);

        // Escalar el vector de dirección hacia arriba por la fuerza de empuje deseada
        const thrustForceVector = new CANNON.Vec3(localUpDirection.x, localUpDirection.y, 0).scale(THRUST_FORCE);

        // Aplicar la fuerza de empuje al cuerpo del cubo
        player.rigidbody.applyLocalForce(thrustForceVector, new CANNON.Vec3(0, 0, 0));
        
    } 

        // Aplicar torque solo cuando no se está presionando la tecla ArrowUp
        if (input.isKeyPressed('ArrowLeft')) {
            player.rigidbody.applyTorque(new CANNON.Vec3(0, 0, MAX_TORQUE));
            // Aplicar el arrastre angular al cuerpo del cubo
            // cube.rigidbody.applyTorque(angularDrag);
        }
        if (input.isKeyPressed('ArrowRight')) {
            player.rigidbody.applyTorque(new CANNON.Vec3(0, 0, -MAX_TORQUE));
            // Aplicar el arrastre angular al cuerpo del cubo
            // cube.rigidbody.applyTorque(angularDrag);
        }
          
    }
      // Selecciona el elemento span por su id
      const vidasSpan = document.getElementById('vidas-value');

      // Actualiza el contenido del span con el valor actual de vidas
      vidasSpan.textContent = vidas.toString(); // Convierte vidas a cadena antes de asignarlo para asegurar que se muestre correctamente
    }

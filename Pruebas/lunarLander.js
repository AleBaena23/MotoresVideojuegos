import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import Luisito from '/src/luisito.js'

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
// Creación de la "nave espacial"
const cube = luisito.createObject()

luisito.addComponentToObject(
    cube,
    "mesh",
    luisito.mesh.CreateFromGeometry(
        //new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
        new THREE.ConeGeometry(cubeSize, cubeSize*2),
        new THREE.MeshStandardMaterial({color: "blue"})
    )
)
luisito.addComponentToObject(
    cube,
    'rigidbody',
    luisito.physics.CreateBody({
        mass: 1,
        angularDamping: 0.96,
        shape: new CANNON.Box(cubeHalfExtents)
    })
);

// Creación de la base
const base = luisito.createObject()

luisito.addComponentToObject(
    base,
    "mesh",
    luisito.mesh.CreateFromGeometry(
        new THREE.BoxGeometry(cubeSize*4, cubeSize, cubeSize*2),
        new THREE.MeshStandardMaterial({color: "red"})
    )
)
luisito.addComponentToObject(
    base,
    'rigidbody',
    luisito.physics.CreateBody({
        mass: 0,
        shape: new CANNON.Box(baseHalfExtents)
    })
);

// Posición de la base
base.position.set(getRandomInt(-6.5, 6.5), getRandomInt(0, -3), 0)

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

 // const ANGULAR_DRAG_COEFFICIENT = 0.9; // Coeficiente de arrastre angular

luisito.update = (dt) => {
    const input = luisito.input;

    // Calcular el arrastre angular basado en la velocidad angular del objeto
    // const angularDrag = cube.rigidbody.angularVelocity.scale(-ANGULAR_DRAG_COEFFICIENT);

    // Limitar la rotación del cubo
    const clampedRotation = Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, cube.rigidbody.quaternion.z));
    cube.quaternion.z = clampedRotation;

    // Detener el torque completamente si se presiona la tecla ArrowUp
    if (input.isKeyPressed('ArrowUp')) {
        // cube.rigidbody.angularVelocity.set(0, 0, 0);
        cube.rigidbody.quaternion.setFromEuler(0, 0, 0);
        cube.rigidbody.applyTorque(new CANNON.Vec3(0, 0, 0));
        
        // Obtener el vector de dirección hacia arriba en el sistema de coordenadas locales del cubo
        const localUpDirection = new THREE.Vector3(0, 1, 0);

        // Aplicar la orientación actual del cubo al vector de dirección hacia arriba
        localUpDirection.applyQuaternion(cube.mesh.quaternion);

        // Escalar el vector de dirección hacia arriba por la fuerza de empuje deseada
        const thrustForceVector = new CANNON.Vec3(localUpDirection.x, localUpDirection.y, 0).scale(THRUST_FORCE);

        // Aplicar la fuerza de empuje al cuerpo del cubo
        cube.rigidbody.applyLocalForce(thrustForceVector, new CANNON.Vec3(0, 0, 0));
        
    } 

        // Aplicar torque solo cuando no se está presionando la tecla ArrowUp
        if (input.isKeyPressed('ArrowLeft')) {
            cube.rigidbody.applyTorque(new CANNON.Vec3(0, 0, MAX_TORQUE));
            // Aplicar el arrastre angular al cuerpo del cubo
            // cube.rigidbody.applyTorque(angularDrag);
        }
        if (input.isKeyPressed('ArrowRight')) {
            cube.rigidbody.applyTorque(new CANNON.Vec3(0, 0, -MAX_TORQUE));
            // Aplicar el arrastre angular al cuerpo del cubo
            // cube.rigidbody.applyTorque(angularDrag);
        }
    }


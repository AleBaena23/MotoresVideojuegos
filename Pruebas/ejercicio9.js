import * as THREE from 'three'
import Luisito from '/src/luisito.js';

const luisito = new Luisito()

const input = luisito.input

luisito.camera.instance.position.set(100,100,100);
luisito.camera.instance.rotation.order = 'YXZ'
luisito.camera.instance.rotation.y = Math.PI / 4;
luisito.camera.instance.rotation.x = Math.atan(-1/Math.sqrt(2));
luisito.camera.instance.zoom = 20
luisito.camera.instance.updateProjectionMatrix()

const player = luisito.mesh.CreateFromGeometry(

new THREE.BoxGeometry(20,20,20),
new THREE.MeshBasicMaterial({color: 'skyblue'})

)

const axeHelperP = luisito.mesh.CreateAxesHelper(20)
const axeHelperZA = luisito.mesh.CreateAxesHelper(20)
const axeHelperZB = luisito.mesh.CreateAxesHelper(20)
const grid = luisito.mesh.CreateFromGeometry(
    new THREE.PlaneGeometry(300,300,20,20),
    new THREE.MeshBasicMaterial({color:'red',wireframe:true})
)

grid.rotation.order = 'YXZ';
grid.rotation.y = -Math.PI / 2;
grid.rotation.x = Math.PI / 2;
player.position.set(100,10,0)

const zombieA = luisito.mesh.CreateFromGeometry(
    new THREE.BoxGeometry(20,20,20),
    new THREE.MeshBasicMaterial({color:'green'})
)

zombieA.position.set(-100,10,0)

const zombieB = luisito.mesh.CreateFromGeometry(
    new THREE.BoxGeometry(20,20,20),
    new THREE.MeshBasicMaterial({color:'yellow'})
)

zombieB.position.set(-66,10,-75)
// Velocidad constante
const enemySpeed = 0.05; // Unidades por segundo



//LOGICA PARA LA VISION

// Definimos las direcciones de los zombies
const facingDirectionA = { x: 1, y: 0 }; // Dirección del zombie A
const facingDirectionB = { x: 1, y: 0 }; // Dirección del zombie B

// Definimos el campo de visión del zombie en radianes
const fieldOfView = Math.PI/4; // 180⁰ en radianes

// Función para calcular el ángulo entre dos vectores
function angleBetweenVectors(v1, v2) {
    const dotProduct = v1.x * v2.x + v1.y * v2.y;
    const magnitudeV1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const magnitudeV2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    return Math.acos(dotProduct / (magnitudeV1 * magnitudeV2));
}
// Función para determinar si un zombie puede ver al jugador
function canSeePlayer(zombiePos, playerPos, facingDirection, fov) {
    const zombiePos2D = { x: zombiePos.position.x, y: zombiePos.position.z };
    const playerPos2D = { x: playerPos.position.x, y: playerPos.position.z };

    const vectorToPlayer = {
        x: playerPos2D.x - zombiePos2D.x,
        y: playerPos2D.y - zombiePos2D.y
    };

    const angleToPlayer = angleBetweenVectors(vectorToPlayer, facingDirection);
    return angleToPlayer <= fov / 2;
}

// Función para mover el cubo en respuesta a las teclas presionadas
function moveCube() {
    const speed = 2; // Velocidad de movimiento del cubo

    // Movimiento en el eje X
    if (input.isKeyPressed('ArrowDown')) {
        player.position.x += speed;
    } else if (input.isKeyPressed('ArrowUp')) {
        player.position.x -= speed;
    }

    // Movimiento en el eje Z
    if (input.isKeyPressed('ArrowRight')) {
        player.position.z -= speed;
    } else if (input.isKeyPressed('ArrowLeft')) {
        player.position.z += speed;
    }
}

luisito.update = (dt) => {

    // Esta linea permite que el axeshelper esté siempre en la misma posicion que el player
    axeHelperP.position.set(player.position.x, player.position.y, player.position.z);

    axeHelperZA.position.set(zombieA.position.x, zombieA.position.y, zombieA.position.z);
    axeHelperZB.position.set(zombieB.position.x, zombieB.position.y, zombieB.position.z);


   // Añadimos rotación a los zombies y a sus axesHelper
   //zombieA.rotation.y += 0.01;
   //axeHelperZA.rotation.y += 0.01;

   //zombieB.rotation.y -= 0.01;
   //axeHelperZB.rotation.y -= 0.01;


   // Actualizamos las direcciones de los zombies después de la rotación
   facingDirectionA.x = Math.cos(zombieA.rotation.y);
   facingDirectionA.y = Math.sin(zombieA.rotation.y);

   facingDirectionB.x = Math.cos(zombieB.rotation.y);
   facingDirectionB.y = Math.sin(zombieB.rotation.y);



    moveCube();
    // Verificar si los zombies pueden ver al jugador
    const zombieACanSeePlayer = canSeePlayer(zombieA, player, facingDirectionA, fieldOfView);
    const zombieBCanSeePlayer = canSeePlayer(zombieB, player, facingDirectionB, fieldOfView);

    // Calcula el desplazamiento basado en la velocidad constante
    const displacement = enemySpeed * dt;

    // Calcula la dirección del movimiento del enemigo
    const directionPA = new THREE.Vector3();
    directionPA.subVectors(player.position, zombieA.position).normalize();

    // Calcula el desplazamiento en la dirección adecuada
    const movementA = directionPA.multiplyScalar(displacement);

    // Calcula la dirección del movimiento del enemigo
    const directionPB = new THREE.Vector3();
    directionPB.subVectors(player.position, zombieB.position).normalize();

    // Calcula el desplazamiento en la dirección adecuada
    const movementB = directionPB.multiplyScalar(displacement);

    if (zombieACanSeePlayer){
        zombieA.position.add(movementA);
      // Cambia el color del material del zombieA a rojo
      zombieA.material.color.set(0xff0000); // Rojo en formato hexadecimal
    } else {
        // Cambia el color del material del zombieA a verde si no ve al jugador
        zombieA.material.color.set(0x00ff00); // Verde en formato hexadecimal
    }  
    
    if (zombieBCanSeePlayer){
        zombieB.position.add(movementB);
    // Cambia el color del material del zombieA a rojo
    zombieB.material.color.set(0xff0000); // Rojo en formato hexadecimal
} else {
    // Cambia el color del material del zombieA a verde si no ve al jugador
    zombieB.material.color.set(0xFFFF00); // Verde en formato hexadecimal
}  
    

}

luisito.start()
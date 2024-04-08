import * as THREE from 'three'
import Luisito from '/src/luisito.js';

const luisito = new Luisito()


luisito.camera.instance.position.set(100,100,100);
luisito.camera.instance.rotation.order = 'YXZ'
luisito.camera.instance.rotation.y = Math.PI / 4;
luisito.camera.instance.rotation.x = Math.atan(-1/Math.sqrt(2));
luisito.camera.instance.zoom = 10
luisito.camera.instance.updateProjectionMatrix()

const player = luisito.mesh.CreateFromGeometry(
    
new THREE.BoxGeometry(20,20,20),
new THREE.MeshBasicMaterial({color: 'skyblue'})

)
  
const grid = luisito.mesh.CreateFromGeometry(
    new THREE.PlaneGeometry(300,300,20,20),
    new THREE.MeshBasicMaterial({wireframe:true})
)

grid.rotation.order = 'YXZ';
grid.rotation.y = -Math.PI / 2;
grid.rotation.x = Math.PI / 2;
player.position.set(100,10,0)

const enemy = luisito.mesh.CreateFromGeometry(
    new THREE.BoxGeometry(20,20,20),
    new THREE.MeshBasicMaterial({color:'crimson'})
)

enemy.position.set(-100,10,100)


// Velocidad constante
const enemySpeed = 0.2; // Unidades por segundo


luisito.update = (dt) => {

    /*let distance = new THREE.Vector3()
    distance.subVectors(player.position, enemy.position)
    enemy.position.add(distance.multiplyScalar(dt))*/

    // Calcula el desplazamiento basado en la velocidad constante
    const displacement = enemySpeed; 

    // Calcula la dirección del movimiento del enemigo
    const direction = new THREE.Vector3();
    direction.subVectors(player.position, enemy.position).normalize();

    // Calcula el desplazamiento en la dirección adecuada
    const movement = direction.multiplyScalar(displacement);

    // Aplica el movimiento al enemigo
    enemy.position.add(movement);

}

luisito.start()
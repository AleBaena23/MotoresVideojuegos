import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import Luisito from '/src/luisito.js'

const luisito = new Luisito()

luisito.camera.instance.position.set(8,5,40)
luisito.physics.world.gravity.set(0,-9.81,0)

const ambientLight = luisito.light.CreateAmbient('white',1)
const directionalLight = luisito.light.CreateDirectional('white', 1)

// Sombras realistas
directionalLight.position.set(10,10,10)
directionalLight.shadow.camera.near = -10
directionalLight.shadow.camera.far = 70
directionalLight.shadow.camera.top = 40
directionalLight.shadow.camera.right = 40
directionalLight.shadow.camera.bottom = -40
directionalLight.shadow.camera.left = -40

// Posiciones de los dos tipos de objetos que vamos a ver en la simulación
const ball_position = new THREE.Vector3(-8, 1, 8)
const box_position = new THREE.Vector3 (12, 1, 8)

// Creamos una pelota
const ball = luisito.createObject() 


luisito.addComponentToObject(
    ball,
    'mesh',
    luisito.mesh.CreateFromGeometry(
        new THREE.SphereGeometry(1, 32, 16),
        new THREE.MeshStandardMaterial({color: 'crimson'})
    )
)

luisito.addComponentToObject(
    ball,
    'rigidbody',
    luisito.physics.CreateBody({
        mass: 1,
        shape: new CANNON.Sphere(1)
    })
)

ball.position.set(ball_position.x, ball_position.y, ball_position.z)

// Creamos un cubo
const box1 = luisito.createObject()

luisito.addComponentToObject(
    box1,
    'mesh',
    luisito.mesh.CreateFromGeometry(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshStandardMaterial({color: "rgb(153, 51, 255)"})
    )
)

luisito.addComponentToObject(
    box1,
    'rigidbody',
    luisito.physics.CreateBody({
        mass: 0.1,
        shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1))
    })
)
// Posición primer cubo
box1.position.set(box_position.x, box_position.y, box_position.z)

// Creamos un segundo cubo
const box2 = luisito.createObject()

luisito.addComponentToObject(
    box2,
    'mesh',
    luisito.mesh.CreateFromGeometry(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshStandardMaterial({color: "rgb(102, 0, 255)"})
    )
)

luisito.addComponentToObject(
    box2,
    'rigidbody',
    luisito.physics.CreateBody({
        mass: 0.25,
        shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1))
    })
)
// Posicion segundo cubo
box2.position.set(box_position.x, box_position.y + 5, box_position.z)

// Creamos un tercer cubo
const box3 = luisito.createObject()

luisito.addComponentToObject(
    box3,
    'mesh',
    luisito.mesh.CreateFromGeometry(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshStandardMaterial({color: "rgb(102, 0, 204)"})
    )
)

luisito.addComponentToObject(
    box3,
    'rigidbody',
    luisito.physics.CreateBody({
        mass: 0.5,
        shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1))
    })
)
// Posicion segundo cubo
box3.position.set(box_position.x, box_position.y + 9, box_position.z)

// Creamos un suelo para la simulación
const floor = luisito.createObject("floor")

luisito.addComponentToObject(
    floor,
    'mesh',
    luisito.mesh.CreateFromGeometry(
        new THREE.PlaneGeometry(100,100),
        new THREE.MeshStandardMaterial({color:'darkslategray'})
    )
)

luisito.addComponentToObject(
    floor,
    "rigidbody",
    luisito.physics.CreateBody({
        mass: 0,
        shape: new CANNON.Plane()
    })
)

floor.mesh.receiveShadow = true
floor.rotateX(-Math.PI/2)

luisito.update = (dt) => {
    const input = luisito.input;
    const ballRigidbody = ball.rigidbody;
    const box1Rigidbody = box1.rigidbody;
    const box2Rigidbody = box2.rigidbody;
    const box3Rigidbody = box3.rigidbody;

    // Movimiento con las teclas de dirección
    if (input.isKeyPressed('ArrowUp')) {
        ballRigidbody.velocity.z -= 0.1;
    }
    if (input.isKeyPressed('ArrowDown')) {
        ballRigidbody.velocity.z += 0.1;
    }
    if (input.isKeyPressed('ArrowLeft')) {
        ballRigidbody.velocity.x -= 0.1;
    }
    if (input.isKeyPressed('ArrowRight')) {
        ballRigidbody.velocity.x += 0.1;
    }

    // Salto con la tecla de espacio
    if (input.isKeyPressed(' ') && ball.position.y <= 1) { //La tecla espacio se representa así
        ballRigidbody.velocity.y = 10;
    }

    // Reinicio de la escena con la tecla 'r'
    if (input.isKeyPressed('r')) {
        
        // Reset pelota 
        ball.position.set(ball_position.x, ball_position.y, ball_position.z);
        ballRigidbody.velocity.set(0, 0, 0);

        // Reset box1
        box1.position.set(box_position.x, box_position.y, box_position.z)
        box1.rotation.set(0, 0, 0)
        box1Rigidbody.velocity.set(0 ,0 ,0);

        // Reset box2
        box2.position.set(box_position.x, box_position.y + 5, box_position.z)
        box2.rotation.set(0, 0, 0)
        box2Rigidbody.velocity.set(0 ,0 ,0)

        // Reset box3
        box3.position.set(box_position.x, box_position.y + 9, box_position.z)
        box3.rotation.set(0, 0, 0)
        box3Rigidbody.velocity.set(0 ,0 ,0)
    }

    // Colisión con el suelo
  //if (ball.position.y < 1) {
  //    ball.position.y = 1;
  //    if (ballRigidbody.velocity.y < 0) {
  //        ballRigidbody.velocity.y = 0;
  //    }
  //}
}

luisito.start()
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
directionalLight.shadow.camera.near = 0
directionalLight.shadow.camera.far = 50
directionalLight.shadow.camera.top = 40
directionalLight.shadow.camera.right = 40
directionalLight.shadow.camera.bottom = -40
directionalLight.shadow.camera.left = -40

const ball = luisito.createObject()

// Constante de posición de la pelota 
const ball_position = new THREE.Vector3(-8, 1, 8)

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
        ball.position.set(ball_position.x, ball_position.y, ball_position.z);
        ballRigidbody.velocity.set(0, 0, 0);
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
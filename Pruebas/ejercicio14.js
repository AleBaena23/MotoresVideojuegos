import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import Luisito from '/src/luisito.js'

const luisito = new Luisito()

// Definimos nuestra cámara y luz de ambiente
luisito.camera.instance.position.set(300,150,300)
luisito.camera.instance.lookAt (0,0,0)
const ambientLight = luisito.light.CreateAmbient('white',3)

// Declaramos nuestra constante de gravitación universal y la lista
// que contiene los datos de nuestros cuerpos celestes
const G = 10
const initialConditions = [
    {
        color: 'red',
        mass: 100,
        radius: 4,
        position: new THREE.Vector3(),
        initialVelocity: new CANNON.Vec3()
    },

    {
        color: 'blue',
        mass: 100,
        radius: 4,
        position: new THREE.Vector3(),
        initialVelocity: new CANNON.Vec3()
    },

    {
        color: 'green',
        mass: 100,
        radius: 4,
        position: new THREE.Vector3(),
        initialVelocity: new CANNON.Vec3()
    }
]

// Definimos la lista que va a contener nuestros objetos
// con sus componentes incluidos
const celestialBodies = []

// Creamos un helper que indique el origen del mundo
const origin = luisito.createObject()
luisito.addComponentToObject(
    origin, 
    "helper",
    luisito.mesh.CreateAxesHelper(30)
);
origin.position.set(0,0,0)

// Creamos un gridhelper para visualizar más fácilmente el espacio
const gridHelper = luisito.mesh.CreateGridHelper(300, 20, 0x2c0094, 0x2c0094);

// Creamos los helpers que luego indicarán la dirección de la fuerza de los cuerpos celestes
const arrowHelper_red = luisito.mesh.CreateArrowHelper(
    new THREE.Vector3(),
    new THREE.Vector3(),
    10,
    0xFF0000
);

const arrowHelper_blue = luisito.mesh.CreateArrowHelper(
    new THREE.Vector3(),
    new THREE.Vector3(),
    10,
    0x0000FF
);

const arrowHelper_green = luisito.mesh.CreateArrowHelper(
    new THREE.Vector3(),
    new THREE.Vector3(),
    10,
    0x00FF00
);

// Un bucle que por cada cuerpo dentro de la lista de condiciones iniciales, crea un objeto
// y le asigna un componente rigidbody y finalmente lo mete en la lista de cuerpos celestes
for (const body of initialConditions)
{
    const entity = luisito.createObject();
    
    luisito.addComponentToObject(
        entity,
        'mesh',
        luisito.mesh.CreateFromGeometry(
            new THREE.SphereGeometry(body.radius, 32, 16),
            new THREE.MeshStandardMaterial({color: body.color})
        )
    );

    luisito.addComponentToObject(
        entity,
        'rigidbody',
        luisito.physics.CreateBody({
            mass: body.mass,
            shape: new CANNON.Sphere(body.radius)
        })
    );

    entity.position.copy(body.position)
    entity.rigidbody.velocity.copy(body.initialVelocity)
    celestialBodies.push(entity)
}

// Establecemos las posiciones iniciales de los cuerpos y les aplicamos una pequeña fuerza
const N = 100;

celestialBodies[0].position.set(0, 50, -N)
celestialBodies[1].position.set(-N, -12, N)
celestialBodies[2].position.set(N, -89, N)

celestialBodies[0].rigidbody.applyForce(new CANNON.Vec3(0,0,60000))
celestialBodies[1].rigidbody.applyForce(new CANNON.Vec3(46000,0,-30000))
celestialBodies[2].rigidbody.applyForce(new CANNON.Vec3(-60000,0,0))

// Iniciamos el motor
luisito.start()
luisito.update = (dt) => {

    // Apicamos una fuerza gravitatoria a cada celestial body
    for (let i = 0; i < celestialBodies.length; i++)
    {
        for (let j = i + 1; j < celestialBodies.length; j++)
        {
            const gameObjectA = celestialBodies[i]
            const gameobjectB = celestialBodies[j]

            if (gameObjectA.rigidbody && gameobjectB.rigidbody)
            {
                const gravitationalForce = luisito.physics.GenerateGravitational(
                    gameObjectA.position,
                    gameobjectB.position,
                    gameObjectA.rigidbody.mass,
                    gameobjectB.rigidbody.mass,
                    G,
                    1,
                    100
                )
                gameObjectA.rigidbody.applyForce(gravitationalForce)
                gameobjectB.rigidbody.applyForce(gravitationalForce.negate())
            }
        }
    }

    // Actualizamos los arrow helpers para que siempre den la dirección de la fuerza total
    arrowHelper_red.position.copy(celestialBodies[0].position)
    const totalForceUnitVector_red = new THREE.Vector3().copy(
        celestialBodies[0].rigidbody.force).normalize();
        arrowHelper_red.setDirection(totalForceUnitVector_red);

        arrowHelper_blue.position.copy(celestialBodies[1].position)
    const totalForceUnitVector_blue = new THREE.Vector3().copy(
        celestialBodies[1].rigidbody.force).normalize();
        arrowHelper_blue.setDirection(totalForceUnitVector_blue);

        arrowHelper_green.position.copy(celestialBodies[2].position)
    const totalForceUnitVector_green = new THREE.Vector3().copy(
        celestialBodies[2].rigidbody.force).normalize();
        arrowHelper_green.setDirection(totalForceUnitVector_green);
}
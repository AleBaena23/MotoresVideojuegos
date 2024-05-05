import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import Luisito from '/src/luisito.js'

const luisito = new Luisito()

// Configuración de la cámara cenital
const cameraHeight = 50; // Altura deseada de la cámara
const cameraDistance = 10; // Distancia desde la escena
const aspectRatio = window.innerWidth / window.innerHeight;

// Crear cámara cenital
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
camera.position.set(0, cameraHeight, cameraDistance); // Posición de la cámara
camera.lookAt(0, 0, 0); // Apuntar hacia el centro de la escena

luisito.camera.instance = camera;

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

// Crear 5 esferas adicionales
for (let i = 0; i < 250; i++) {
    const sphere = luisito.createObject();

    const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());

    luisito.addComponentToObject(
        sphere,
        'mesh',
        luisito.mesh.CreateFromGeometry(
            new THREE.SphereGeometry(1, 32, 16),
            new THREE.MeshStandardMaterial({ color: randomColor })
        )
    );
    luisito.addComponentToObject(
        sphere,
        'rigidbody',
        luisito.physics.CreateBody({
            mass: 1,
            shape: new CANNON.Sphere(1)
        })
    );

    // Posicionamiento aleatorio dentro del plano
    sphere.position.set(Math.random() * 80 - 40, 5, Math.random() * 80 - 40);
}

// Crear 7 cubos adicionales
for (let i = 0; i < 170; i++) {
    const box = luisito.createObject();

    const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());

    luisito.addComponentToObject(
        box,
        'mesh',
        luisito.mesh.CreateFromGeometry(
            new THREE.BoxGeometry(2, 2, 2),
            new THREE.MeshStandardMaterial({ color: randomColor })
        )
    );

    luisito.addComponentToObject(
        box,
        'rigidbody',
        luisito.physics.CreateBody({
            mass: 1,
            shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1))
        })
    );

    // Posicionamiento aleatorio dentro del plano
    box.position.set(Math.random() * 80 - 40, 1, Math.random() * 80 - 40);
}

//smallBall.rigidbody.velocity.set(0,0,-2)

const suelo = luisito.createObject()

luisito.addComponentToObject(
    suelo,
    'mesh',
    luisito.mesh.CreateFromGeometry(

        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshStandardMaterial({color: "sienna"})
    )
)

luisito.addComponentToObject(
    suelo,
    'rigidbody',
    luisito.physics.CreateBody({
        mass : 0,
        shape: new CANNON.Plane() // es infnito
    })
)

suelo.rotateX(-Math.PI / 2)

luisito.start()

// Crear objeto de viento
const windArea = luisito.createObject();
windArea.visible = false; // Hacer el objeto invisible

// Configurar geometría y forma del área de viento
const windGeometry = new THREE.SphereGeometry(10, 32, 32); // Esfera que define el área de influencia del viento
const windMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.1 }); // Material transparente
const windMesh = new THREE.Mesh(windGeometry, windMaterial);
windArea.add(windMesh);

// Posicionamiento del área de viento
windArea.position.set(0, 1, -3); // Puedes ajustar la posición según sea necesario

// Crear un ArrowHelper para visualizar la dirección de la fuerza del viento
const windForceArrow = new THREE.ArrowHelper(
    new THREE.Vector3(0, 0, -1), // Dirección inicial del ArrowHelper
    windArea.position, // Posición del área de viento
    10, // Longitud del ArrowHelper
    0xff0000 // Color del ArrowHelper
);

// Añadir el ArrowHelper a la escena
luisito.scene.add(windForceArrow);

// Definir la velocidad de rotación del viento (en radianes por segundo)
const windRotationSpeed = Math.PI / 4; // Por ejemplo, un cuarto de vuelta por segundo

// Definir una función para aplicar la fuerza del viento a los objetos dentro del campo de visión de la flecha
const applyWindForce = () => {
    const windForceMagnitude = 5000; // Magnitud de la fuerza del viento
    const windDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(windArea.quaternion);

    // Definir el ángulo de visión de la flecha del viento (en radianes)
    const fieldOfViewAngle = Math.PI / 16; // Por ejemplo, 45 grados (en radianes)

    // Recorre todos los objetos en la escena
    luisito.objects.forEach(object => {
        // Verificar si el objeto tiene un cuerpo rígido asociado
        if (object.rigidbody) {
            // Calcular la dirección desde el objeto hacia la fuente de viento
            const direction = object.position.clone().sub(windArea.position).normalize();

            // Calcular el ángulo entre la dirección del viento y la dirección al objeto
            const angle = windDirection.angleTo(direction);

            // Verificar si el objeto está dentro del campo de visión de la flecha del viento
            if (angle < fieldOfViewAngle) {
                // Calcular la distancia entre el objeto y la fuente de viento
                const distance = object.position.distanceTo(windArea.position);

                // if (distance <2){
                //     distance = 2
                // }

                // Calcular la fuerza de repulsión en función de la distancia
                const repulsiveForceMagnitude = windForceMagnitude / (distance * distance);

                // Aplicar la fuerza de repulsión al objeto en la dirección opuesta al viento
                const repulsiveForce = direction.multiplyScalar(repulsiveForceMagnitude);
                object.rigidbody.applyForce(repulsiveForce);
            }
        }
    });
};

// Definir una función para actualizar la posición y dirección del viento
const updateWind = (dt) => {
    // Rotar la dirección del viento con el tiempo
    const windRotationAngle = windRotationSpeed * dt;
    windArea.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), windRotationAngle));

    // Actualizar la posición de la flecha
    windForceArrow.position.copy(windArea.position);
    // Calcular la dirección del viento y actualizar la dirección de la flecha
    const windForceDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(windArea.quaternion);
    windForceArrow.setDirection(windForceDirection);
};

// Crear un punto para representar la posición de la fuente de viento
const windSourcePointGeometry = new THREE.SphereGeometry(1, 8, 8);
const windSourcePointMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const windSourcePoint = new THREE.Mesh(windSourcePointGeometry, windSourcePointMaterial);
windSourcePoint.position.copy(windArea.position);

// Añadir el punto a la escena
luisito.scene.add(windSourcePoint);

// Crear segundo objeto de viento
const windArea2 = luisito.createObject();
windArea2.visible = false; // Hacer el objeto invisible

// Configurar geometría y forma del segundo área de viento
const windGeometry2 = new THREE.SphereGeometry(10, 32, 32); // Esfera que define el área de influencia del viento
const windMaterial2 = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.1 }); // Material transparente
const windMesh2 = new THREE.Mesh(windGeometry2, windMaterial2);
windArea2.add(windMesh2);

// Posicionamiento del segundo área de viento justo encima del primero
windArea2.position.copy(windArea.position).add(new THREE.Vector3(0, 3, 0));

// Crear un segundo ArrowHelper para visualizar la dirección de la fuerza del viento
const windForceArrow2 = new THREE.ArrowHelper(
    new THREE.Vector3(0, 0, 1), // Dirección inicial del ArrowHelper (opuesta a la dirección del primer viento)
    windArea2.position, // Posición del segundo área de viento
    10, // Longitud del ArrowHelper
    0x00ff00 // Color del ArrowHelper (diferente para distinguirlo)
);

// Añadir el segundo ArrowHelper a la escena
luisito.scene.add(windForceArrow2);

// Definir una nueva función para aplicar la fuerza del segundo viento a los objetos dentro de su campo de visión
const applyWindForce2 = () => {
    const windForceMagnitude2 = 10000; // Magnitud de la fuerza del segundo viento
    const windDirection2 = new THREE.Vector3(0, 0, 1).applyQuaternion(windArea2.quaternion);

    // Definir el ángulo de visión de la flecha del segundo viento (en radianes)
    const fieldOfViewAngle2 = Math.PI / 16; // Por ejemplo, 45 grados (en radianes)

    // Recorre todos los objetos en la escena
    luisito.objects.forEach(object => {
        // Verificar si el objeto tiene un cuerpo rígido asociado
        if (object.rigidbody) {
            // Calcular la dirección desde el objeto hacia la fuente de viento
            const direction2 = object.position.clone().sub(windArea2.position).normalize();

            // Calcular el ángulo entre la dirección del segundo viento y la dirección al objeto
            const angle2 = windDirection2.angleTo(direction2);

            // Verificar si el objeto está dentro del campo de visión de la flecha del segundo viento
            if (angle2 < fieldOfViewAngle2) {
                // Calcular la distancia entre el objeto y la fuente de viento
                const distance2 = object.position.distanceTo(windArea2.position);

                // Calcular la fuerza de repulsión en función de la distancia
                const repulsiveForceMagnitude2 = windForceMagnitude2 / (distance2 * distance2);

                // Aplicar la fuerza de repulsión al objeto en la dirección opuesta al segundo viento
                const repulsiveForce2 = direction2.multiplyScalar(repulsiveForceMagnitude2);
                object.rigidbody.applyForce(repulsiveForce2);
            }
        }
    });
};

// Definir una función para actualizar la posición y dirección del segundo viento
const updateWind2 = (dt) => {
    // Rotar la dirección del segundo viento con el tiempo (en dirección opuesta)
    const windRotationAngle2 = -windRotationSpeed * dt;
    windArea2.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), windRotationAngle2));

    // Actualizar la posición de la flecha del segundo viento
    windForceArrow2.position.copy(windArea2.position);
    // Calcular la dirección del segundo viento y actualizar la dirección de la flecha
    const windForceDirection2 = new THREE.Vector3(0, 0, 1).applyQuaternion(windArea2.quaternion);
    windForceArrow2.setDirection(windForceDirection2);
};

// Llamar a la función de actualización del segundo viento en cada fotograma
luisito.update = (dt) => {
    applyWindForce(); // Aplicar fuerza del primer viento
    applyWindForce2(); // Aplicar fuerza del segundo viento
    updateWind(dt); // Actualizar dirección del primer viento
    updateWind2(dt); // Actualizar dirección del segundo viento
};

// Crear un punto para representar la posición de la fuente del segundo viento
const windSourcePointMaterial2 = new THREE.MeshBasicMaterial({ color: "blue" });
const windSourcePoint2 = new THREE.Mesh(windSourcePointGeometry, windSourcePointMaterial2);
windSourcePoint2.position.copy(windArea2.position);

// Añadir el punto del segundo viento a la escena
luisito.scene.add(windSourcePoint2);





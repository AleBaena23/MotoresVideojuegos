import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import gsap from 'gsap'; // para animaciones
import Luisito from '/src/luisito.js';

const luisito = new Luisito();
luisito.camera.instance.position.set(0, 0, 20);

const world = luisito.physics.world;
world.gravity.set(0, -8, 0);

const ambientLight = luisito.light.CreateAmbient("white", 3);
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

const playerMaterial = new CANNON.Material('playerM');
const enemyMaterial = new CANNON.Material('enemyM');

const enemyPlayerContactMaterial = new CANNON.ContactMaterial(
    playerMaterial,
    enemyMaterial,
    {
        friction: 0.1,
        restitution: 0.2
    }
);
world.addContactMaterial(enemyPlayerContactMaterial);

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

loadingManager.onStart = () => {
    console.log('Loading started');
};
loadingManager.onLoad = () => {
    console.log('Loading finished');
};

const colorTexture = textureLoader.load('/static/textures/Fondos/Fondo1.jpg');
const geometry = new THREE.BoxGeometry(1, 1, 0);

geometry.setAttribute(
    'uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2)
);

const material = new THREE.MeshStandardMaterial();
material.map = colorTexture;

const planeMesh1 = luisito.mesh.CreateFromGeometry(geometry, material);
planeMesh1.scale.set(22, 20, 20);
planeMesh1.position.set(-12, 0, 0);
luisito.scene.add(planeMesh1);

const planeMesh2 = luisito.mesh.CreateFromGeometry(geometry, material);
planeMesh2.scale.set(22, 20, 20);
planeMesh2.position.set(10, 0, 0);
luisito.scene.add(planeMesh2);

let pezModel = null;
let mixer = null;
let action = null;

luisito.assets.loadAssets([
    // Modelos
    {
        name: 'Pez',
        type: 'gltfModel',
        path: 'static/models/Pez/Pez2.glb'
    }
]);

const cubeHalfExtents = new CANNON.Vec3(1, 1, 1);
let player = luisito.createObject();
player.position.set(-10, 0, 0);

const PIPE_GAP = 7;

luisito.onAssetsLoaded = () => {
    pezModel = luisito.assets.get('Pez').scene;
    pezModel.scale.set(1, 1, 1);
    pezModel.position.set(0, -1, 0);
    pezModel.rotateY(90);

    player.add(pezModel);
    luisito.scene.add(player);

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
};

const THRUST_FORCE = 4.5;
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

    const pipeTop = luisito.createObject();
    const pipeBottom = luisito.createObject();

    const pipeTopHeight = PIPE_UPPER_LIMIT - gap / 2;
    const pipeBottomHeight = pipeHeight - gap / 2;

    const geometryTop = new THREE.BoxGeometry(1.75, pipeTopHeight, 2);
    const geometryBottom = new THREE.BoxGeometry(1.75, pipeBottomHeight, 2);
    const material = new THREE.MeshStandardMaterial({ color: 'green' });

    const meshTop = new THREE.Mesh(geometryTop, material);
    const meshBottom = new THREE.Mesh(geometryBottom, material);

    pipeTop.add(meshTop);
    pipeBottom.add(meshBottom);

    const shapeTop = new CANNON.Box(new CANNON.Vec3(1.75 / 2, pipeTopHeight / 2, 2 / 2));
    const shapeBottom = new CANNON.Box(new CANNON.Vec3(1.75 / 2, pipeBottomHeight / 2, 2 / 2));

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

    world.addBody(bodyTop);
    world.addBody(bodyBottom);

    luisito.scene.add(pipeTop);
    luisito.scene.add(pipeBottom);

    pipes.push({ top: pipeTop, bottom: pipeBottom, scored: false }); // Agregamos la propiedad 'scored'
};

const spawnPipes = () => {
    createPipe();
    setTimeout(spawnPipes, PIPE_INTERVAL * 1000);
};

const updatePipes = (dt) => {
    for (let i = pipes.length - 1; i >= 0; i--) {
        const pipe = pipes[i];
        const bodyTop = pipe.top.rigidbody;
        const bodyBottom = pipe.bottom.rigidbody;

        bodyTop.position.x -= PIPE_SPEED * dt;
        bodyBottom.position.x -= PIPE_SPEED * dt;

        if (bodyTop.position.x < -22) {
            luisito.scene.remove(pipe.top);
            world.removeBody(bodyTop);
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
            scoreElement.textContent = score.toString(); // Actualizamos la UI del puntaje
        }
    }
};

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

luisito.update = (dt) => {
    const input = luisito.input;
    if (player) {
        mixer.update(dt);
        action.play();

        if (player.rigidbody) {
            if (input.isKeyPressed('ArrowUp')) {
                pulsando = true;
                applyJumpForce();
            } else {
                pulsando = false;
            }

            checkPositionLimits();
        }
    }

    updatePipes(dt);
};

spawnPipes();

luisito.start();
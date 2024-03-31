// rendering.js
import * as THREE from 'three';
import * as motor from './motor.js';

// Función para inicializar la escena, la cámara y el renderizador
export function initRenderer() {
    const scene = new THREE.Scene();
    //const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const camera = new THREE.OrthographicCamera(-window.innerWidth / 200, window.innerWidth / 200, window.innerHeight / 200, -window.innerHeight / 200, 1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('scene-container').appendChild(renderer.domElement);

    return { scene, camera, renderer };
}

// Función para manejar el redimensionamiento de la ventana
export function handleWindowResize(camera, renderer) {
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Función para renderizar la escena
export function render(scene, camera, renderer) {
    renderer.render(scene, camera);
}

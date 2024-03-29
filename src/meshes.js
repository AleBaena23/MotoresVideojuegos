// meshes.js

import { initRenderer, render, handleWindowResize } from './rendering.js';
import { switchToNextCamera } from './camaras.js'; // Importar la función switchToNextCamera desde cameras.js

document.addEventListener('DOMContentLoaded', function() {

    const { scene, renderer } = initRenderer(); // No necesitamos la cámara aquí

    // Crear una cámara inicial
    let camera = switchToNextCamera();

    // Posicionar la cámara para que pueda ver las figuras
    camera.position.z = 10;

    // Crear geometrías para las figuras
    const cubeGeometry = new THREE.BoxGeometry();
    const cylinderGeometry = new THREE.CylinderGeometry();
    const sphereGeometry = new THREE.SphereGeometry();
    const torusGeometry = new THREE.TorusGeometry();

    // Crear materiales para las figuras
    const blueMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Azul
    const greenMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Verde
    const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Rojo
    const yellowMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Amarillo

    // Crear meshes (objetos 3D) utilizando geometrías y materiales
    const cube = new THREE.Mesh(cubeGeometry, blueMaterial); // Cubo azul
    const cylinder = new THREE.Mesh(cylinderGeometry, greenMaterial); // Cilindro verde
    const sphere = new THREE.Mesh(sphereGeometry, redMaterial); // Esfera roja
    const torus = new THREE.Mesh(torusGeometry, yellowMaterial); // Donut amarillo

    // Posicionar las figuras
    cube.position.set(-2, 0, 0);
    cylinder.position.set(2, 0, 0);
    sphere.position.set(0, 2, 0);
    torus.position.set(0, -2, 0);

    // Añadir las figuras a la escena
    scene.add(cube);
    scene.add(cylinder);
    scene.add(sphere);
    scene.add(torus);

    // Llamar a la función para renderizar la escena
    render(scene, camera, renderer);

    // Llamar a la función para manejar el redimensionamiento de la ventana
    handleWindowResize(camera, renderer);

    // Event listener para cambiar la cámara al pulsar la tecla "C"
    document.addEventListener('keydown', function(event) {
        if (event.key === 'c') {
            camera = switchToNextCamera();
            handleWindowResize(camera, renderer); // Asegurar que la cámara se redimensione correctamente
            render(scene, camera, renderer); // Renderizar la escena con la nueva cámara
            let cameraType = '';
            if (camera.isPerspectiveCamera) {
              cameraType = 'Perspectiva';
          } else if (camera.isOrthographicCamera) {
              cameraType = 'Ortográfica';
          } else {
              cameraType = 'Desconocida';
          }
            console.log('Cambiando a la siguiente cámara...');
            console.log('Posición de la cámara:', camera.position);
        }
    });
});

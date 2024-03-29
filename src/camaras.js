// camaras.js



// Definir las cámaras disponibles
const cameras = [
    // Perspectiva estándar
    new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000),
    // Ortográfica estándar
    new THREE.OrthographicCamera(-10, 10, 10, -10, 1, 1000),
    // Perspectiva con inclinación extrema hacia arriba
    new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000),
    // Perspectiva con ángulo de visión horizontal más amplio
    new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000),
];



// Índice de la cámara actual
let currentCameraIndex = 0;

// Función para cambiar a la siguiente cámara
export function switchToNextCamera() {
    currentCameraIndex = (currentCameraIndex + 1) % cameras.length;
    const newCamera = cameras[currentCameraIndex];
    newCamera.position.set(0, 0, 10); // Establecer la posición de la nueva cámara
    return newCamera;
}

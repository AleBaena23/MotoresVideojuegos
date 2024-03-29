import { startGame } from './motor.js';

// Definir una función de renderizado personalizada
function render() {
    // Lógica de renderizado del juego
    // Por ejemplo, llamar a funciones para actualizar la escena o el estado del juego
}

// Definir un controlador de eventos para la tecla presionada
function keyDownHandler(event) {
    // Lógica para manejar la tecla presionada
    // Por ejemplo:
    // if (event.key === 'Space') {
    //     // Realizar alguna acción al presionar la tecla de espacio
    // }
    console.log('Evento keydown detectado.');
}

// Definir un controlador de eventos para el clic del mouse
function mouseDownHandler(event) {
    // Lógica para manejar el clic del mouse
    // Por ejemplo:
    // const mouseX = event.clientX;
    // const mouseY = event.clientY;
    // Realizar alguna acción basada en las coordenadas del clic
    console.log('Evento mousedown detectado.');
}

// Iniciar el juego utilizando el método exportado del motor de juego
startGame(render);

// Registrar los controladores de eventos
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('mousedown', mouseDownHandler);

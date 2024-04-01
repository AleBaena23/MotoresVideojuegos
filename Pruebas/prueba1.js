import Luisito from '/src/luisito.js';

// Crear una instancia del motor Luisito
const gameEngine = new Luisito();

// Función para manejar la lógica del juego
function update(dt) {
    // Ejemplo de lógica del juego
    if (gameEngine.input.isMouseButtonPressed('left')) {
        console.log('¡Click!');
    }
}

// Establecer la función de actualización en el motor Luisito
gameEngine.update = update;

// Iniciar el motor del juego
gameEngine.start();

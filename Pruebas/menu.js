import { iniciarJuego } from './pruebaPez.js';

document.getElementById('play-button').addEventListener('click', () => {
    iniciarJuego(); // Llama a la función para iniciar el juego
    document.getElementById('menu-container').style.opacity = '0'; // Animación opcional de desvanecimiento
    setTimeout(() => {
        document.getElementById('menu-container').style.display = 'none'; // Oculta el contenedor del menú
    }, 500); // Ajusta el tiempo según la duración de la animación CSS, si aplicas una
    document.getElementById('score-container').style.display = 'block'; // Muestra el contenedor de puntuación
});

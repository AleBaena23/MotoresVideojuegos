// motor.js

export function startGame(renderFunction) {
    const GameEngine = {
        lastFrameTime: 0,
        frameCount: 0,
        lastSecondTime: 0,
        fpsDisplay: document.getElementById('fpsDisplay'),

        // Método para iniciar el juego
        start: function() {
            console.log("Iniciando el juego...");
            // Iniciar los escuchadores de eventos
            this.registerEventListeners();
            // Iniciar el bucle del juego
            this.gameLoop(performance.now());
        },

        // Método para detener el juego
        stop: function() {
            console.log("Deteniendo el juego...");
            // Detener el bucle del juego
            cancelAnimationFrame(this.animationFrameId);
            // Desregistrar los escuchadores de eventos
            this.unregisterEventListeners();
        },

        // Método para iniciar los escuchadores de eventos
        registerEventListeners: function() {
            document.addEventListener('keydown', this.keyDownHandler);
            document.addEventListener('mousedown', this.mouseDownHandler);
        },

        // Método para desregistrar los escuchadores de eventos
        unregisterEventListeners: function() {
            document.removeEventListener('keydown', this.keyDownHandler);
            document.removeEventListener('mousedown', this.mouseDownHandler);
        },

        // Manejador de eventos para la tecla presionada
        keyDownHandler: function(event) {
            // Lógica para manejar la tecla presionada
        },

        // Manejador de eventos para el clic del mouse
        mouseDownHandler: function(event) {
            // Lógica para manejar el clic del mouse
        },

        // Método para el bucle del juego
        gameLoop: function(currentTime) {
            const elapsed = currentTime - this.lastFrameTime;
            const fpsInterval = 1000 / 60;

            if (elapsed > fpsInterval) {
                this.frameCount++;

                // Lógica del juego
                // Actualización de la posición de los jugadores, detección de colisiones, etc.

                // Llamada a la función de renderizado proporcionada
                renderFunction();

                this.lastFrameTime = currentTime - (elapsed % fpsInterval);

                if (currentTime > this.lastSecondTime + 1000) {
                    const fps = this.frameCount;
                    if (this.fpsDisplay) {
                        this.fpsDisplay.textContent = `FPS: ${fps}`;
                    }
                    this.frameCount = 0;
                    this.lastSecondTime = currentTime;
                }
            }

            this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this)); // Solicitar el siguiente fotograma
        }
    };

    GameEngine.start(); // Iniciar el juego
}

export default class Input {
    constructor(luisito) {
        
        this.pressedKeys = {};
        this.mouseButtons = {};

        // Manejadores de eventos de teclado
        window.addEventListener(
            "keydown",
            (event) => {
                this._setKeyValue(event.key, true);
            }
        );
        window.addEventListener(
            "keyup",
            (event) => {
                this._setKeyValue(event.key, false);
            }
        );

        // Manejadores de eventos de ratón
        window.addEventListener(
            "mousedown",
            (event) => {
                if (event.button === 0) {
                    this.mouseButtons["left"] = true;
                } else if (event.button === 2) {
                    this.mouseButtons["right"] = true;
                }
            }
        );
        window.addEventListener(
            "mouseup",
            (event) => {
                if (event.button === 0) {
                    this.mouseButtons["left"] = false;
                } else if (event.button === 2) {
                    this.mouseButtons["right"] = false;
                }
            }
        );
    }

    _setKeyValue(key, value) {
        this.pressedKeys[key] = value;
    }

    isKeyPressed(key) {
        return this.pressedKeys[key];
    }

    isMouseButtonPressed(button) {
        return this.mouseButtons[button];
    }
}

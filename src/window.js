import { EventDispatcher } from "three";

export default class Window extends EventDispatcher{

    constructor(luisito){
        super();
        // Otras inicializaciones
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.aspectRatio = this.width / this.height
        this.pixelRatio = Math.min(window.devicePixelRatio,2)
        this.logger = luisito.logger;

        this.logger.info("Llamando a la clase Window");

        window.addEventListener('resize', () => {
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.aspectRatio = this.width / this.height
            this.pixelRatio = Math.min(window.devicePixelRatio,2)

            this.dispatchEvent({
                type: 'resize'
            })

        })
    }
}
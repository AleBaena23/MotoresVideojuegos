import { EventDispatcher } from "three";

export default class Window extends EventDispatcher{

    constructor(luisito){
        console.log("Initializing Window...");
        super();
        // Otras inicializaciones
    
        console.log("Window initialized!");
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.aspectRatio = this.width / this.height
        this.pixelRatio = Math.min(window.devicePixelRatio,2)

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
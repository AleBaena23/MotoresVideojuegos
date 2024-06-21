import * as THREE from 'three';

export default class Audio {

    constructor(luisito) {
        this.logger = luisito.logger;
        this.logger.info("Llamando a la clase Audio");
    }

    createSound(){
        const sound = new THREE.Audio(this.listener)
        return sound;
    }

}
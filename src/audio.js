import * as THREE from 'three';

export default class Audio {

    constructor(luisito) {
        this.listener = new THREE.AudioListener(this.listener); 
        this.instance = luisito.camera.instance;

        this.logger = luisito.logger;
        this.logger.info("Llamando a la clase Audio");

        this.instance.add(this.listener); 
    }

    createSound(){
        const sound = new THREE.Audio(this.listener);
        return sound;
    }
}
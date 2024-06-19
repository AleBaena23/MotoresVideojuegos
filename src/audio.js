import * as THREE from 'three';

export default class Audio {

    constructor(luisito) {
        
        // Invocamos la cámara y creamos el listener de audio
        this.camera = luisito.camera.instance;
        this.listener = new THREE.AudioListener();
        
        // Añadimos el listener a la cámara
        this.camera.add(this.listener);
    }

    createSound(){
        const sound = new THREE.Audio(this.listener)
        return sound;
    }

}
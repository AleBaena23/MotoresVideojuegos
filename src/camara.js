import * as THREE from 'three';

export default class Camera {

    constructor(luisito) {
        this.window = luisito.window;
        this.scene = luisito.scene;

        const aspect = this.window.width / this.window.height;
        const frustumSize = 20; // Puedes ajustar este valor según tus necesidades

        this.instance = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            1,
            1000
        );

        this.instance.position.set(0, 0, 10); // Ajusta la posición según tus necesidades
        this.scene.add(this.instance);
    }

    resize() {
        const aspect = this.window.width / this.window.height;
        const frustumSize = 20; // Asegúrate de que coincida con el valor usado en el constructor

        this.instance.left = frustumSize * aspect / -2;
        this.instance.right = frustumSize * aspect / 2;
        this.instance.top = frustumSize / 2;
        this.instance.bottom = frustumSize / -2;
        this.instance.updateProjectionMatrix();
    }
}

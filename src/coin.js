class Coin {
    constructor(position, radius = 1, color = 0xffff00) {
        // Crear geometría y material para la moneda (esfera amarilla por defecto)
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: color });

        // Crear la malla de la moneda
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);

        // Añadir la moneda a la escena
        luisito.scene.add(this.mesh);

        // Propiedades adicionales si es necesario (por ejemplo, físicas, efectos visuales, etc.)
        // Puedes expandir esta clase según tus necesidades
    }

    // Método para eliminar la moneda de la escena
    removeFromScene() {
        luisito.scene.remove(this.mesh);
    }

    // Método para actualizar la moneda (por ejemplo, animación, rotación, etc.)
    update(dt) {
        // Implementa la lógica de actualización si es necesaria para la moneda
    }

    // Método para obtener la posición de la moneda
    getPosition() {
        return this.mesh.position.clone();
    }
}
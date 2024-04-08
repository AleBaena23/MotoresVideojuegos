import * as THREE from 'three'

export default class Light{

    constructor(luisito){
        this.scene = luisito.scene
        this.logger = luisito.logger
        this.logger.info('Light constructor called')
    }

    CreateAmbient(color, intensity){
        const light = new THREE.AmbientLight( color, intensity ); // soft white light
        scene.add( light );
        return light;

    }

    CreateHemisphere(SkyColour, GroundColour, Intensity) {
        const HemisphereLight = new THREE.HemisphereLight( SkyColour, GroundColour, Intensity)
        this.scene.add(HemisphereLight)
        return HemisphereLight
    }

    CreateDirectional(color, intensity){
        // White directional light at half intensity shining from the top.
        const directionalLight = new THREE.DirectionalLight( color, intensity );
        scene.add( directionalLight );
        return directionalLight;
    }
    
    CreatePoint(color, intensity, distance, decay){
        const light = new THREE.PointLight( color, intensity, distance, decay); //PointLight( color : Integer, intensity : Float, distance : Number, decay : Float )
        light.position.set( 50, 50, 50 );
        scene.add( light );
        return light
    }

    // Métodos helpers de luz (los helpers tienen los colores asignados a la luz)

    /*
    Método luz indirecta (diapositiva 221 útil): la luz lanza vectores y dependiendo de la distancia del vector a la pared y el ángulo,
    el vector crea una luz con ángulo de reflexión contrario al que la luz lanza mezclando la luz original con el color
    de la pared, la mezcla de colores depende de la intensidad. Básicamente, propaga la luz.
    Se podría meter un parámetro, que comiera el método de luz indirecta, que marcara los "light bounces", es decir,
    los rebotes de luz
    
    Este método se podría implementar en las luces como un parámetro booleano (rebote) y que si la luz tiene el rebote activado,
    que llame al método de diferente forma para crear los vectores de iluminación indirecta.

    Consideración, la posición de la luz indirecta tiene que actualizarse conforme movemos la luz inicial. También, la luz rebota y
    se proyecta an una superficie contraria, con lo que quizás en vez de crear una luz justamente en la pared con la dirección contraria,
    podemos crear un vector que rebote y luego dependiendo de si su longitud es suficiente, se proyecte en la superficie que toque el vector
    indirecto. 
    */
}
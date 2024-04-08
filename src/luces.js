import * as THREE from 'three';

export default class Luz {
    
    constructor(luisito){
        // Importar escena
        // Importar logger
        // Mensaje de inicialización de debug
        // Booleano de castshadows para decidir si una luz tiene sombras o no
    }

    /*
    Método de luz directa (son todos los tipos de luz en three.js Toman parámetros de tipo color, intensidad e "indirección")

    Investigar angulación de las luces
    */

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
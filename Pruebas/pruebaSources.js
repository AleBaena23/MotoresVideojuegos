/*
    Estas son las "sources" que le vamos a meter al método loadAssets() del assetManager.
    Literalmente las importamos (import sources from './pruebaSources.js') y se las metemos
    al método previamente citado.

    En este caso, todo lo que ves son ejemplos, no hay ninguna textura ni ninguna pelota en realidad.
    Cada fuente está conformada por un nombre, un tipo y una ruta. El asset manager cogerá los parámetros
    "type" y "path" y cargará las consas conformemente. Eso sí, el tema de hacer los uvs y eso lo tenemos
    que hacer a mano, luego veré si se puede crear un módulo del motor (o una extensión del assetManager)
    para que lo haga todo automáticamente.
*/

export default[

    // //TEXTURAS PARED
    // {
    //     name: 'colorTexture',
    //     type: 'texture',
    //     path: 'static/textures/Pared/grey_cartago_02_diff_4k.jpg'
    // },
    // {
    //     name: 'aoTexture',
    //     type: 'texture',
    //     path: 'static/textures/Pared/grey_cartago_02_ao_4k.jpg'
    // },
    // {
    //     name: 'normalTexture',
    //     type: 'texture',
    //     path: 'static/textures/Pared/grey_cartago_02_nor_gl_4k.jpg'
    // },
    // {
    //     name: 'metalTexture',
    //     type: 'texture',
    //     path: 'static/textures/Pared/grey_cartago_02_arm_4k.jpg'
    // },
    // {
    //     name: 'roughTexture',
    //     type: 'texture',
    //     path: 'static/textures/Pared/grey_cartago_02_rough_4k.jpg'
    // },
    //Modelos
    {
        name: 'foxModel',
        type: 'gltfModel',
        path: 'static/models/Fox/Fox.gltf'
    },
    {
        name: 'Duck',
        type: 'gltfModel',
        path: 'static/models/Duck/Duck.gltf'
    },
    {
        name: 'Chair',
        type: 'gltfModel',
        path: 'static/models/Chair/Chair.gltf'
    },
    {
        name: 'Pez',
        type: 'gltfModel',
        path: 'static/models/Pez/Pez.gltf'
    },
    {
        name: 'Moneda',
        type: 'gltfModel',
        path: 'static/models/Coin/moneda.gltf'
    }
   
]
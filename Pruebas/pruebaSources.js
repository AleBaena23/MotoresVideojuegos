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

export default
[
{
    name: 'texturaSpecular',
    type: 'texture',
    path: '/textures/Specular.png',
},

{
    name: 'texturaColor',
    type: 'texture',
    path: '/textures/Color.png',
},

{
    name: 'pelota',
    type: 'gltfModel',
    path: '/modelos/pelota/pelota.gltf',
},
]
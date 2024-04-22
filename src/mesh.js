import * as THREE from 'three'

// Se podría implementar un booleano que en los métodos permita a los objetos tener la propiedad de proyectar sombras o no.

export default class Mesh{
    constructor(luisito){
        this.scene = luisito.scene
    
    }

    CreateAxesHelper(tamaño){
        const axesHelper = new THREE.AxesHelper(tamaño)
        this.scene.add(axesHelper)
        return axesHelper
    }

   CreateFromVertices(vertices,color){
    const geometry = new THREE.BufferGeometry()
    const positionsAttribute = new THREE.BufferAttribute(vertices,3)
    geometry.setAttribute('position', positionsAttribute)
    const material = new THREE.MeshBasicMaterial({color:color})
    const mesh = new THREE.Mesh(geometry,material)
    this.scene.add(mesh)
   } 

   CreateFromGeometry(geometry,material){
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.recieveShadow = true
    this.scene.add(mesh)
   
    return mesh
   }
}
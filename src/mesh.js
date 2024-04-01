import * as THREE from 'three'

export default class Mesh{
    constructor(luisito){
        this.scene = luisito.scene
    
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
    this.scene.add(mesh)
    return mesh
   }
}
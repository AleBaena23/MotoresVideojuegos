import * as THREE from 'three'

// Se podría implementar un booleano que en los métodos permita a los objetos tener la propiedad de proyectar sombras o no.

export default class Mesh{
    constructor(luisito){
        this.scene = luisito.scene
        this.logger = luisito.logger;

        this.logger.info("Llamando a la clase Mesh");
    
    }


    // Métodos de helpers unidos a meshes
    CreateArrowHelper(dir, origin, length, hex){
        const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
        this.scene.add(arrowHelper)
        return arrowHelper
    }

    CreateAxesHelper(tamaño){
        const axesHelper = new THREE.AxesHelper(tamaño)
        this.scene.add(axesHelper)
        return axesHelper
    }

    CreateGridHelper(size, divisions, colorCenterLine, colorGrid){
        const gridHelper = new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid)
        this.scene.add(gridHelper)
        return gridHelper
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
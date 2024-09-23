import * as THREE from 'three';
import { blocks } from './blocks';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const geometry = new THREE.BoxGeometry();

export class World extends THREE.Group {
    /**
     * @type {{
     *  id: number,
     *  instanceId: number
     * }[][][]} 
     */
    data = [];

    constructor(size = {width: 200, height: 40}){
        super();
        this.land = new THREE.Group();
        this.size = size;
    }

    generate(){
        this.loadModel();
        this.InitializeLand();
        this.generateMeshes();
    }
    
    InitializeLand(){
        this.data = [];
        for(let x=0; x<this.size.width; x++){
            const slice = [];
            for(let y=0; y<8; y++){
                const row = [];
                for(let z=0; z<this.size.width; z++){
                    row.push({
                        id: (y<7)?3:(x<10 || x>this.size.width - 10 || z<10 || z>this.size.width - 10)?3:1,
                        instanceId: null
                    });
                }
                slice.push(row);
            }
            this.data.push(slice);
        }
    }

    generateMeshes(){
        this.clear();
        const maxCount = this.size.width * this.size.width * 8;

        const meshes = {};
        Object.values(blocks)
        .filter(blockType => blockType.id !== blocks.empty.id)
        .forEach(blockType => {
            const mesh = new THREE.InstancedMesh(geometry,blockType.material,maxCount);
            mesh.name = blockType.name;
            mesh.count = 0;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            meshes[blockType.id] = mesh;
        })

        const matrix = new THREE.Matrix4();
        for(let x=0;x<this.size.width;x++){
            for(let y=0;y<8;y++){
                for(let z=0;z<this.size.width;z++){
                    const blockID = this.getBlock(x,y,z).id;

                    if(blockID===blocks.empty.id) continue;
                    
                    const mesh = meshes[blockID];
                    const instanceId = mesh.count;

                    if(!this.isBlockCovered(x,y,z)){
                        matrix.setPosition(x+0.5, y+0.5, z+0.5);
                        mesh.setMatrixAt(instanceId, matrix);
                        this.setBlockIntanceId(x,y,z,instanceId);
                        mesh.count++;
                    }
                }
            }
        }
        this.add(...Object.values(meshes));
    }

    loadModel() {
        const loader = new GLTFLoader().setPath('');
        loader.load('/12.gltf', (gltf) => {
            const model = gltf.scene;
            
            model.position.set(this.size.width / 2, 8, this.size.width / 2);
            model.scale.set(2,2,2)
            
            model.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    // if(child.parent.parent.parent.parent.name === 'Sketchfab_model_1'){
                    //     child.visible = false;
                    // }else {
                        child.visible = true; 
                        child.userData.isCollidable = true; 
                        // if(!child.parent.parent.parent.parent.name.includes('wall')){
                        // console.log(child.parent.parent.parent.parent.name);
                        // }
                    // }
                }
                });
            
                this.add(model);
            });
    }

    /**
     * @param {number}  x
     * @param {number}  y
     * @param {number}  z
     * @returns {{id: number, instanceId: number}}
     */
    getBlock(x, y, z){
        if(this.inBounds(x,y,z)){
            return this.data[x][y][z];
        }else{
            return null;
        }
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} instanceId
     */
    setBlockIntanceId(x, y, z, instanceId){
        if(this.inBounds(x,y,z)){
            return this.data[x][y][z].instanceId = instanceId;
        }
    }
    
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {boolean}
     */
    inBounds(x,y,z){
        if(x>=0 && x<this.size.width && 
            y>=0 && y<8 && z>=0 
            && z<this.size.width){
                return true;
            }else{
                return false;
            }
        }
        
        /**
         * @param {number} x
         * @param {number} y
         * @param {number} z
         * @returns {boolean}
         */
        isBlockCovered(x,y,z){
            const up = this.getBlock(x,y+1,z)?.id ?? blocks.empty.id;
            const down = this.getBlock(x,y-1,z)?.id ?? blocks.empty.id;
            const left = this.getBlock(x-1,y,z)?.id ?? blocks.empty.id;
            const right = this.getBlock(x+1,y,z)?.id ?? blocks.empty.id;
            const front = this.getBlock(x,y,z+1)?.id ?? blocks.empty.id;
            const back = this.getBlock(x,y,z-1)?.id ?? blocks.empty.id;

            if(up===blocks.empty.id || down===blocks.empty.id || left===blocks.empty.id || right===blocks.empty.id || front===blocks.empty.id || back===blocks.empty.id){
                return false;
            }else{
                return true;
            }
        }
}
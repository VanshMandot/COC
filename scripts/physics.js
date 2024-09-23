import * as THREE from 'three';

export class Physics {
    constructor() {
        
    }

    /**
     * @param {number} dt
     * @param {Player} player
     * @param {World} world
     */
    update(player, world) {
        this.detectCollisions(player, world);
    }

    /**
     * @param {Player} player
     * @param {World} world
     */
    detectCollisions(player, world) {
        const collisions = this.possibilities(player, world);
        
        collisions.forEach(collision => {
            const box = new THREE.Box3().setFromObject(collision);
            this.resolveCollision(player, box);
        });
    }
    
    /**
     * @param {Player} player
     * @param {World} world
     * @returns {THREE.Mesh[]}
     */
    possibilities(player, world) {
        const collisions = [];

        const minX = Math.floor(player.position.x - player.radius);
        const maxX = Math.ceil(player.position.x + player.radius);
        const minY = Math.floor(player.position.y - player.height);
        const maxY = Math.ceil(player.position.y);
        const minZ = Math.floor(player.position.z - player.radius);
        const maxZ = Math.ceil(player.position.z + player.radius);

        world.traverse(child => {
            if (child.isMesh && child.userData.isCollidable) {
                const box = new THREE.Box3().setFromObject(child);
                if (box.intersectsBox(new THREE.Box3(
                    new THREE.Vector3(minX, minY, minZ),
                    new THREE.Vector3(maxX, maxY, maxZ)
                ))) {
                    collisions.push(child);
                }
            }
        });

        return collisions;
    }

    /**
     * @param {Player} player
     * @param {THREE.Box3} box
     */
    resolveCollision(player, box) {
        const playerBox = new THREE.Box3().setFromCenterAndSize(
            player.position,
            new THREE.Vector3(player.radius * 2, player.height, player.radius * 2)
        );
    
        if (playerBox.intersectsBox(box)) {
            const closestPoint = this.getClosestPoint(player.position, box);
            const direction = new THREE.Vector3().subVectors(player.position, closestPoint).normalize();
    
            const push = player.radius + 0.2;  
    
            player.position.copy(closestPoint).add(direction.multiplyScalar(push));

            const overlapX = Math.abs(player.position.x - closestPoint.x);
            const overlapZ = Math.abs(player.position.z - closestPoint.z);

            player.position.y = 9.75; 
    
            if (overlapX > overlapZ) {
                player.velocity.x = 0;  
            } else if (overlapZ > overlapX) {
                player.velocity.z = 0; 
            } else {
                player.velocity.x = 0;
                player.velocity.z = 0;
            }
        }
    }   

    /**
     * @param {THREE.Vector3} point 
     * @param {THREE.Box3} box 
     */
    getClosestPoint(point, box) {
        const closestPoint = new THREE.Vector3();
    
        closestPoint.x = Math.max(box.min.x, Math.min(point.x, box.max.x));
        closestPoint.y = Math.max(box.min.y, Math.min(point.y, box.max.y));
        closestPoint.z = Math.max(box.min.z, Math.min(point.z, box.max.z));
    
        return closestPoint;
    }

}

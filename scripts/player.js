import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export class Player {
    radius = 0.5;
    height = 1.75;
    maxSpeed = 20;
    input = new THREE.Vector3();
    velocity = new THREE.Vector3();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
    controls = new PointerLockControls(this.camera, document.body);

    constructor(scene) {
        this.camera.position.set(100, 9.75, 130);
        scene.add(this.camera);

        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));

        this.boundsHelper = new THREE.Mesh(
            new THREE.CylinderGeometry(this.radius, this.radius, this.height, 16),
            new THREE.MeshBasicMaterial({ wireframe: true })
        );
        // scene.add(this.boundsHelper);
    }

    applyInputs(dt) {
        if (this.controls.isLocked) {
            this.velocity.x = this.input.x;
            this.velocity.z = this.input.z;

            this.controls.moveRight(this.velocity.x * dt);
            this.controls.moveForward(this.velocity.z * dt);

            document.getElementById('player-position').innerHTML = this.toString();
        }
    }

    updateBoundsHelper() {
        this.boundsHelper.position.copy(this.position);
        this.boundsHelper.position.y -= this.height / 2;
    }

    /**
     * @type {THREE.Vector3}
     */
    get position() {
        return this.camera.position;
    }

    /**
     * @param {KeyboardEvent} event
     */
    onKeyDown(event) {
        if (!this.controls.isLocked) {
            this.controls.lock();
            console.log('Locked');
        }

        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.input.z = this.maxSpeed; 
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.input.x = -this.maxSpeed; 
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.input.z = -this.maxSpeed; 
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.input.x = this.maxSpeed; 
                break;
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    onKeyUp(event) {
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.input.z = 0;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.input.x = 0;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.input.z = 0;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.input.x = 0;
                break;
        }
    }

    /**
     * @returns {string}
     */
    toString() {
        let str = '';
        str += `X: ${this.position.x.toFixed(3)} `;
        str += `Z: ${this.position.z.toFixed(3)} `;
        return str;
    }
}

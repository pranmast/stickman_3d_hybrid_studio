// core/Scene.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export class SceneManager {

    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = null;
        this.THREE = THREE;
    }

    async init() {

        console.log("Initializing SceneManager...");

        this.clock = new THREE.Clock();

        this.scene = new this.THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 1.8, 4);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        const container = document.getElementById("scene");
        container.appendChild(this.renderer.domElement);

        const light = new THREE.DirectionalLight(0xffffff, 1.2);
        light.position.set(3, 5, 2);
        this.scene.add(light);

        window.addEventListener("resize", () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }

    add(object) {
        this.scene.add(object);
    }
}

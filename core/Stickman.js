// core/Stickman.js
// Simple hybrid stickman: 2D canvas drawn on a THREE plane (billboard) + basic 3D joint markers

import * as THREE from "../libs/three.module.js";

export class Stickman {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.options = options;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Canvas texture for 2D stickman
    this.canvas = document.createElement("canvas");
    this.canvas.width = 512;
    this.canvas.height = 512;
    this.ctx = this.canvas.getContext("2d");

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.minFilter = THREE.LinearFilter;
    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.0, 2.0),
      new THREE.MeshBasicMaterial({ map: this.texture, transparent: true })
    );
    this.group.add(this.plane);

    // Simple joint markers in 3D for interactions
    this.joints = {};
    const jointGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const jointMat = new THREE.MeshBasicMaterial({ color: 0xff5555 });

    ["head", "neck", "shoulderL", "shoulderR", "hip", "handL", "handR", "footL", "footR"].forEach((name) => {
      const m = new THREE.Mesh(jointGeo, jointMat);
      this.group.add(m);
      this.joints[name] = m;
    });

    // Pose (numeric)
    this.pose = {
      head: { x: 0, y: -0.6 },
      body: { x: 0, y: 0 },
      leftArm: { x: -0.6, y: -0.1 },
      rightArm: { x: 0.6, y: -0.1 },
      leftLeg: { x: -0.25, y: 0.9 },
      rightLeg: { x: 0.25, y: 0.9 },
      blush: false
    };

    this.draw(); // initial draw
  }

  // ...rest of file unchanged...
}

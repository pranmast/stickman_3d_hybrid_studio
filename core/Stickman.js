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

  setPose(posePatch) {
    // shallow apply
    for (const k in posePatch) {
      if (this.pose[k]) {
        Object.assign(this.pose[k], posePatch[k]);
      } else {
        this.pose[k] = posePatch[k];
      }
    }
    this.draw();
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();

    // center coord system
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    ctx.translate(cx, cy);

    // scaling to canvas
    const scale = 180;

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 8;

    // head
    ctx.beginPath();
    ctx.arc(this.pose.head.x * scale, this.pose.head.y * scale, 28, 0, Math.PI * 2);
    ctx.stroke();

    // body (head to body)
    ctx.beginPath();
    ctx.moveTo(this.pose.head.x * scale, this.pose.head.y * scale + 28);
    ctx.lineTo(this.pose.body.x * scale, this.pose.body.y * scale + 40);
    ctx.stroke();

    // arms
    ctx.beginPath();
    ctx.moveTo(this.pose.body.x * scale, this.pose.body.y * scale + 10);
    ctx.lineTo(this.pose.leftArm.x * scale, this.pose.leftArm.y * scale + 10);
    ctx.moveTo(this.pose.body.x * scale, this.pose.body.y * scale + 10);
    ctx.lineTo(this.pose.rightArm.x * scale, this.pose.rightArm.y * scale + 10);
    ctx.stroke();

    // legs
    ctx.beginPath();
    ctx.moveTo(this.pose.body.x * scale, this.pose.body.y * scale + 40);
    ctx.lineTo(this.pose.leftLeg.x * scale, this.pose.leftLeg.y * scale + 90);
    ctx.moveTo(this.pose.body.x * scale, this.pose.body.y * scale + 40);
    ctx.lineTo(this.pose.rightLeg.x * scale, this.pose.rightLeg.y * scale + 90);
    ctx.stroke();

    // blush
    if (this.pose.blush) {
      ctx.fillStyle = "rgba(255,80,80,0.7)";
      ctx.beginPath(); ctx.arc(18, -28, 6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(-18, -28, 6, 0, Math.PI * 2); ctx.fill();
    }

    ctx.restore();

    // update texture
    this.texture.needsUpdate = true;

    // update joint markers (approximate)
    this.joints.head.position.set(this.pose.head.x, this.pose.head.y + 0.1, 0.01);
    this.joints.handL.position.set(this.pose.leftArm.x, this.pose.leftArm.y + 0.1, 0.01);
    this.joints.handR.position.set(this.pose.rightArm.x, this.pose.rightArm.y + 0.1, 0.01);
    this.joints.footL.position.set(this.pose.leftLeg.x, this.pose.leftLeg.y + 0.1, 0.01);
    this.joints.footR.position.set(this.pose.rightLeg.x, this.pose.rightLeg.y + 0.1, 0.01);
  }
}

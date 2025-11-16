
export class Stickman {

    constructor(scene, options = {}) {
        this.scene = scene;

        this.color = options.color || 0xffffff;
        this.size = options.size || 1;
        this.gender = options.gender || "neutral";

        this.group = new THREE.Group();
        this.scene.add(this.group);

        this.build(); // correct function
    }

    build() {
        // ---- HEAD ----
        const headGeo = new THREE.SphereGeometry(0.12 * this.size, 16, 16);
        const headMat = new THREE.MeshBasicMaterial({ color: this.color });
        this.head = new THREE.Mesh(headGeo, headMat);
        this.head.position.y = 1.7 * this.size;
        this.group.add(this.head);

        // ---- BODY ----
        const bodyGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.6 * this.size, 8);
        const bodyMat = new THREE.MeshBasicMaterial({ color: this.color });
        this.body = new THREE.Mesh(bodyGeo, bodyMat);
        this.body.position.y = 1.3 * this.size;
        this.group.add(this.body);

        // ---- ARMS ----
        const armGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.45 * this.size, 8);

        this.leftArm = new THREE.Mesh(armGeo, bodyMat);
        this.rightArm = new THREE.Mesh(armGeo, bodyMat);

        this.leftArm.position.set(-0.25 * this.size, 1.45 * this.size, 0);
        this.rightArm.position.set(0.25 * this.size, 1.45 * this.size, 0);

        this.leftArm.rotation.z = Math.PI / 2;
        this.rightArm.rotation.z = Math.PI / 2;

        this.group.add(this.leftArm);
        this.group.add(this.rightArm);

        // ---- LEGS ----
        const legGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.6 * this.size, 8);

        this.leftLeg = new THREE.Mesh(legGeo, bodyMat);
        this.rightLeg = new THREE.Mesh(legGeo, bodyMat);

        this.leftLeg.position.set(-0.15 * this.size, 0.7 * this.size, 0);
        this.rightLeg.position.set(0.15 * this.size, 0.7 * this.size, 0);

        this.group.add(this.leftLeg);
        this.group.add(this.rightLeg);
    }

    setPose(pose) {
        if (!pose) return;

        if (pose.leftArm) this.leftArm.rotation.x = pose.leftArm;
        if (pose.rightArm) this.rightArm.rotation.x = pose.rightArm;
        if (pose.leftLeg) this.leftLeg.rotation.x = pose.leftLeg;
        if (pose.rightLeg) this.rightLeg.rotation.x = pose.rightLeg;
    }

    setPosition(x, y, z = 0) {
        this.group.position.set(x, y, z);
    }
}

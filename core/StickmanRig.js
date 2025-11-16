// StickmanRig.js
// Builds a full 3D hybrid stickman (simple geometry + rigged joints)

export class StickmanRig {

    constructor(scene) {
        this.scene = scene;

        // Bone references
        this.bones = {};

        this.group = new THREE.Group();
        scene.add(this.group);

        this.build();
    }

    build() {
        const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const jointMat = new THREE.MeshBasicMaterial({ color: 0xff5555 });

        const limbRadius = 3;
        const jointRadius = 5;
        const segLength = 40;

        // Helper to create limbs
        const makeLimb = (name, y1, y2) => {
            const geom = new THREE.CylinderGeometry(limbRadius, limbRadius, Math.abs(y2 - y1), 8);
            const limb = new THREE.Mesh(geom, mat);
            limb.position.set(0, (y1 + y2) / 2, 0);
            this.group.add(limb);
            this.bones[name] = limb;
        };

        // Helper for joints
        const makeJoint = (name, y) => {
            const g = new THREE.SphereGeometry(jointRadius, 12, 12);
            const j = new THREE.Mesh(g, jointMat);
            j.position.set(0, y, 0);
            this.group.add(j);
            this.bones[name] = j;
        };

        // Spine + head
        makeLimb("spine", 40, 120);
        makeJoint("neck", 120);
        makeJoint("head", 150);

        // Arms
        makeJoint("shoulder_L", 110);
        makeJoint("shoulder_R", 110);

        makeLimb("arm_L", 110, 60);
        makeLimb("arm_R", 110, 60);

        makeJoint("hand_L", 50);
        makeJoint("hand_R", 50);

        // Legs
        makeJoint("hip", 40);

        makeLimb("leg_L", 40, 0);
        makeLimb("leg_R", 40, 0);

        makeJoint("foot_L", -10);
        makeJoint("foot_R", -10);

        // Default position
        this.group.position.y = 0;
    }

    setPose(poseData) {
        for (const bone in poseData) {
            if (this.bones[bone]) {
                const rot = poseData[bone];
                this.bones[bone].rotation.set(rot.x, rot.y, rot.z);
            }
        }
    }
}

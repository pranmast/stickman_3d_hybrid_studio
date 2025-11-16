// core/CameraSystem.js
// Cinematic motion paths for camera (orbit, follow, drift, static, zoom)

export default class CameraSystem {
    constructor(camera, target) {
        this.camera = camera;
        this.target = target;

        this.mode = "orbit";
        this.time = 0;

        this.paths = {
            orbit: t => {
                const r = 4;
                camera.position.x = Math.cos(t) * r;
                camera.position.z = Math.sin(t) * r;
                camera.position.y = 2;
                camera.lookAt(target);
            },
            follow: t => {
                camera.position.lerp(
                    new THREE.Vector3(
                        target.position.x - 2,
                        target.position.y + 1,
                        target.position.z + 2
                    ),
                    0.05
                );
                camera.lookAt(target.position);
            },
            drift: t => {
                camera.position.x += Math.sin(t * 0.2) * 0.01;
                camera.position.y += Math.cos(t * 0.2) * 0.01;
                camera.lookAt(target.position);
            },
            static: t => {
                camera.lookAt(target.position);
            },
            zoom: t => {
                camera.position.lerp(
                    new THREE.Vector3(
                        target.position.x,
                        target.position.y + 1,
                        target.position.z + 1.4
                    ),
                    0.03
                );
                camera.lookAt(target.position);
            }
        };
    }

    setCameraPath(name) {
        this.mode = name;
    }

    update(dt) {
        this.time += dt;
        const fn = this.paths[this.mode];
        if (fn) fn(this.time);
    }
}

// StickmanAnimator.js
// Controls animation playback & interpolates pose keyframes

export class StickmanAnimator {

    constructor(rig) {
        this.rig = rig;

        this.keyframes = [];
        this.time = 0;
        this.duration = 1;
        this.playing = false;
    }

    loadKeyframes(frames) {
        this.keyframes = frames;
        this.duration = frames[frames.length - 1].time;
        this.time = 0;
    }

    play() {
        this.playing = true;
    }

    pause() {
        this.playing = false;
    }

    stop() {
        this.playing = false;
        this.time = 0;
        if (this.keyframes.length > 0) {
            this.applyPose(this.keyframes[0].pose);
        }
    }

    update(delta) {
        if (!this.playing || this.keyframes.length < 2) return;

        this.time += delta;

        // Loop
        if (this.time > this.duration) {
            this.time = 0;
        }

        // Find keyframe pair
        let k1 = this.keyframes[0];
        let k2 = this.keyframes[this.keyframes.length - 1];

        for (let i = 0; i < this.keyframes.length - 1; i++) {
            if (this.time >= this.keyframes[i].time && this.time <= this.keyframes[i + 1].time) {
                k1 = this.keyframes[i];
                k2 = this.keyframes[i + 1];
                break;
            }
        }

        const t = (this.time - k1.time) / (k2.time - k1.time);
        const pose = this.lerpPose(k1.pose, k2.pose, t);

        this.applyPose(pose);
    }

    applyPose(pose) {
        this.rig.setPose(pose);
    }

    lerpPose(p1, p2, t) {
        const p = {};
        for (const bone in p1) {
            p[bone] = {
                x: p1[bone].x + (p2[bone].x - p1[bone].x) * t,
                y: p1[bone].y + (p2[bone].y - p1[bone].y) * t,
                z: p1[bone].z + (p2[bone].z - p1[bone].z) * t
            };
        }
        return p;
    }
}

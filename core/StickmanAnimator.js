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
        // Check if there are frames to prevent error
        if (frames.length > 0) {
            this.duration = frames[frames.length - 1].time;
        } else {
            this.duration = 0;
        }
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
            // Minor adjustment for strict time comparison
            if (this.time >= this.keyframes[i].time && this.time < this.keyframes[i + 1].time) {
                k1 = this.keyframes[i];
                k2 = this.keyframes[i + 1];
                break;
            }
        }
        
        // Handle case where duration is 0 (shouldn't happen with keyframes.length < 2 check, but safe)
        const timeDiff = k2.time - k1.time;
        if (timeDiff === 0) {
            this.applyPose(k1.pose);
            return;
        }

        const t = (this.time - k1.time) / timeDiff;
        const pose = this.lerpPose(k1.pose, k2.pose, t);

        this.applyPose(pose);
    }

    applyPose(pose) {
        this.rig.setPose(pose);
    }

    /**
     * Correctly performs linear interpolation between two poses (p1 and p2) by
     * safely merging and interpolating all properties present in either pose.
     */
    lerpPose(p1, p2, t) {
        const p = {};
        
        // 1. Get all unique bone names present in either p1 or p2
        const allBones = new Set([...Object.keys(p1), ...Object.keys(p2)]);

        for (const bone of allBones) {
            const b1 = p1[bone] || {}; // Use empty object if bone not in p1
            const b2 = p2[bone] || {}; // Use empty object if bone not in p2
            
            p[bone] = {};

            // 2. Iterate over all axis properties (x, y, z) that might exist
            const axes = new Set([...Object.keys(b1), ...Object.keys(b2)]);

            for (const axis of axes) {
                // Get the value, defaulting to 0 if the bone/axis wasn't defined in the pose
                const val1 = b1[axis] || 0;
                const val2 = b2[axis] || 0;
                
                // Linear Interpolation (p1 + (p2 - p1) * t)
                p[bone][axis] = val1 + (val2 - val1) * t;
            }
        }
        return p;
    }
}

// core/Animator.js
// Simple timeline player and pose interpolator for the Stickman
export class Animator {
  constructor(stickman) {
    this.stickman = stickman;
    this.keyframes = []; // {time: sec, pose: {...}}
    this.time = 0;
    this.duration = 0;
    this.playing = false;
  }

  loadTimeline(kfs) {
    this.keyframes = kfs.slice().sort((a, b) => a.time - b.time);
    this.duration = this.keyframes.length ? this.keyframes[this.keyframes.length - 1].time : 0;
    this.time = 0;
    console.log(" loadTimeline ");
  }

  play() { this.playing = true; }
  pause() { this.playing = false; }
  seek(t) { this.time = Math.max(0, Math.min(t, this.duration)); this.applyPoseAt(this.time); }

  update(dt) {
    if (!this.playing || this.keyframes.length === 0) return;
    this.time += dt;
    if (this.time > this.duration) {
      this.time = 0; // loop
    }
    this.applyPoseAt(this.time);
  }

  applyPoseAt(t) {
    if (this.keyframes.length === 0) return;
    if (t <= this.keyframes[0].time) {
      this.stickman.setPose(this.keyframes[0].pose);
      return;
    }
    if (t >= this.keyframes[this.keyframes.length - 1].time) {
      this.stickman.setPose(this.keyframes[this.keyframes.length - 1].pose);
      return;
    }
    // find segment
    let i = 0;
    for (; i < this.keyframes.length - 1; i++) {
      if (t >= this.keyframes[i].time && t <= this.keyframes[i + 1].time) break;
    }
    const k1 = this.keyframes[i], k2 = this.keyframes[i + 1];
    const segT = (t - k1.time) / (k2.time - k1.time);
    const interpolated = this.interpolatePose(k1.pose, k2.pose, segT);
    this.stickman.setPose(interpolated);
  }

  interpolatePose(p1, p2, t) {
    const out = {};
    const keys = new Set([...Object.keys(p1), ...Object.keys(p2)]);
    keys.forEach(k => {
      const v1 = p1[k] || {}, v2 = p2[k] || {};
      out[k] = {
        x: (v1.x || 0) + ((v2.x || 0) - (v1.x || 0)) * t,
        y: (v1.y || 0) + ((v2.y || 0) - (v1.y || 0)) * t
      };
    });
    // preserve flags like blush if present in either (threshold)
    out.blush = (p1.blush || p2.blush) ? (t > 0.5 ? p2.blush : p1.blush) : false;
    return out;
  }
}

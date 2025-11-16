// core/PromptEngine.js
// Lightweight rule-based prompt -> keyframe timeline generator

import { MotionLibrary } from "./MotionLibrary.js"; // reuse earlier MotionLibrary or copy into core folder

export class PromptEngine {
  constructor() {
    this.motionLib = new MotionLibrary();
  }

  generateTimeline(prompt) {
    const parts = prompt.split(/,|then|and then|;/i).map(s => s.trim()).filter(Boolean);
    let timeline = [];
    let timeCursor = 0;

    for (const part of parts) {
      const motion = this.motionLib.findMotion(part);
      if (!motion) {
        // fallback idle
        timeline.push({ time: timeCursor, pose: {} });
        timeCursor += 0.8;
        continue;
      }

      // each keyframe in motion.keyframes maps to numeric pose using a mapping helper
      for (const kf of motion.keyframes) {
        const numericPose = this.namedPoseToNumeric(kf.pose);
        timeline.push({ time: timeCursor + kf.time, pose: numericPose });
      }
      timeCursor += motion.duration;
    }

    return timeline;
  }

  namedPoseToNumeric(named) {
    // small mapping from named short poses to numeric bone offsets (x,y)
    // you can expand this table later
    const map = {
      "step_left": { leftLeg: { x: -0.25, y: 0.8 }, rightLeg: { x: 0.25, y: 1.0 } },
      "step_right": { leftLeg: { x: -0.25, y: 1.0 }, rightLeg: { x: 0.25, y: 0.8 } },
      "swing_left": { leftArm: { x: -0.6, y: -0.2 }, rightArm: { x: 0.6, y: 0.0 } },
      "swing_right": { leftArm: { x: -0.6, y: 0.0 }, rightArm: { x: 0.6, y: -0.2 } },
      "neutral": {},
      "wrap": { leftArm: { x: -0.2, y: -0.1 }, rightArm: { x: 0.2, y: -0.1 }, blush: true },
      "hug_hold": { leftArm: { x: -0.15, y: -0.05 }, rightArm: { x: 0.15, y: -0.05 }, blush: true },
      "lean_in": { head: { x: 0, y: -0.65 } },
      "kiss": { head: { x: 0, y: -0.62 }, blush: true }
    };

    // If pose is object with named properties, convert each
    const out = {};
    for (const k in named) {
      if (typeof named[k] === "string" && map[named[k]]) {
        Object.assign(out, map[named[k]]);
      } else {
        // unknown; ignore
      }
    }
    return out;
  }
}

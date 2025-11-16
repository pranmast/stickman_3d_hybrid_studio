// Prompt2Animation.js
// Converts natural language descriptions into stickman animation keyframes.

import { MotionLibrary } from "./MotionLibrary.js";

export class Prompt2Animation {

    constructor() {
        this.motionLibrary = new MotionLibrary();
    }

    generateTimeline(prompt, rig) {

        prompt = prompt.toLowerCase();

        let timeline = [];

        // 1. Break prompt into steps
        const steps = this.splitIntoSteps(prompt);

        let currentTime = 0;

        steps.forEach(step => {
            const motion = this.motionLibrary.findMotion(step);

            if (!motion) return;

            motion.keyframes.forEach(kf => {
                timeline.push({
                    time: currentTime + kf.time,
                    pose: kf.pose
                });
            });

            currentTime += motion.duration;
        });

        return timeline;
    }

    splitIntoSteps(text) {
        return text
            .split(/,|and then|then|→|>|;/)
            .map(s => s.trim())
            .filter(s => s.length > 0);
    }
}

// MotionLibrary.js
// Library of pre-defined motions for stickman

export class MotionLibrary {

    constructor() {

        this.motions = [

            // ---------------------------------------------
            //  WALK
            // ---------------------------------------------
            {
                name: "walk",
                keywords: ["walk", "walking", "approach", "move forward"],
                duration: 2.0,
                keyframes: [
                    { time: 0.0, pose: { legs: "step_left", arms: "swing_left" } },
                    { time: 1.0, pose: { legs: "step_right", arms: "swing_right" } },
                    { time: 2.0, pose: { legs: "neutral", arms: "neutral" } }
                ]
            },

            // ---------------------------------------------
            //  RUN
            // ---------------------------------------------
            {
                name: "run",
                keywords: ["run", "running", "sprint"],
                duration: 1.5,
                keyframes: [
                    { time: 0.0, pose: { legs: "run_left", arms: "swing_left_fast" } },
                    { time: 0.8, pose: { legs: "run_right", arms: "swing_right_fast" } },
                    { time: 1.5, pose: { legs: "neutral", arms: "neutral" } }
                ]
            },

            // ---------------------------------------------
            //  HUG
            // ---------------------------------------------
            {
                name: "hug",
                keywords: ["hug", "embrace", "holds"],
                duration: 2.5,
                keyframes: [
                    { time: 0.0, pose: { arms: "open", body: "lean_forward" } },
                    { time: 1.0, pose: { arms: "wrap", body: "close" } },
                    { time: 2.5, pose: { arms: "hug_hold", body: "close" } }
                ]
            },

            // ---------------------------------------------
            //  KISS
            // ---------------------------------------------
            {
                name: "kiss",
                keywords: ["kiss", "kissing", "smooch"],
                duration: 2.0,
                keyframes: [
                    { time: 0.0, pose: { head: "lean_in", arms: "soft_touch" } },
                    { time: 1.0, pose: { head: "kiss", arms: "around" } },
                    { time: 2.0, pose: { head: "kiss_hold", arms: "around" } },
                ]
            },

            // ---------------------------------------------
            //  FLIRTY TOUCH / PLAYFUL
            // ---------------------------------------------
            {
                name: "flirt",
                keywords: ["flirt", "tease", "playful", "cute"],
                duration: 1.8,
                keyframes: [
                    { time: 0.0, pose: { head: "tilt_left", arms: "hip_one" } },
                    { time: 1.8, pose: { head: "tilt_right", arms: "hip_switch" } },
                ]
            },

            // ---------------------------------------------
            //  WAVE
            // ---------------------------------------------
            {
                name: "wave",
                keywords: ["wave", "hello", "hi"],
                duration: 1.2,
                keyframes: [
                    { time: 0.0, pose: { arms: "wave_up" } },
                    { time: 1.2, pose: { arms: "wave_down" } }
                ]
            },

            // ---------------------------------------------
            //  FIGHT
            // ---------------------------------------------
            {
                name: "fight",
                keywords: ["fight", "punch", "hit", "attack"],
                duration: 2.0,
                keyframes: [
                    { time: 0.0, pose: { arms: "guard_up", legs: "wide" } },
                    { time: 1.0, pose: { arms: "punch_left" } },
                    { time: 2.0, pose: { arms: "punch_right" } },
                ]
            },

            // ---------------------------------------------
            //  LIFT (PICK UP GIRL)
            // ---------------------------------------------
            {
                name: "lift",
                keywords: ["lift", "pick up", "carry"],
                duration: 2.8,
                keyframes: [
                    { time: 0.0, pose: { arms: "bend_down" } },
                    { time: 1.5, pose: { arms: "lift_up" } },
                    { time: 2.8, pose: { arms: "hold_carry" } },
                ]
            },

            // ---------------------------------------------
            //  SIT
            // ---------------------------------------------
            {
                name: "sit",
                keywords: ["sit", "sits", "sitting"],
                duration: 1.4,
                keyframes: [
                    { time: 0.0, pose: { legs: "bend" } },
                    { time: 1.4, pose: { legs: "sit_down" } },
                ]
            },

            // ---------------------------------------------
            //  LIE DOWN
            // ---------------------------------------------
            {
                name: "lie",
                keywords: ["lie", "sleep", "lay down"],
                duration: 2.0,
                keyframes: [
                    { time: 0.0, pose: { body: "tilt_back" } },
                    { time: 2.0, pose: { body: "lie_flat" } },
                ]
            }
        ];
    }

    // Return motion that matches step text
    findMotion(text) {
        text = text.toLowerCase();

        for (let m of this.motions) {
            for (let k of m.keywords) {
                if (text.includes(k)) {
                    return m;
                }
            }
        }
        return null;
    }
}

// core/UI.js
// UI handling for prompts, timeline, pose editor, scene controls

export default class UI {
    constructor(app) {
        this.app = app;
        this.bindElements();
        this.bindEvents();
    }

    bindElements() {
        this.promptBox = document.getElementById("promptInput");
        this.generateBtn = document.getElementById("generateBtn");
        this.playBtn = document.getElementById("playBtn");
        this.recordBtn = document.getElementById("recordBtn");
        this.timelineContainer = document.getElementById("timeline");
        this.exportBtn = document.getElementById("exportBtn");
        this.cameraSelect = document.getElementById("cameraPathSelect");
        this.posePanel = document.getElementById("posePanel");
    }

    bindEvents() {
        this.generateBtn.onclick = () => {
            const text = this.promptBox.value.trim();
            if (!text) return;
            this.app.generateFromPrompt(text);
        };

        this.playBtn.onclick = () => {
            this.app.playAnimation();
        };

        this.recordBtn.onclick = () => {
            this.app.recordAnimation();
        };

        this.exportBtn.onclick = () => {
            this.app.saveRecording();
        };

        this.cameraSelect.onchange = () => {
            this.app.cameraSystem.setCameraPath(this.cameraSelect.value);
        };
    }

    updateTimeline(keyframes) {
        this.timelineContainer.innerHTML = "";
        keyframes.forEach((k, i) => {
            const div = document.createElement("div");
            div.className = "timeline-frame";
            div.innerText = `${i}: ${k.action}`;
            div.onclick = () => this.app.seekToFrame(i);
            this.timelineContainer.appendChild(div);
        });
    }

    showPoseEditor(stickman) {
        this.posePanel.innerHTML = "";

        Object.keys(stickman.bones).forEach(bone => {
            const input = document.createElement("input");
            input.type = "range";
            input.min = "-180";
            input.max = "180";
            input.value = stickman.bones[bone].rotation;

            const label = document.createElement("label");
            label.innerText = bone;

            input.oninput = () => {
                stickman.setBoneRotation(bone, parseFloat(input.value));
            };

            const wrap = document.createElement("div");
            wrap.className = "pose-control";
            wrap.appendChild(label);
            wrap.appendChild(input);
            this.posePanel.appendChild(wrap);
        });
    }
}

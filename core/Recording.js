// core/Recording.js
// MP4/WebM export using MediaRecorder + canvas capture

export default class RecordingSystem {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.stream = canvas.captureStream(options.fps || 30);
        this.chunks = [];
        this.mediaRecorder = null;
        this.mimeType = this.getSupportedMimeType();
    }

    getSupportedMimeType() {
        const types = [
            'video/mp4;codecs=h264',
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp8',
            'video/webm'
        ];
        return types.find(t => MediaRecorder.isTypeSupported(t));
    }

    start() {
        this.chunks = [];
        this.mediaRecorder = new MediaRecorder(this.stream, {
            mimeType: this.mimeType,
            videoBitsPerSecond: 7000000
        });

        this.mediaRecorder.ondataavailable = e => {
            if (e.data.size > 0) this.chunks.push(e.data);
        };

        this.mediaRecorder.start();
    }

    stop() {
        return new Promise(resolve => {
            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.chunks, { type: this.mimeType });
                resolve(blob);
            };
            this.mediaRecorder.stop();
        });
    }

    async export(filename = "animation") {
        const blob = await this.stop();
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);

        if (this.mimeType.includes("mp4")) {
            a.download = filename + ".mp4";
        } else {
            a.download = filename + ".webm";
        }

        document.body.appendChild(a);
        a.click();
        a.remove();
    }
}

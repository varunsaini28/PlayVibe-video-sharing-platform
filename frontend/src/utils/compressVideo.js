// frontend/src/utils/compressVideo.js
export const compressVideo = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 1920,   // cap at 1080p
      maxHeight = 1080,
      videoBitrate = 2500000,  // 2.5 Mbps — good quality, small size
      audioBitrate = 128000,   // 128 kbps audio
    } = options;

    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    video.src = url;
    video.muted = true;

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);

      // Calculate scaled dimensions
      let { videoWidth: w, videoHeight: h } = video;
      if (w > maxWidth || h > maxHeight) {
        const ratio = Math.min(maxWidth / w, maxHeight / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");

      // Check if MediaRecorder supports mp4
      const mimeType = MediaRecorder.isTypeSupported("video/mp4;codecs=avc1")
        ? "video/mp4;codecs=avc1"
        : MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";

      const stream = canvas.captureStream(30); // cap at 30fps

      // Add audio from original video
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaElementSource(video);
      const dest = audioCtx.createMediaStreamDestination();
      source.connect(dest);
      dest.stream.getAudioTracks().forEach((t) => stream.addTrack(t));

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: videoBitrate,
        audioBitsPerSecond: audioBitrate,
      });

      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        audioCtx.close();
        const blob = new Blob(chunks, { type: mimeType.split(";")[0] });
        const ext = mimeType.includes("mp4") ? "mp4" : "webm";
        const compressed = new File(
          [blob],
          file.name.replace(/\.[^.]+$/, `.${ext}`),
          { type: mimeType.split(";")[0], lastModified: Date.now() }
        );
        resolve(compressed);
      };

      recorder.onerror = (e) => reject(e.error);

      // Draw frames to canvas
      const drawFrame = () => {
        if (video.paused || video.ended) {
          recorder.stop();
          return;
        }
        ctx.drawImage(video, 0, 0, w, h);
        requestAnimationFrame(drawFrame);
      };

      recorder.start(100);
      video.play().then(() => {
        drawFrame();
      });

      video.onended = () => recorder.stop();
    };

    video.onerror = () => reject(new Error("Failed to load video"));
  });
};
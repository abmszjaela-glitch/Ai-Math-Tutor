// Runs Kokoro in a background thread so the UI never freezes while speech is generated.
import { KokoroTTS } from 'kokoro-js';

const MODEL = 'onnx-community/Kokoro-82M-v1.0-ONNX';

let tts = null;
let loading = null;
let queue = Promise.resolve(); // generate one sentence at a time

const load = () => {
  if (tts) return Promise.resolve(tts);
  if (!loading) {
    loading = KokoroTTS.from_pretrained(MODEL, {
      dtype: 'q8', // small (~90MB) and reliable
      device: 'wasm',
      progress_callback: (p) => self.postMessage({ type: 'progress', progress: p }),
    })
      .then((model) => {
        tts = model;
        return tts;
      })
      .catch((err) => {
        loading = null;
        throw err;
      });
  }
  return loading;
};

self.onmessage = (e) => {
  const msg = e.data;

  if (msg.type === 'load') {
    load()
      .then(() => self.postMessage({ type: 'ready' }))
      .catch((err) => self.postMessage({ type: 'error', id: 'load', message: String(err) }));
  }

  if (msg.type === 'generate') {
    queue = queue
      .then(async () => {
        const model = await load();
        const audio = await model.generate(msg.text, { voice: msg.voice });
        self.postMessage({ type: 'audio', id: msg.id, blob: audio.toBlob() });
      })
      .catch((err) => self.postMessage({ type: 'error', id: msg.id, message: String(err) }));
  }
};
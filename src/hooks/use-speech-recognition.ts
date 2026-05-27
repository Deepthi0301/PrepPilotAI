import { useCallback, useEffect, useRef, useState } from "react";

// Minimal types for the Web Speech API (not in lib.dom)
type SRConstructor = new () => any;
function getSR(): SRConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export interface UseSpeechRecognitionResult {
  supported: boolean;
  listening: boolean;
  transcript: string;
  interim: string;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

/**
 * Web Speech API wrapper. Works in Chrome/Edge/Safari.
 * Appends final results into `transcript`. Interim results live in `interim`.
 */
export function useSpeechRecognition(opts?: { lang?: string }): UseSpeechRecognitionResult {
  const SR = getSR();
  const supported = !!SR;
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const recRef = useRef<any>(null);

  useEffect(() => () => { try { recRef.current?.stop(); } catch {} }, []);

  const start = useCallback(() => {
    if (!SR) return;
    try { recRef.current?.stop(); } catch {}
    const rec = new SR();
    rec.lang = opts?.lang ?? "en-US";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e: any) => {
      let interimChunk = "";
      let finalChunk = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalChunk += r[0].transcript;
        else interimChunk += r[0].transcript;
      }
      if (finalChunk) setTranscript((t) => (t ? t + " " : "") + finalChunk.trim());
      setInterim(interimChunk);
    };
    rec.onend = () => { setListening(false); setInterim(""); };
    rec.onerror = () => { setListening(false); setInterim(""); };
    recRef.current = rec;
    rec.start();
    setListening(true);
  }, [SR, opts?.lang]);

  const stop = useCallback(() => { try { recRef.current?.stop(); } catch {} setListening(false); }, []);
  const reset = useCallback(() => { setTranscript(""); setInterim(""); }, []);

  return { supported, listening, transcript, interim, start, stop, reset };
}
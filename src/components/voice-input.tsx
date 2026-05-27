import { Mic, MicOff, AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (next: string) => void;
  className?: string;
  label?: string;
}

/**
 * Mic button that streams Web Speech transcription into a parent string.
 * Appends to whatever is already in `value`.
 */
export function VoiceInput({ value, onChange, className, label = "Speak" }: Props) {
  const sr = useSpeechRecognition();

  useEffect(() => {
    if (sr.transcript) {
      onChange((value ? value + " " : "") + sr.transcript);
      sr.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sr.transcript]);

  if (!sr.supported) {
    return (
      <div className={cn("flex items-center gap-2 text-xs text-muted-foreground", className)}>
        <AlertCircle className="h-3.5 w-3.5" /> Voice input not supported in this browser. Try Chrome.
      </div>
    );
  }

  const toggle = () => {
    if (sr.listening) sr.stop();
    else { sr.start(); toast.info("Listening — speak naturally."); }
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Button
        type="button"
        size="sm"
        variant={sr.listening ? "default" : "outline"}
        onClick={toggle}
        className={cn(sr.listening && "bg-gradient-primary text-primary-foreground animate-pulse")}
      >
        {sr.listening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
        {sr.listening ? "Stop" : label}
      </Button>
      {sr.interim && (
        <span className="truncate text-xs italic text-muted-foreground">…{sr.interim}</span>
      )}
    </div>
  );
}
import { useState, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircleDashed, Pause, Play, Save, Square } from "lucide-react";
import type { VoiceSettings } from "@/types";

type TextToSpeechFormProps = {
  onSave: (text: string, voiceName: string, settings: VoiceSettings) => void;
};

export function TextToSpeechForm({ onSave }: TextToSpeechFormProps) {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [settings, setSettings] = useState<VoiceSettings>({
    rate: 1,
    pitch: 1,
    volume: 1,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null
  );

  const loadVoices = useCallback(() => {
    const availableVoices = window.speechSynthesis.getVoices();
    setVoices(availableVoices);
    if (availableVoices.length > 0) {
      setSelectedVoice(availableVoices[0].name);
    }
  }, []);

  useEffect(() => {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [loadVoices]);

  const createUtterance = useCallback(() => {
    const newUtterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);

    if (voice) {
      newUtterance.voice = voice;
      newUtterance.rate = settings.rate;
      newUtterance.pitch = settings.pitch;
      newUtterance.volume = settings.volume;

      newUtterance.onend = () => {
        setIsPlaying(false);
        setUtterance(null);
      };

      return newUtterance;
    }
    return null;
  }, [text, voices, selectedVoice, settings]);

  const handlePlay = useCallback(() => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      return;
    }

    if (utterance) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    } else {
      const newUtterance = createUtterance();
      if (newUtterance) {
        setUtterance(newUtterance);
        window.speechSynthesis.speak(newUtterance);
        setIsPlaying(true);
      }
    }
  }, [isPlaying, utterance, createUtterance]);

  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setUtterance(null);
  }, []);

  const handleSave = useCallback(() => {
    onSave(text, selectedVoice, settings);
    setText("");
  }, [onSave, text, selectedVoice, settings]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-x-2">
          <MessageCircleDashed className="size-5" />
          Insert Text to Convert
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Text</Label>
          <Textarea
            placeholder="Enter text to convert to speech..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Voice</Label>
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger>
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {voices.map((voice) => (
                <SelectItem key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Rate: {settings.rate.toFixed(1)}x</Label>
            <Slider
              min={0.5}
              max={2}
              step={0.1}
              value={[settings.rate]}
              onValueChange={([rate]) =>
                setSettings((prev) => ({ ...prev, rate }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Pitch: {settings.pitch.toFixed(1)}</Label>
            <Slider
              min={0.5}
              max={2}
              step={0.1}
              value={[settings.pitch]}
              onValueChange={([pitch]) =>
                setSettings((prev) => ({ ...prev, pitch }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Volume: {settings.volume.toFixed(1)}</Label>
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={[settings.volume]}
              onValueChange={([volume]) =>
                setSettings((prev) => ({ ...prev, volume }))
              }
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button onClick={handlePlay} disabled={!text}>
            {isPlaying ? <Pause /> : <Play />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button
            onClick={handleStop}
            disabled={!isPlaying}
            variant="secondary"
          >
            <Square />
            Stop
          </Button>
          <Button onClick={handleSave} disabled={!text} variant="outline">
            <Save />
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

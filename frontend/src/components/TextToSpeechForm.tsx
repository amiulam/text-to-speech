import { useState, useEffect } from "react";
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
import { Pause, Play, Save, Square } from "lucide-react";
import type { VoiceSettings } from "@/types";
import { logout } from "@/services/auth";
import { useNavigate } from "react-router";

type TextToSpeechFormProps = {
  onSave: (text: string, voiceName: string, settings: VoiceSettings) => void;
};

export function TextToSpeechForm({ onSave }: TextToSpeechFormProps) {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [settings, setSettings] = useState<VoiceSettings>({
    rate: 1,
    pitch: 1,
    volume: 1,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [_utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null
  );

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();

      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handlePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      return;
    }

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

      setUtterance(newUtterance);
      speechSynthesis.speak(newUtterance);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setUtterance(null);
  };

  const handleSave = () => {
    onSave(text, selectedVoice, settings);
    setText("");
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Insert Text to Convert</CardTitle>
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

        <div className="flex gap-2">
          <Button onClick={handlePlay} disabled={!text}>
            {isPlaying ? (
              <Pause className="mr-2 size-4" />
            ) : (
              <Play className="mr-2 size-4" />
            )}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button
            onClick={handleStop}
            disabled={!isPlaying}
            variant="secondary"
          >
            <Square className="mr-2 size-4" />
            Stop
          </Button>
          <Button onClick={handleSave} disabled={!text} variant="outline">
            <Save className="mr-2 size-4" />
            Save
          </Button>
          <Button
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
            variant="outline"
          >
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

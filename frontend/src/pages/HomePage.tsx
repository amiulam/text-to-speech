import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { TextToSpeechForm } from "@/components/TextToSpeechForm";
import { ConversionHistoryList } from "@/components/ConversionHistory";
import type { ConversionHistory, VoiceSettings } from "@/types";
import { getConversions, saveConversion } from "@/services/api";
import { useNavigate } from "react-router";

export default function HomePage() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const accessToken = cookies.get("accessToken");
  const [history, setHistory] = useState<ConversionHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [_isLoading, setIsLoading] = useState(true);
  const handleSave = async (
    text: string,
    voiceName: string,
    settings: VoiceSettings
  ) => {
    try {
      const newConversion = await saveConversion(text, voiceName, settings);
      setHistory((prev) => [newConversion, ...prev]);
    } catch (err) {
      setError("Failed to save conversion");
      console.error(err);
    }
  };

  const handleReplay = (item: ConversionHistory) => {
    const utterance = new SpeechSynthesisUtterance(item.text);
    const voice = speechSynthesis
      .getVoices()
      .find((v) => v.name === item.voiceName);

    if (voice) {
      utterance.voice = voice;
      utterance.rate = item.rate;
      utterance.pitch = item.pitch;
      utterance.volume = item.volume;
      speechSynthesis.speak(utterance);
    }
  };

  const loadConversions = async () => {
    try {
      const data = await getConversions();
      setHistory(data);
    } catch (err) {
      setError("Failed to load conversion history");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConversions();
  }, []);

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, [accessToken, navigate]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Text to Speech Converter
        </h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div className="grid gap-8 md:grid-cols-2">
          <TextToSpeechForm onSave={handleSave} />
          <ConversionHistoryList history={history} onReplay={handleReplay} />
        </div>
      </div>
    </div>
  );
}

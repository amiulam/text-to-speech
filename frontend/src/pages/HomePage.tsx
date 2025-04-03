import { useEffect, useState, useCallback } from "react";
import Cookies from "universal-cookie";
import { TextToSpeechForm } from "@/components/TextToSpeechForm";
import { ConversionHistoryList } from "@/components/ConversionHistory";
import type { ConversionHistory, VoiceSettings } from "@/types";
import { getConversions, saveConversion } from "@/services/api";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { logout } from "@/services/auth";
import { AudioLines, LogOut } from "lucide-react";
import { toast } from "sonner";

export default function HomePage() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const accessToken = cookies.get("accessToken");

  const [state, setState] = useState({
    history: [] as ConversionHistory[],
    error: null as string | null,
    isLoading: true,
  });

  const { history, error, isLoading } = state;

  const handleSave = useCallback(
    async (text: string, voiceName: string, settings: VoiceSettings) => {
      try {
        const newConversion = await saveConversion(text, voiceName, settings);
        setState((prev) => ({
          ...prev,
          history: [newConversion, ...prev.history],
          error: null,
        }));
        toast.success("Conversion record saved successfully!");
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: "Failed to save conversion",
        }));
        console.error(err);
      }
    },
    []
  );

  const handleReplay = useCallback((item: ConversionHistory) => {
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
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/login");
  }, [navigate]);

  const loadConversions = useCallback(async () => {
    try {
      const data = await getConversions();
      setState((prev) => ({
        ...prev,
        history: data,
        error: null,
        isLoading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: "Failed to load conversion history",
        isLoading: false,
      }));
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadConversions();
  }, [loadConversions]);

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, [accessToken, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex justify-center items-center mb-8 gap-x-2">
          <AudioLines className="size-8" />
          <h1 className="text-4xl font-bold">Text to Speech Converter</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          <TextToSpeechForm onSave={handleSave} />
          <ConversionHistoryList history={history} onReplay={handleReplay} />
        </div>

        <div className="flex justify-end w-full">
          <Button onClick={handleLogout} variant="outline">
            <LogOut />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

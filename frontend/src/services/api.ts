import type { ConversionHistory, VoiceSettings } from "@/types";
import Cookies from "universal-cookie";

const API_BASE_URL = "http://localhost:8080";

type ConversionData = {
  id: string;
  text: string;
  voice_name: string;
  rate: number;
  pitch: number;
  volume: number;
  created_at: string;
};

export const saveConversion = async (
  text: string,
  voiceName: string,
  settings: VoiceSettings
) => {
  const cookies = new Cookies();
  const accessToken = cookies.get("accessToken");

  const response = await fetch(`${API_BASE_URL}/conversions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${accessToken}`,
    },
    body: JSON.stringify({
      text,
      voice_name: voiceName,
      rate: settings.rate,
      pitch: settings.pitch,
      volume: settings.volume,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to save conversion");
  }

  const data = (await response.json()).data as ConversionData;

  return {
    id: data.id,
    text: data.text,
    voiceName: data.voice_name,
    rate: data.rate,
    pitch: data.pitch,
    volume: data.volume,
    timestamp: data.created_at,
  };
};

export const getConversions = async (): Promise<ConversionHistory[]> => {
  const cookies = new Cookies();
  const accessToken = cookies.get("accessToken");

  const response = await fetch(`${API_BASE_URL}/conversions`, {
    headers: {
      Authorization: `${accessToken}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch conversions");
  }

  const data = (await response.json()).data as ConversionData[];
  return data.map((item: ConversionData) => ({
    id: item.id,
    text: item.text,
    voiceName: item.voice_name,
    rate: item.rate,
    pitch: item.pitch,
    volume: item.volume,
    timestamp: item.created_at,
  }));
};

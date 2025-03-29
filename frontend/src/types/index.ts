export type VoiceSettings = {
  rate: number;
  pitch: number;
  volume: number;
};

export type ConversionHistory = VoiceSettings & {
  id: string;
  text: string;
  voiceName: string;
  timestamp: string;
};

export type ConversionRequest = {
  text: string;
  voice_name: string;
  rate: number;
  pitch: number;
  volume: number;
};

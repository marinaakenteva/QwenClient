export interface Preset {
  label: string;
  query: string;
}

// Плоский список пресетов (без привязки к модели)
export const PRESETS: Preset[] = [
  { label: "Что на фото?", query: "What is in this image?" },
  { label: "Переход", query: "Do you see a crosswalk?" },
  { label: "Светофор", query: "What color is the traffic light right now? If you don't see a traffic light, say 'I don't see it', otherwise just name the color immediately." },
  { label: "Номер транспорта", query: "What is the route number of this vehicle? If you don't see it, say 'I don't see it', otherwise just name the number." },
  { label: "Свободные места", query: "Are there any empty seats in the vehicle? Describe how I can find one." },
  { label: "Надпись на двери", query: "What is written on the door?" },
  { label: "Вход в здание", query: "Do you see an entrance to the building? If yes, help me enter." },
  { label: "Метро", query: "Do you see a subway entrance? If yes, guide me to it." },
  { label: "Куда идти?", query: "What are my options for where I can go right now?" },
  { label: "А сейчас?", query: "And now?" }
];

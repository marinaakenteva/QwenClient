export interface Preset {
  label: string;
  query: string;
}

export const PRESETS: Preset[] = [
  { label: "Что на фото?", query: "What is in this image?" },
  { 
    label: "Переход", 
    query: "Find the crosswalk and return its bbox in [xmin, ymin, xmax, ymax] format. If there is no such object, return 'nothing'. The response must contain only the coordinates or this exact word." 
  },
  { label: "Светофор", query: "What color is the traffic light right now? If you don't see a traffic light, say 'I don't see it', otherwise just name the color immediately." },
  { label: "Номер транспорта", query: "What is the route number of this vehicle? If you don't see it, say 'I don't see it', otherwise just name the number." },
  { 
    label: "Свободные места", 
    query: "Find all empty seats and return their bboxes in [xmin, ymin, xmax, ymax] format. If there are no such objects, return 'nothing'. The response must contain only the coordinates or this exact word." 
  },
  { label: "Надпись на двери", query: "What is written on the door?" },
  { 
    label: "Вход в здание", 
    query: "Find the entrance to the building and return its bbox in [xmin, ymin, xmax, ymax] format. If there is no such object, return 'nothing'. The response must contain only the coordinates or this exact word." 
  },
  { 
    label: "Метро", 
    query: "Find the subway entrance and return its bbox in [xmin, ymin, xmax, ymax] format. If there is no such object, return 'nothing'. The response must contain only the coordinates or this exact word." 
  },
  { 
    label: "Скамейка", 
    query: "Find the bench and return its bbox in [xmin, ymin, xmax, ymax] format. If there is no such object, return 'nothing'. The response must contain only the coordinates or this exact word." 
  },
  { 
    label: "Мусорный бак", 
    query: "Find the trash can and return its bbox in [xmin, ymin, xmax, ymax] format. If there is no such object, return 'nothing'. The response must contain only the coordinates or this exact word." 
  },
  { 
    label: "Ступеньки", 
    query: "Find the stairs and return their bbox in [xmin, ymin, xmax, ymax] format. If there is no such object, return 'nothing'. The response must contain only the coordinates or this exact word." 
  },
  { 
    label: "Стол", 
    query: "Find the table and return its bbox in [xmin, ymin, xmax, ymax] format. If there is no such object, return 'nothing'. The response must contain only the coordinates or this exact word." 
  }
];

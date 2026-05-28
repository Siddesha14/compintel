const LEVEL_MAP: Record<string, number> = {
    "intern": 1, "internship": 1,
    "junior": 2, "entry": 2, "fresher": 2,
    "sde1": 2, "sde-1": 2, "l3": 2, "ic1": 2,
    "sde2": 4, "sde-2": 4, "l4": 4, "ic2": 4,
    "senior": 5, "seniorengineer": 5, "l5": 5, "ic3": 5,
    "sde3": 6, "sde-3": 6, "l6": 6, "ic4": 6,
    "staff": 7, "staffengineer": 7, "l7": 7, "ic5": 7,
    "principal": 8, "principalengineer": 8, "l8": 8,
    "director": 9, "engineeringmanager": 6,
    "vp": 10, "cto": 10,
  };
  
  export function mapLevelToOrder(level: string): number {
    const key = level.toLowerCase().replace(/[\s_]/g, "");
    return LEVEL_MAP[key] ?? 3;
  }
const STRIP_SUFFIXES = [
  "india", "inc", "ltd", "limited", "pvt", "private",
  "technologies", "technology", "tech", "software",
  "solutions", "services", "global", "international",
  "group", "corp", "corporation", "co",
];
const CITY_ALIASES: Record<string, string> = {
  // Bangalore variations
  "bengaluru": "Bangalore",
  "banglore": "Bangalore",
  "bengalore": "Bangalore",
  "blr": "Bangalore",
  "bangalore": "Bangalore",
  // Hyderabad variations
  "hyd": "Hyderabad",
  "hydrabad": "Hyderabad",
  "hyderabad": "Hyderabad",
  // Mumbai variations
  "bombay": "Mumbai",
  "mum": "Mumbai",
  "mumbai": "Mumbai",
  // Delhi variations
  "newdelhi": "Delhi",
  "new delhi": "Delhi",
  "delhi": "Delhi",
  "ndl": "Delhi",
  // Pune variations
  "pune": "Pune",
  "pun": "Pune",
  // Chennai variations
  "madras": "Chennai",
  "chennai": "Chennai",
  // Gurgaon variations
  "gurugram": "Gurgaon",
  "gurgaon": "Gurgaon",
  "grg": "Gurgaon",
  // Noida
  "noida": "Noida",
};

export function normalizeCity(city: string): string {
  const key = city.toLowerCase().replace(/[^a-z]/g, "");
  return CITY_ALIASES[key] || city;
}
export function normalizeCompanyName(name: string): string {
  let normalized = name.toLowerCase().trim();
  // Remove punctuation
  normalized = normalized.replace(/['".,\/#!$%\^&\*;:{}=\-_`~()]/g, " ");
  // Remove known suffixes
  const words = normalized.split(/\s+/);
  const filtered = words.filter(w => !STRIP_SUFFIXES.includes(w));
  // Rejoin and remove non-alphanumeric
  return filtered.join("").replace(/[^a-z0-9]/g, "");
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatCompanyName(name: string): string {
  // Title case
  return name
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}
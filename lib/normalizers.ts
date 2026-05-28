export function normalizeCompanyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+(india|inc|ltd|limited|pvt|technologies|tech|software|solutions|services)\.?$/i, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
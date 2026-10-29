import fs from "fs";
import path from "path";

export interface Rom {
  version: string;
  date: string;
  changelog: string;
  downloadUrl: string;
  uploader: string;
  verified: boolean;
}

export interface Device {
  slug: string;
  name: string;
  manufacturer: string;
  schemeTag: string;
  lockType: string;
  status: string;
  roms: Rom[];
  flashingGuide: string[];
  warnings: string[];
}

const DEVICES_DIR = path.join(process.cwd(), "data", "devices");

// All device data lives as JSON files in this repo (data/devices/*.json).
// New devices/ROMs are added by opening a pull request that adds or edits a file here —
// no database, no server, no admin login needed. A maintainer reviews and merges the PR.
export function getAllDevices(): Device[] {
  const files = fs.readdirSync(DEVICES_DIR).filter((f) => f.endsWith(".json"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(DEVICES_DIR, file), "utf-8");
      return JSON.parse(raw) as Device;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getDeviceBySlug(slug: string): Device | undefined {
  return getAllDevices().find((d) => d.slug === slug);
}

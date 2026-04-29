import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "content", "use-cases.json");

export type UseCase = {
  slug: string;
  label: string;
  description: string;
  tool_slugs: string[];
};

export function getAllUseCases(): UseCase[] {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, "utf-8")) as UseCase[];
}

export function getUseCase(slug: string): UseCase | null {
  return getAllUseCases().find((uc) => uc.slug === slug) ?? null;
}

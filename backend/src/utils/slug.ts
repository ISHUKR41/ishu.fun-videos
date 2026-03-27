export function toSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

export async function uniqueSlug(
  baseSlug: string,
  exists: (candidate: string) => Promise<boolean>
): Promise<string> {
  let candidate = baseSlug;
  let counter = 2;

  while (await exists(candidate)) {
    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return candidate;
}

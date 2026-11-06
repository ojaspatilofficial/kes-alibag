// Accent- and case-insensitive matching with simple typo tolerance, used by the institution finder
// and the global search modal.

export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9ऀ-ॿ]+/g, ' ')
    .trim();

/** Damerau-free Levenshtein distance, capped for speed. */
function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      best = Math.min(best, cur[j]);
    }
    if (best > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

/**
 * Scores how well `query` matches `text` (0 = no match). Every query word must match a word in the text,
 * either as a prefix/substring or within a small edit distance (so "mahd" finds "Mahad").
 */
export function matchScore(query: string, text: string): number {
  const q = normalize(query);
  if (!q) return 1;
  const hay = normalize(text);
  if (hay.includes(q)) return 100 - Math.min(50, hay.indexOf(q));
  const words = hay.split(' ');
  let score = 0;
  for (const term of q.split(' ')) {
    if (hay.includes(term)) {
      score += 10;
      continue;
    }
    const tol = term.length >= 7 ? 2 : term.length >= 4 ? 1 : 0;
    if (tol === 0) return 0;
    const ok = words.some((w) => distance(term, w.slice(0, term.length + 1), tol) <= tol || distance(term, w, tol) <= tol);
    if (!ok) return 0;
    score += 4;
  }
  return score;
}

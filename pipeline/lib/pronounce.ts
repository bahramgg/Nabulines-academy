// Brand pronunciation fixes for TTS. We send a respelled form to the voice
// engine so it says the name correctly, then map it back to the real spelling
// for on-screen subtitles. Each entry must be a SINGLE token (no spaces) so the
// word count — and therefore the timestamp alignment — stays 1:1.
const RULES: { speech: string; display: string; re: RegExp }[] = [
  // "Nabulines" was read as "na-bu-linz"; hyphen makes "lines" read as laɪnz.
  { speech: "Nabu-lines", display: "Nabulines", re: /\bNabulines\b/gi },
];

/** Rewrite narration into what the voice engine should read. */
export function forSpeech(text: string): string {
  let out = text;
  for (const r of RULES) out = out.replace(r.re, r.speech);
  return out;
}

/** Map an aligned word back to its real spelling for subtitles. */
export function forDisplay(word: string): string {
  let out = word;
  for (const r of RULES) out = out.split(r.speech).join(r.display);
  return out;
}

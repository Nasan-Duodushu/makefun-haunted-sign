// Funniest Sign on a Haunted Server Room Door — entry program.
// Writes the one-line sign (1-120 chars) to /output/entry.txt.
// It reads like a real door sign — an instruction, then the warning — and
// the haunting is specific: the previous admin knocked, stayed, and now
// answers the tickets.
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const MAX_CHARS = 120;

function signText(): string {
  const instruction = "Do not knock.";
  const warning = "The previous admin knocked in 2019. He is still here.";
  const punch = "He answers the tickets now.";
  return [instruction, warning, punch].join(" ");
}

function checkSign(line: string): void {
  const n = [...line].length;
  if (n < 1 || n > MAX_CHARS) {
    throw new Error(`sign fails the 1-${MAX_CHARS} character gate (${n})`);
  }
  if (line.includes("\n")) {
    throw new Error("sign must be a single line");
  }
  // It must read like a sign: an imperative up front.
  if (!/^Do not knock\./.test(line)) {
    throw new Error("sign must open with the instruction");
  }
  // The haunting must be specific: the previous admin, 2019, still here.
  if (!/previous admin knocked in 2019\. He is still here\./.test(line)) {
    throw new Error("sign must carry the previous admin's fate");
  }
  // The punch lands last: he answers the tickets now.
  if (!/He answers the tickets now\.$/.test(line)) {
    throw new Error("sign must end on the ticket answering");
  }
  // Four sentences in sign order: instruction, warning, fate, punch.
  const sentences = line.split(/(?<=\.)\s+/);
  if (sentences.length !== 4 || !/^Do not knock\.$/.test(sentences[0])) {
    throw new Error("sign must be instruction plus warning plus fate plus punch");
  }
}

const line = signText();
checkSign(line);
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
mkdirSync(outDir, { recursive: true });
const target = resolve(outDir, "entry.txt");
writeFileSync(target, new TextEncoder().encode(line));
console.log(`wrote ${[...line].length} chars to ${target}`);

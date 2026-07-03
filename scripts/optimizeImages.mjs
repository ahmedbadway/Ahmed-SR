// One-off/CI utility: converts public/projects screenshots to WebP, keeping
// each output under the 200KB budget by stepping quality down until it fits.
import { readdir, unlink, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const DIR = path.resolve('public/projects');
const MAX_BYTES = 200 * 1024;
const SOURCE_EXT = /\.(png|jpe?g)$/i;

async function encodeUnder(input, quality) {
  const buffer = await sharp(input).webp({ quality }).toBuffer();
  return buffer;
}

async function convert(file) {
  const inputPath = path.join(DIR, file);
  const outputPath = path.join(DIR, file.replace(SOURCE_EXT, '.webp'));

  let quality = 82;
  let buffer = await encodeUnder(inputPath, quality);
  while (buffer.length > MAX_BYTES && quality > 40) {
    quality -= 8;
    buffer = await encodeUnder(inputPath, quality);
  }

  await sharp(buffer).toFile(outputPath);
  await unlink(inputPath);

  const { size } = await stat(outputPath);
  console.log(
    `${file} -> ${path.basename(outputPath)}  q${quality}  ${(size / 1024).toFixed(1)}KB`
  );
}

const files = (await readdir(DIR)).filter((f) => SOURCE_EXT.test(f));
for (const file of files) {
  await convert(file);
}

// One-off/CI utility for public/projects covers.
//
// 1. Converts any PNG/JPEG screenshot to WebP, cropped to the 16:10 frame the
//    Work grid renders (top-anchored, so the site's nav and hero stay in view)
//    and capped at 1600px wide. Quality steps down until the file fits the
//    200KB budget. The source PNG/JPEG is deleted afterwards.
// 2. Writes an 800px-wide `<name>-800.webp` companion for every cover that
//    lacks one, so phones download half the pixels via srcset.
import { readdir, unlink, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const DIR = path.resolve('public/projects');
const MAX_BYTES = 200 * 1024;
const SOURCE_EXT = /\.(png|jpe?g)$/i;
const SMALL_SUFFIX = '-800';

async function encodeUnder(pipeline, maxBytes) {
  let quality = 82;
  let buffer = await pipeline.clone().webp({ quality }).toBuffer();
  while (buffer.length > maxBytes && quality > 40) {
    quality -= 8;
    buffer = await pipeline.clone().webp({ quality }).toBuffer();
  }
  return { buffer, quality };
}

async function convert(file) {
  const inputPath = path.join(DIR, file);
  const outputPath = path.join(DIR, file.replace(SOURCE_EXT, '.webp'));

  const pipeline = sharp(inputPath).resize(1600, 1000, { fit: 'cover', position: 'top' });
  const { buffer, quality } = await encodeUnder(pipeline, MAX_BYTES);

  await sharp(buffer).toFile(outputPath);
  await unlink(inputPath);

  const { size } = await stat(outputPath);
  console.log(`${file} -> ${path.basename(outputPath)}  q${quality}  ${(size / 1024).toFixed(1)}KB`);
}

async function writeSmall(file) {
  const inputPath = path.join(DIR, file);
  const outputPath = path.join(DIR, file.replace(/\.webp$/, `${SMALL_SUFFIX}.webp`));
  if (existsSync(outputPath)) return;

  const pipeline = sharp(inputPath).resize({ width: 800, withoutEnlargement: true });
  const { buffer, quality } = await encodeUnder(pipeline, MAX_BYTES / 2);
  await sharp(buffer).toFile(outputPath);

  const { size } = await stat(outputPath);
  console.log(`${file} -> ${path.basename(outputPath)}  q${quality}  ${(size / 1024).toFixed(1)}KB`);
}

const sources = (await readdir(DIR)).filter((f) => SOURCE_EXT.test(f));
for (const file of sources) {
  await convert(file);
}

const covers = (await readdir(DIR)).filter(
  (f) => f.endsWith('.webp') && !f.endsWith(`${SMALL_SUFFIX}.webp`)
);
for (const file of covers) {
  await writeSmall(file);
}

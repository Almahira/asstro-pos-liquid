import sharp from "sharp";
import { readdir, unlink, stat } from "node:fs/promises";
import { join, basename, extname } from "node:path";

const ASSETS = "src/assets";
const MAX_WIDTH_LANDSCAPE = 1920;
const MAX_WIDTH_PORTRAIT = 1200;

async function main() {
  const files = await readdir(ASSETS);
  const images = files.filter(
    (f) => /\.(jpg|jpeg|png)$/i.test(f) && !/hero|react|vite/i.test(f),
  );

  if (images.length === 0) {
    console.log("Tidak ada gambar yang perlu dikompres.");
    return;
  }

  for (const file of images) {
    const src = join(ASSETS, file);
    const name = basename(file, extname(file));
    const out = join(ASSETS, `${name}.webp`);

    const meta = await sharp(src).metadata();
    const isPortrait = (meta.height ?? 0) > (meta.width ?? 0);
    const maxW = isPortrait ? MAX_WIDTH_PORTRAIT : MAX_WIDTH_LANDSCAPE;

    const before = (await stat(src)).size;
    await sharp(src)
      .resize({ width: maxW, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(out);
    const after = (await stat(out)).size;

    const ratio = (before / after).toFixed(1);
    console.log(
      `✓ ${file} → ${name}.webp  (${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB, ${ratio}× lebih kecil)`,
    );
  }

  console.log("\nSelesai. Hapus file lama dengan perintah di bawah nanti.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

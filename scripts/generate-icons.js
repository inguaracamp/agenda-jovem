const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function makeIcon(size, out) {
  const fontSize = Math.round(size * 0.36);
  const radius = Math.round(size * 0.22);
  const svg = Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="${radius}" fill="#0f766e"/>
      <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-weight="700" font-size="${fontSize}" fill="#f0fdfa">AJ</text>
    </svg>`,
  );
  await sharp(svg).png().toFile(out);
  console.log(out, fs.statSync(out).size);
}

async function main() {
  const dir = path.join(process.cwd(), "public", "icons");
  fs.mkdirSync(dir, { recursive: true });
  await makeIcon(180, path.join(dir, "apple-touch-icon.png"));
  await makeIcon(192, path.join(dir, "icon-192.png"));
  await makeIcon(512, path.join(dir, "icon-512.png"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

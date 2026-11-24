import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
const source = 'public/biswork-icon.svg';
const root = 'android/app/src/main/res';
const sizes = { mdpi:48, hdpi:72, xhdpi:96, xxhdpi:144, xxxhdpi:192 };
for (const [density,size] of Object.entries(sizes)) {
  const dir = `${root}/mipmap-${density}`;
  await mkdir(dir,{recursive:true});
  for (const name of ['ic_launcher.png','ic_launcher_round.png']) {
    await sharp(source).resize(size,size).png().toFile(`${dir}/${name}`);
  }
}
console.log('BISWORK launcher icons generated.');

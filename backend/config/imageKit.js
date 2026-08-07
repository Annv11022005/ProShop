import ImageKit from 'imagekit';
import dotenv from 'dotenv';
dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.PUBLIC_KEY_IMAGEKIT,
  privateKey: process.env.PRIVATE_KEY_IMAGEKIT,
  urlEndpoint: process.env.URL_IMAGEKIT,
});

export function hasImageKitConfig() {
  return Boolean(process.env.PRIVATE_KEY_IMAGEKIT);
}

function createFileName(originalName = 'upload') {
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `Chat-${Date.now()}-${safeName}`;
}

export async function uploadChatMedia(file) {
  const fileName = createFileName(file.originalname);

  const result = await imagekit.listFiles.upload({
    file: await toFile(file.buffer, fileName, { type: file.mimetype }),
    fileName,
    folder: '/chat',
  });

  return result.url;
}

export default { imagekit };

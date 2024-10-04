import { Plugin, Server } from "@hapi/hapi";
import * as admin from 'firebase-admin'
import Sharp from 'sharp';

export type FirebasePluginOptions = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  bucketUrl: string;
  thumbnailsFolder: string;
};

export enum ThumbnailSize {
  Original = 'original',
  Small = 'sm',
  Medium = 'md',
  Large = 'lg'
}

const FirebasePlugin: Plugin<FirebasePluginOptions> = {
  name: "Firebase",
  version: "1.0.0",
  register: async function (server: Server, options: FirebasePluginOptions) {
    console.log("Inside 'plugins/Firebase'");

    const privateKey = Buffer.alloc(options.privateKey.length, options.privateKey, 'base64').toString('utf-8');
    
    const app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: options.projectId,
        clientEmail: options.clientEmail,
        privateKey,
      }),
    });

    const getBucket = () => admin.storage(app).bucket(options.bucketUrl);

    const bucket = getBucket();

    const generateThumbnailNames = (videoUrlUID: string, imageName: string) => ({
      [ThumbnailSize.Small]: `${options.thumbnailsFolder}/${videoUrlUID}/${imageName}-${ThumbnailSize.Small}.jpg`,
      [ThumbnailSize.Medium]: `${options.thumbnailsFolder}/${videoUrlUID}/${imageName}-${ThumbnailSize.Medium}.jpg`,
      [ThumbnailSize.Large]: `${options.thumbnailsFolder}/${videoUrlUID}/${imageName}-${ThumbnailSize.Large}.jpg`,
      [ThumbnailSize.Original]: `${options.thumbnailsFolder}/${videoUrlUID}/${imageName}.jpg`
    });

    server.expose('generateThumbnailNames', generateThumbnailNames);

    server.expose('uploadThumbnails', async (url: string, videoUrlUID: string, imageName: string) => {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();

      const thumbnailNames = generateThumbnailNames(videoUrlUID, imageName);
      
      const transformer = Sharp(buffer);
      await bucket.file(thumbnailNames.original).save(
        await transformer.clone().jpeg({ mozjpeg: true }).toBuffer(),
        {
          contentType: 'image/jpeg',
        }
      );
      await bucket.file(thumbnailNames.sm).save(
        await transformer.clone().jpeg({ mozjpeg: true }).resize({ height: 100 }).toBuffer(),
        {
          contentType: 'image/jpeg',
        }
      );
      await bucket.file(thumbnailNames.md).save(
        await transformer.clone().jpeg({ mozjpeg: true }).resize({ height: 250 }).toBuffer(),
        {
          contentType: 'image/jpeg',
        }
      );
      await bucket.file(thumbnailNames.lg).save(
        await transformer.clone().jpeg({ mozjpeg: true }).resize({ height: 400 }).toBuffer(),
        {
          contentType: 'image/jpeg',
        }
      );
    });
  },
};

export default FirebasePlugin;

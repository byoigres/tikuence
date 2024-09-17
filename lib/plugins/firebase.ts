import { Plugin, Server } from "@hapi/hapi";
import * as admin from 'firebase-admin'

export type FirebasePluginOptions = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

const UrlIDPlugin: Plugin<FirebasePluginOptions> = {
  name: "Firebase",
  version: "1.0.0",
  register: async function (_server: Server, options: FirebasePluginOptions) {
    console.log("Inside 'plugins/Firebase'");

    const privateKey = Buffer.alloc(options.privateKey.length, options.privateKey, 'base64').toString('utf-8');
    
    const app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: options.projectId,
        clientEmail: options.clientEmail,
        privateKey,
      }),
    });

  },
};

export default UrlIDPlugin;

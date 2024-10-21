import { Plugin, Server } from "@hapi/hapi";
import { Sequelize, Model, Dialect } from 'sequelize';
import path from "path";
const basename = path.join(__dirname, "../models");

type SequelizePluginOptions = {
  dialect: Dialect;
  database: string;
  username: string;
  password: string;
  host: string;
  port: number;
};

const SequelizePlugin: Plugin<SequelizePluginOptions> = {
  name: "sequelize",
  version: "1.0.0",
  register: async function (server: Server, options: SequelizePluginOptions) {
    console.log({
      dialect: options.dialect,
      type: typeof options.dialect
    });

    const sequelize = new Sequelize(
      options.database,
      options.username,
      options.password,
      {
        dialect: options.dialect,
        database: options.database,
        username: options.username,
        password: options.password,
        host: options.host,
        port: options.port,
        logging: (...msg) => console.log(msg),
      }
    );

    try {
      await sequelize.authenticate();

      const modelsMeta = [
        {
          file: "social_provider",
          modelName: "SocialProvider",
        },
        {
          file: "pending_user",
          modelName: "PendingUser",
        },
        {
          file: "user_social_provider",
          modelName: "UserSocialProvider",
        },
        {
          file: "user",
          modelName: "User",
        },
        {
          file: "category",
          modelName: "Category",
        },
        {
          file: "language",
          modelName: "Language",
        },
        {
          file: "list",
          modelName: "List",
        },
        {
          file: "list_category",
          modelName: "ListCategory",
        },
        {
          file: "list_language",
          modelName: "ListLanguage",
        },
        {
          file: "author",
          modelName: "Author",
        },
        {
          file: "video",
          modelName: "Video",
        },
        {
          file: "list_video",
          modelName: "ListVideo",
        },
        {
          file: "hashtag",
          modelName: "Hashtag",
        },
        {
          file: "list_hashtag",
          modelName: "ListHashtag",
        }
      ];

      const models: Record<string, Model> = {};
      
      modelsMeta.forEach(async meta => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        models[meta.modelName] = require(path.join(basename, `${meta.file}.ts`)).initModel(sequelize)
      });

      Object.values(models).forEach((model: Model) => {
        if ("associate" in model) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (model as any).associate();
        }
      });

      server.expose('models', models);
      server.expose('sequelize', sequelize);

      // sequelize.sync({ force: true });
      console.log('Connection has been established successfully.');
    } catch (error) {
      // TODO: Stop the server when no database connection is available
      console.error('Unable to connect to the database:', error);
    }
  },
};

export default SequelizePlugin;

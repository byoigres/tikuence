import { Plugin, Server } from "@hapi/hapi";
import { Sequelize, Model } from 'sequelize';
import { Store } from "confidence";
import path from "path";
const basename = path.join(__dirname, "../models");

type PluginOptions = {
  config: Store;
};

const root: Plugin<PluginOptions> = {
  name: "plugins/sequelize",
  version: "1.0.0",
  register: async function (server: Server, { config }: PluginOptions) {
    console.log("Inside 'plugins/sequelize'");

    const sequelize = new Sequelize(
      config.get("/database/database"),
      config.get("/database/username"),
      config.get("/database/password"),
      {
        dialect: "postgres",
        database: config.get("/database/database"),
        username: config.get("/database/username"),
        password: config.get("/database/password"),
        host: config.get("/database/host"),
        port: config.get("/database/port"),
      }
    );

    try {
      await sequelize.authenticate();

      const modelsMeta = [
        {
          file: "social_providers",
          modelName: "SocialProviders",
        },
        {
          file: "pending_users",
          modelName: "PendingUsers",
        },
        {
          file: "users_social_providers",
          modelName: "UsersSocialProviders",
        },
        {
          file: "users",
          modelName: "Users",
        },
        {
          file: "categories",
          modelName: "Categories",
        },
      ];

      const models: Record<string, Model> = {};
      
      modelsMeta.forEach(meta => {
        const modelInit = require(path.join(basename, `${meta.file}.ts`)).initModel(sequelize);
        models[meta.modelName] = modelInit;
      });

      Object.values(models).forEach((model: Model) => {
        if ("associate" in model) {
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

    server.method("sequelize", () => {
      
      return sequelize;
    });
  },
};

export default root;

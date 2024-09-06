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
  name: "plugins/sequelize",
  version: "1.0.0",
  register: async function (server: Server, options: SequelizePluginOptions) {
    console.log("Inside 'plugins/sequelize'");

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
        // logging: (...msg) => console.log(msg),
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
        {
          file: "languages",
          modelName: "Languages",
        },
        {
          file: "lists",
          modelName: "Lists",
        },
        {
          file: "lists_categories",
          modelName: "ListsCategories",
        },
        {
          file: "lists_languages",
          modelName: "ListsLanguages",
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

export default SequelizePlugin;

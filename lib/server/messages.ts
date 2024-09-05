import path from 'path';
import fs from 'fs';
import { LanguageMessages } from "joi";

type PreValidationMessages = {
  types: string[];
  message: string;
};

type PreValidationFields = {
  [key: string]: PreValidationMessages[];
};

export const getJoiMessages = (configName: string) => {
  const filePath = path.join(__dirname, '..', 'config', 'messages', `${configName}.json`);

  let config: PreValidationFields = {};

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    config = JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error loading Joi messages from ${filePath}:`, error);
    throw error;
  }

  return (field: string): LanguageMessages => {
    const result: LanguageMessages = {};

    if (field in config) {
      for (const item in config[field]) {
        for (const type of config[field][item].types) {
          result[type] = config[field][item].message;
        }
      }
    }

    return result;
  };
};

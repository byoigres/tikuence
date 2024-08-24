# Tikuence

Tikuence Project

## Local development

1. Generate the `.env` file by running `cp .env.example .env`.
2. Go to https://console.cloud.google.com/apis/credentials and copy the Cliend ID and Secrets to the  `AUTH_BELL_GOOGLE_CLIENT_ID` and `AUTH_BELL_GOOGLE_CLIENT_SECRET` variables.
3. Start the containers with `docker-compose up -d`.
4. Run migrations with `npx sequelize-cli db:migrate`
5. Run seeds with `npx sequelize-cli db:seed:all`

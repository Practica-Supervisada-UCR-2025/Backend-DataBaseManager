import { Knex } from 'knex';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
      ssl: {
        ca: fs.readFileSync('digitalOcean-ca-certificate.crt').toString()
      }
    },
    migrations: {
      directory: './src/db/migrations'
    }
  }
};

export default config;

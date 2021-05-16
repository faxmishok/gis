const { Client } = require('pg');

const connectPG = () => {
  const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PASSWD,
    port: process.env.PG_PORT,
  });

  client
    .connect()
    .then(() => console.log('Postgres Connection Established'))
    .catch((err) => console.error('Connection', err.stack));

  return client;
};

module.exports = connectPG;

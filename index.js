const pg = require('pg');
const client = new pg.Client('postgres://localhost/acme_backend_db');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());

app.get('/api/things', async(req, res, next)=> {
  try {
    const SQL = `
      SELECT *
      FROM things
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  }
  catch(ex){
    next(ex);
  }
});

const setup = async()=> {
  await client.connect();
  console.log('connected to the database');
  const SQL = `
    DROP TABLE IF EXISTS things;
    CREATE TABLE things(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      is_favorite BOOLEAN
    );
    INSERT INTO things (name) VALUES ('foo');
    INSERT INTO things (name) VALUES ('bar');
    INSERT INTO things (name) VALUES ('bazz');
    INSERT INTO things (name, is_favorite) VALUES ('quq', true);
  `;
  await client.query(SQL);
  console.log('tables created and data seeded');

  const port = process.env.PORT || 3000;
  app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
  });
};

setup();

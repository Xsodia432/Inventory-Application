const { Pool } = require("pg");
require("dotenv/config");
module.exports = new Pool({
  connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:5432/message_board`,
});

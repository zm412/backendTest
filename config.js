
const dotenv = require('dotenv');
const path = require('path');
require('dotenv').config()

module.exports= {
  POSTGRES_USER : process.env.POSTGRES_USER,
  POSTGRES_PASS: process.env.POSTGRES_PASS

}

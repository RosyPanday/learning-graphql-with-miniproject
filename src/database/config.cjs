

require('dotenv').config();

module.exports={
  development:{
    'url':process.env.CONNECTION_STRING,  //sequelize-cli sometimes ignores url
    dialect:'postgres',  //talk to db using postgres
    logging:true,  //to see actual query being run on terminal
  },

  production:{
        use_env_variable: process.env.DATABASE_URL ? 'DATABASE_URL' : 'CONNECTION_STRING',
        dialect:'postgres',
        logging:false,
  }

}
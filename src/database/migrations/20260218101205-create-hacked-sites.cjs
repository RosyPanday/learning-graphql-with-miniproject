'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('table_hacked_sites',{
      id:{
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        primaryKey:true
      }, 
     siteName:{
          type:Sequelize.STRING,
          allowNull:false
     } ,
     siteDescription:{
          type:Sequelize.STRING,
          allowNull:false
     },
     siteHackedYear:{
       type:Sequelize.STRING,
       allowNull:false
     },
     hackerId:{
            type:Sequelize.UUID,
            allowNull:false,
            references:{
              model:"table_hackers",
              key:"id"
            },
     onUpdate:'CASCADE',
     onDelete:'CASCADE'

     },
     createdAt:{
        type:Sequelize.DATE,
        allowNull:false,

     },
     updatedAt:{
      type:Sequelize.DATE,
      allowNull:false
     }
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('table_hacked_sites');
  }
};

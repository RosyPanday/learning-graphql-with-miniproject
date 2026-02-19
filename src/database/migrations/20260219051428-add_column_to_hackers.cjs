'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.addColumn('table_hackers','hackerPassword',{
          type:Sequelize.STRING,
          allowNull:false,
          after:'hackerName'
     })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('table_hackers','hackerPassword')
  }
};

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('social_providers', {
      id: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.ENUM('google'),
        allowNull: false,
        unique: true,
      },
      created_at: {
        field: 'created_at',
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        field: 'updated_at',
        allowNull: false,
        type: Sequelize.DATE,
      }
    }, {
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('social_providers');
  }
};

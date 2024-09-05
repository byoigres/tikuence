'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lists_languages', {
      list_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'lists',
          key: 'id',
        },
      },
      language_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'languages',
          key: 'id',
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('lists_languages');
  }
};

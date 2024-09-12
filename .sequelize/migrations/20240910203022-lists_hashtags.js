'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('lists_hashtags', {
      list_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'lists',
          key: 'id',
        },
      },
      hashtag_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'hashtags',
          key: 'id',
        },
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('lists_hashtags');
  }
};

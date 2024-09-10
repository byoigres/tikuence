'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lists_videos', {
      list_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'lists',
          key: 'id',
        },
      },
      video_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'videos',
          key: 'id',
        },
      },
      order_id: {
        type: Sequelize.SMALLINT,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('lists_videos');
  }
};

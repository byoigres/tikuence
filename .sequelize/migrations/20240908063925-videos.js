'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('videos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      tiktok_id: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      html: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      thumbnail_name: {
        type: Sequelize.STRING(36),
        allowNull: true
      },
      thumbnail_height: {
        type: Sequelize.SMALLINT,
        allowNull: false
      },
      thumbnail_width: {
        type: Sequelize.SMALLINT,
        allowNull: false
      },
      url_uid: {
        type: Sequelize.STRING(16),
        allowNull: true,
        unique: true
      },
      author_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'authors',
          key: 'id',
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('videos');
  }
};

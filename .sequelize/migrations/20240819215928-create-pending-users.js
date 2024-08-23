'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pending_users', {
      email: {
        type: Sequelize.STRING(64),
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      provider_id: {
        type: Sequelize.SMALLINT,
        primaryKey: true,
        references: {
          model: 'social_providers',
          key: 'id',
        },
      },
      profile_id: {
        type: Sequelize.STRING(256),
        primaryKey: true,
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      token: {
        type: Sequelize.STRING(36),
        allowNull: false,
      },
      profile_picture_url: {
        type: Sequelize.STRING(256),
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pending_users');
  }
};

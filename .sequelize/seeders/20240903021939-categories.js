'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      {
        description: "Life-style",
        url_identifier: "life-style"
      },
      {
        description: "Music",
        url_identifier: "music"
      },
      {
        description: "Movies / TV",
        url_identifier: "movies-tv"
      },
      {
        description: "Video games",
        url_identifier: "video-games"
      },
      {
        description: "Travel",
        url_identifier: "travel"
      },
      {
        description: "News",
        url_identifier: "news"
      },
      {
        description: "Story-time",
        url_identifier: "story-time"
      },
      {
        description: "History",
        url_identifier: "history"
      },
      {
        description: "Science",
        url_identifier: "science"
      },
      {
        description: "Pictures",
        url_identifier: "pictures"
      },
      {
        description: "Pranks",
        url_identifier: "pranks"
      },
      {
        description: "Horror / Terror",
        url_identifier: "horror-terror"
      },
      {
        description: "Driving",
        url_identifier: "driving"
      },
      {
        description: "Tech",
        url_identifier: "tech"
      },
      {
        description: "Internet",
        url_identifier: "internet"
      },
      {
        description: "Health",
        url_identifier: "health"
      },
      {
        description: "Funny",
        url_identifier: "funny"
      },
      {
        description: "Culture",
        url_identifier: "culture"
      },
      {
        description: "Mystery",
        url_identifier: "mystery"
      },
      {
        description: "Languages",
        url_identifier: "languages"
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {

  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Courses", "duration", {
      type: Sequelize.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: "Duration should be a Number",
        },
        notNull: {
          msg: "Duration is required",
        }
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Courses", "duration");
  }
};

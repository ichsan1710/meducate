'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcryptjs')
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash("rahasia", salt)
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          userName: "John Doe",
          email: "admin@gmail.com",
          password: hash,
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userName: "user",
          email: "user@gmail.com",
          password: hash,
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    )
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {})
  }
};

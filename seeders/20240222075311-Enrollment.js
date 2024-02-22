'use strict';

/** @type {import('sequelize-cli').Migration} */
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
    const courseId = await queryInterface.rawSelect(
      "Courses",
      {
        where: {
          title: "Cardiovascular System",
        },
      },
      ["id"]
    );

    const userId = await queryInterface.rawSelect(
      "Users",
      {
        where: {
          email: "user@gmail.com",
        },
      },
      ["id"]
    );

    const enrollmentsData = [
      {
        id : "TR"+new Date().getTime(),
        user_id: userId,
        course_id: courseId,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Enrollments", enrollmentsData, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Enrollments", null, {});
  }
};

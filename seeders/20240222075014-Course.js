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
    const healthCategoryId = await queryInterface.rawSelect(
      "Categories",
      {
        where: {
          name: "Health",
        },
      },
      ["id"]
    );
    const scienceCategoryId = await queryInterface.rawSelect(
      "Categories",
      {
        where: {
          name: "Science",
        },
      },
      ["id"]
    );
    await queryInterface.bulkInsert(
      "Courses",
      [
        {
          title: "Blood & Lymphoreticular Systems",
          description: " The lymphocyte covers a continuous range of cells from a small resting reserve cell through a slightly larger dividing cell to a large cell possessing the structural apparatus required for further maturation.",
          instructor: "John Doe",
          duration: 12,
          CategoryId: scienceCategoryId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          duration: 15,
          title: "Cardiovascular System",
          description: "The cardiovascular system consists of the heart, arteries, veins, and capillaries.",
          instructor: "Jane Smith",
          CategoryId: scienceCategoryId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          duration: 1,
          title: "Vegan Diets – Benefits and Dangers",
          description: "several studies have shown that a vegan diet (VD) decreases the risk of cardiometabolic diseases.",
          instructor: "Natasya P.S",
          CategoryId: healthCategoryId,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Courses", null, {})
  }
};

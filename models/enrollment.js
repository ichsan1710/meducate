'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Enrollment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Enrollment.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user"
      });
      Enrollment.belongsTo(models.Course, {
        foreignKey: "course_id",
        as: "course"
      })
    }
  }
  Enrollment.init({
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "User ID is Required"
        }
      }
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Course ID is required"
        }
      }
    },
    status: {
      type: DataTypes.INTEGER,
    }
  }, {
    hooks: {
      beforeValidate: (instance, option) => {
        console.log("hook run");

        instance.id = "TR-" + `${new Date().getTime()}`
      },
      beforeCreate: (instance, option) => {
        console.log("hook run");

        instance.id = "TR-" + `${new Date().getTime()}`
      },
    },
    sequelize,
    modelName: 'Enrollment',
    tableName: "Enrollments"
  });
  return Enrollment;
};
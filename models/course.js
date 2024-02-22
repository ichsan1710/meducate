'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsTo(models.Category, {
        foreignKey: "CategoryId",
        as: "category",
      });
      Course.hasMany(models.Enrollment, {
        foreignKey: "course_id",
        onDelete: "CASCADE",
      });
    }
  }
  Course.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Title Can't Be Empty"
        },
        notEmpty: {
          msg: "Title Can't Be Empty"
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Description Can't Be Empty"
        },
        notEmpty: {
          msg: "Description Can't Be Empty"
        },
        isAtLeastTenWords(value) {
          const words = value.split(/\s+/);
          if (words.length < 10) {
            throw new Error("Description Must Be At Least 10 Words Long")
          }
        }
      }
    },
    instructor: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Instructor Can't Be Empty"
        },
        notEmpty: {
          msg: "Instructor Can't Be Empty"
        }
      }
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Category Can't Be Empty"
        },
        isInt: {
          msg: "Category Must Be an Id"
        }
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Duration Cant' Be Empty"
        },
        isInt: {
          msg: "Duration Can't Be Empty"
        },
        min: {
          args: [1],
          msg: "Duration must be at least 1 hour"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};
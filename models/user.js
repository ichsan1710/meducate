'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Enrollment, {
        foreignKey: "user_id",
      })
    }
  }
  User.init({
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Username is Required"
        },
        notEmpty: {
          msg: "Username is Required"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Email has been used"
      },
      validate: {
        notNull: {
          msg: "Email is Required"
        },
        notEmpty: {
          msg: "Email is Required"
        },
        isEmail: {
          msg: "Wrong email format"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password is Required"
        },
        notEmpty: {
          msg: "Password is Required"
        }
      }
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Role is Required"
        },
        notEmpty: {
          msg: "Role is Required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
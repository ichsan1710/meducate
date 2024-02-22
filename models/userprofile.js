'use strict';
const {
  Model
} = require('sequelize');
const helper = require('../utils/helper.js')

module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserProfile.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user"
      })
    }

    getAge() {
      if (this.dateBirth) {
        return helper.age(this.dateBirth);
      }
      return null;
    }
  }
  UserProfile.init({
    bio: DataTypes.TEXT,
    otherDetails: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    dateBirth: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'UserProfile',
  });
  return UserProfile;
};
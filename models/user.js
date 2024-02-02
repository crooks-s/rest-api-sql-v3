'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    emailAddress: DataTypes.STRING,
    password: DataTypes.STRING,
  }, { sequelize });

  User.associate = (models) => {
    User.hasMany(models.Course);
  };

  return User;
};
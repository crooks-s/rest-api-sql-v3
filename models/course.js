'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Model {}
  Course.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    estimatedTime: DataTypes.STRING,
    materialsNeeded: DataTypes.STRING,
  }, { sequelize });

  Course.associate = (models) => {
    Course.belongsTo(models.User);
  }

  return Course;
}
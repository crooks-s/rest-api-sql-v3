'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  class User extends Model { }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A first name is required.',
        },
        notEmpty: {
          msg: 'A first name is required.'
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A last name is required.',
        },
        notEmpty: {
          msg: 'A last name is required.'
        },
      },
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter a valid email address',
        },
        notEmpty: {
          msg: 'Please provide an email address.',
        },
        isEmail: {
          msg: 'Invalid email format. Please enter a valid email address',
        }
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required.',
        },
        notEmpty: {
          msg: 'Please provide a password.',
        },
        len: {
          args: [8, 20],
          msg: 'The password should be between 8 and 20 characters in length',
        },
      },
      set(val) {
        const hashedPassword = bcrypt.hashSync(val, 10);
        this.setDataValue('password', hashedPassword);
      },
    },
  }, { sequelize });

  User.associate = (models) => {
    User.hasMany(models.Course);
  };

  return User;
};
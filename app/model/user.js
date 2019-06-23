const {
  Sequelize,
  Model
} = require('sequelize')

const {
  sequelize
} = require('../../core/db')

class User extends Model {}

User.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true, // 主键
    autoIncrement: true // 自动增长
  },
  nickname: Sequelize.STRING,
  email: {
    type: Sequelize.STRING(128),
    unique: true // 唯一性
  },
  password: Sequelize.STRING,
  openid: {
    type: Sequelize.STRING(64),
    unique: true // 唯一性
  }
}, {
  sequelize,
  tableName: 'user' // 重命名
})

module.exports = {
  User
}
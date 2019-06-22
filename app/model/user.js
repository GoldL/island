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
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  openid: {
    type: Sequelize.STRING(64),
    unique: true // 不重复
  }
}, {
  sequelize,
  tableName: 'user' // 重命名
})
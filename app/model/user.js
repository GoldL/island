const bcrypt = require('bcryptjs')

const {
  Sequelize,
  Model
} = require('sequelize')

const {
  sequelize
} = require('@core/db')

class User extends Model {
  static async verifyEmailPassword(email, plainPassword) {
    const user = await User.findOne({
      where: {
        email
      }
    })
    if (!user) {
      throw new global.errs.AuthFailed('账号不存在')
    }
    const correct = bcrypt.compareSync(plainPassword, user.password)
    if (!correct) {
      throw new global.errs.AuthFailed('密码不正确')
    }
    return user
  }

  static async getUserByOpenid(openid) {
    const user = await User.findOne({
      where: {
        openid
      }
    })

    return user
  }

  static async registerByOpenid(openid) {
    return await User.create({
      openid
    })
  }
}

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
  password: {
    type: Sequelize.STRING,
    set(val) {
      const salt = bcrypt.genSaltSync(10)
      const pwd = bcrypt.hashSync(val, salt)
      this.setDataValue('password', pwd)
    }
  },
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
##### 1. `nvm`管理`node`版本
```
# 安装nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
# 安装最新稳定版 node
nvm install stable
# 安装指定版本
nvm install <version>
# 删除已安装的指定版本
nvm uninstall <version>
# 切换使用指定的版本node
nvm use <version>
# 列出所有安装的版本
nvm ls
```
##### 2. 自动加载包`require-directory`
```
const requireDirectory = require('require-directory')
const Router = require('koa-router')

const app = new Koa()

requireDirectory(module, './api/v1', {
  visit: whenLoadModule
})

function whenLoadModule(obj) {
  if (obj instanceof Router) {
    app.use(obj.routes())
  }
}
```
##### 3. 获取绝对路径
```
process.cwd()
```
##### 4. [`koa-bodyparser`](https://www.npmjs.com/package/koa-bodyparser)
```
# koa获取参数方式
const query = ctx.request.query
const headers = ctx.request.header
const body = ctx.request.body
```
##### 5. 中间件全局异常捕获
```
// http-exception
class HttpException extends Error {
  constructor(msg = '服务器异常', errorCode = 10000, code = 400) {
    super()
    this.errorCode = errorCode
    this.code = code
    this.msg = msg
  }
}
module.exports = {
    HttpException
}
// exception.js
const {
  HttpException
} = require('../core/http-exception')

const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    if (error instanceof HttpException) {
      ctx.body = {
        msg: error.msg,
        error_code: error.errorCode,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = error.code
    }
    else {
      ctx.body = {
        msg: 'we make a mistake',
        error_code: 999,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = 500
    }
  }
}

module.exports = catchError

```
##### 6. [`lin-validator`](http://doc.cms.7yue.pro/lin/server/koa/validator.html#%E7%B1%BB%E6%A0%A1%E9%AA%8C)
```
// validator.js ---声明
const {
  Rule,
  LinValidator
} = require('../../core/lin-validator')

class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super()
    this.id = [
      new Rule('isInt', '需要传入正整数', {
        min: 1
      })
    ]
  }
}

module.exports = {
  PositiveIntegerValidator
}

// api ---调用
const {
  PositiveIntegerValidator
} = require('../../validators/validator')
const v = new PositiveIntegerValidator().validate(ctx)
  const id = v.get('path.id')
```
##### 7. [`sequelize`](https://github.com/demopark/sequelize-docs-Zh-CN) 操作数据库
```
// 1.npm i mysql2 ---下载依赖
// 2.db.js ---创建数据库
const Sequelize = require('sequelize')
const {
  dbName,
    host,
    port,
    user,
    password
} = require('../config/config').database

const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql',
  host,
  port,
  timezone: '+08:00',
  define: {
    paranoid: true, // 不删除数据库条目,但将新添加的属性deletedAt设置为当前日期(删除完成时)
    underscored: true, // 将自动设置所有属性的字段参数为下划线命名方式
  }
})

sequelize.sync(
  // {
  //   force: true // 自动删除原来表，重新创建新的表
  // }
)

module.exports = {
  sequelize
}

// 3. user.js ---创建模型 
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
    unique: true // 唯一性
  }
}, {
  sequelize,
  tableName: 'user' // 重命名
})

// 保存
const { User } = require('../../model/user')
const user = {
email: v.get('body.email'),
password: v.get('body.password2'),
nickname: v.get('body.nickname')
}

User.create(user)
// 搜索
const user = await User.findOne({
  where: {
    email
  }
})

```
##### 8. [`bcrypt.js`加密](https://github.com/dcodeIO/bcrypt.js)
```
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)
const pwd = bcrypt.hashSync(v.get('body.password2'), salt)
```
##### 9.js伪枚举类型
```
// enum.js
function isThisType(val) {
  for (let key in this) {
    if (this[key] === val) {
      return true
    }
  }
  return false
}

const LoginType = {
  USER_MINI_PROGRAM: 100,
  USER_EMAIL: 101,
  USER_MOBILE: 102,
  ADMIN_EMAIL: 200,
  isThisType
}

module.exports = {
  LoginType
}
// 使用
if (!LoginType.isThisType(vals.body.type)) {
    // ....
}
```
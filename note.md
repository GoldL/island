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
// 别名
const v = await new LikeValidator().validate(ctx, {
    id: 'artId'
})
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
// 排序查找
const flow = await Flow.findOne({
    order: [
      ['index', 'DESC']
    ]
})
// 事务
return sequelize.transaction(async t => {
  await Favor.create({
    artId,
    type,
    uid
  }, {
    transaction: t
  })
  const art = await Art.getData(artId, type)
  await art.increment('fav_nums', {
    by: 1,
    transaction: t
  })
})
// db.js --- 生命scope
define: {
    paranoid: true, // 不删除数据库条目,但将新添加的属性deletedAt设置为当前日期(删除完成时)
    underscored: true, // 将自动设置所有属性的字段参数为下划线命名方式
    scopes: {
      bh: {
        attributes: {
          exclude: ['updated_at', 'deleted_at', 'created_at']
        }
      }
    },
}
// art.js --- 使用scope
const scope = useScope ? 'bh' : null
art = await Movie.scope(scope).findOne(finder)
// 排除查找
const arts = await Favor.findAll({
  where:{
    uid,
    type: {
      [Op.not]: 400
    }
  }
})
// 多查询in
Movie.scope(scope).findAll({
  where: {
    id: {
      [Op.in]: ids
    }
  }
})

```
##### 8. [`bcrypt.js`加密](https://github.com/dcodeIO/bcrypt.js)
```
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)
const pwd = bcrypt.hashSync(v.get('body.password2'), salt)
```
##### 9. js伪枚举类型
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
##### 10. [`jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken) 生成token令牌
```
// 生成令牌
const jwt = require('jsonwebtoken')
const generateToken = function(uid, scope){
    const secretKey = global.config.security.secretKey
    const expiresIn = global.config.security.expiresIn
    const token = jwt.sign({
        uid,
        scope
    },secretKey,{
        expiresIn
    })
    return token
}

// 校验令牌
try {
    decode = jwt.verify(userToken.name, global.config.security.secretKey)
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      errMsg = 'token已过期'
    }
    throw new global.errs.Forbbiden(errMsg)
  }
```
##### 11. [`basic-auth`携带令牌](https://github.com/jshttp/basic-auth)
```
const BasicAuth = require('basic-auth')

class Auth {
  constructor() {}

  get m() {
    return async (ctx, next) => {
      const tokuserTokenen = BasicAuth(ctx.req)
      if (!userToken || !userToken.name) {
        throw new global.errs.Forbbiden(errMsg)
      }
    }
  }
}

module.exports = {
  Auth
}
```
##### 12. [`module-alias`别名](https://github.com/ilearnio/module-alias)
```
// package.json
"_moduleAliases": {
    "@root"         : ".",
    "@model": "app/model",
    "@core": "core",
    "@middlewares": "middlewares",
    "@validators": "app/validators",
    "@services": "app/services",
    "@lib": "app/lib"
}
// app.js
require('module-alias/register')
// 使用
const { User } = require('@model/user')
```
##### 13.避免循环导入
```
favor.js 导入 art.js
art.js 导入 favor.js
导致
TypeError: Cannot read property 'userLikeIt' of undefined
  at Art.getDetail
// 解决办法，局部引入
async getDetail(uid) {
    const {
      Favor
    } = require('@model/favor')
    
    const art = await Art.getData(this.artId, this.type)
    if (!art) {
      throw new global.errs.NotFound()
    }
    const like = await Favor.userLikeIt(this.artId, this.type, uid)
    return {
      art: art,
      likeStatus: like
    }
}
```
##### 14.JSON序列化
```
// 1、每个model中通过toJSON控制
class Comment extends Model {
  toJSON() {
    return {
      content: this.getDataValue('content'),
      nums: this.getDataValue('nums')
    }
  }
}
// 2、在基类中强行加上toJSON， db.js
const {
  unset,
  clone
} = require('lodash')
const {
  Sequelize,
  Model
} = require('sequelize')Ï
Model.prototype.toJSON = function () {
  let data = clone(this.dataValues)

  unset(data, 'updatedAt')
  unset(data, 'createdAt')
  unset(data, 'deletedAt')

  return data
}
```
##### 15. [`koa-static`](https://www.npmjs.com/package/koa-static)静态资源加载
```
// app.js
const path = require('path')
const static = require('koa-static')
app.use(static(path.join(__dirname, './static')))
```
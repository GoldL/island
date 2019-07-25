const BasicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')

class Auth {
  constructor(level = 1) {
    this.level = level
    Auth.USER = 8
    Auth.ADMIN = 16
    Auth.SUPER_ADMIN = 32
  }

  get m() {
    return async (ctx, next) => {

      // 做特殊处理,前端开发前期只要query携带appKey就默认
      if (ctx.request.query.appKey) {
        ctx.auth = {
          uid: 1,
          scope: Auth.SUPER_ADMIN
        }
        await next()
        return
      }
      
      // 正常流程
      const userToken = BasicAuth(ctx.req)
      let errMsg = 'token不合法'
      let decode = {}
      if (!userToken || !userToken.name) {
        throw new global.errs.Forbbiden(errMsg)
      }
      try {
        decode = jwt.verify(userToken.name, global.config.security.secretKey)
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          errMsg = 'token已过期'
        }
        throw new global.errs.Forbbiden(errMsg)
      }

      if (decode.scope < this.level) {
        errMsg = '权限不足'
        throw new global.errs.Forbbiden(errMsg)
      }

      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope
      }

      await next()
    }
  }

  static verifyToken(token) {
    try {
      jwt.verify(token, global.config.security.secretKey)
      return true
    } catch(e) {
      return false
    }
  }
}

module.exports = {
  Auth
}
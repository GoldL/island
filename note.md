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
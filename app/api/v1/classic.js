const Router = require('koa-router')
const router = new Router()

const { HttpException, ParameterException } = require('../../../core/http-exception')

router.post('/v1/classic/latest', (ctx, next) => {
  const path = ctx.params
  const query = ctx.request.query
  const headers = ctx.request.headers
  const body = ctx.request.body

  if (true) {
    throw new Error()
  }

  ctx.body = {
    key: 'classic'
  }
})

module.exports = router
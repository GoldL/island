const Router = require('koa-router')
const router = new Router()

const {
  HttpException,
  ParameterException
} = require('../../../core/http-exception')
const {
  PositiveIntegerValidator
} = require('../../validators/validator')

router.post('/v1/:id/classic/latest', async (ctx, next) => {
  const path = ctx.params
  const query = ctx.request.query
  const headers = ctx.request.headers
  const body = ctx.request.body

  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = v.get('path.id')
  ctx.body = {
    key: 'classic'
  }
})

module.exports = router
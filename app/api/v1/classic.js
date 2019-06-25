const Router = require('koa-router')
const router = new Router()

const {
  HttpException,
  ParameterException
} = require('../../../core/http-exception')
const {
  PositiveIntegerValidator
} = require('../../validators/validator')

const {
  Auth 
} = require('../../../middlewares/auth')


router.post('/v1/classic/latest', new Auth().m, async (ctx, next) => {
  ctx.body = ctx.auth.uid
})

module.exports = router
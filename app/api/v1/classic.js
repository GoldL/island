const Router = require('koa-router')
const router = new Router({
  prefix: '/v1/classic'
})

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


router.post('/latest', new Auth().m, async (ctx, next) => {
  ctx.body = ctx.auth.uid
})

module.exports = router
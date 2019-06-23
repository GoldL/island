const Router = require('koa-router')
const {
  success
} = require('../../lib/helper')
const {
  TokenValidator
} = require('../../validators/validator')

const router = new Router({
  prefix: '/v1/token'
})

router.post('/', async (ctx, next) => {
  const v = await new TokenValidator().validate(ctx)
  success()
})

module.exports = router
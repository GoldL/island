const Router = require('koa-router')
const router = new Router()

router.get('/v1/classic', (ctx, next) => {
  ctx.body = {
    key: 'classic'
  }
})

module.exports = router
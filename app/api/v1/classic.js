const Router = require('koa-router')
const router = new Router({
  prefix: '/v1/classic'
})
const {
  Flow
} = require('@model/flow')
const {
  Favor
} = require('@model/favor')

const {
  Auth 
} = require('@middlewares/auth')

const {
  Art
} = require('@model/art')

router.get('/latest', new Auth().m, async (ctx, next) => {
  const flow = await Flow.findOne({
    order: [
      ['index', 'DESC']
    ]
  })
  const art = await Art.getData(flow.artId, flow.type)
  const likeLatest = await Favor.userLikeIt(flow.artId, flow.type, ctx.auth.uid)
  art.setDataValue('index', flow.index)
  art.setDataValue('likeStatus', likeLatest)
  ctx.body = art
})

module.exports = router
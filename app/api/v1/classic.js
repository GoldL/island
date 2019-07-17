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

const {
  PositiveIntegerValidator,
  ClassicValidator
} = require('@validator')

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

router.get('/:index/next', new Auth().m, async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'index'
  })
  const index = v.get('path.index')
  const flow = await Flow.findOne({
    where: {
      index: index + 1
    }
  })
  if (!flow) {
    throw new global.errs.NotFound()
  }
  const art = await Art.getData(flow.artId, flow.type)
  const likeNext = await Favor.userLikeIt(flow.artId, flow.type, ctx.auth.uid)
  art.setDataValue('index', flow.index)
  art.setDataValue('likeStatus', likeNext)
  ctx.body = art
})

router.get('/:index/previous', new Auth().m, async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'index'
  })
  const index = v.get('path.index')
  const flow = await Flow.findOne({
    where: {
      index: index - 1
    }
  })
  if (!flow) {
    throw new global.errs.NotFound()
  }
  const art = await Art.getData(flow.artId, flow.type)
  const likePrevious = await Favor.userLikeIt(flow.artId, flow.type, ctx.auth.uid)
  art.setDataValue('index', flow.index)
  art.setDataValue('likeStatus', likePrevious)
  ctx.body = art
})

router.get('/:type/:id', new Auth().m, async ctx => {
  const v = await new ClassicValidator().validate(ctx)
  const id = v.get('path.id')
  const type = parseInt(v.get('path.type'))
  
  const artDetail = await new Art(id, type).getDetail(ctx.auth.uid)

  artDetail.art.setDataValue('likeStatus', artDetail.likeStatus)

  ctx.body = {
    art: artDetail.art
  }
})

router.get('/:type/:id/favor', new Auth().m, async ctx => {
  const v = await new ClassicValidator().validate(ctx)
  const id = v.get('path.id')
  const type = parseInt(v.get('path.type'))
  const art = await Art.getData(id, type)
  if (!art) {
    throw new global.errs.NotFound()
  }
  const like = await Favor.userLikeIt(id, type, ctx.auth.uid)
  ctx.body = {
    favNums: art.favNums,
    likeStatus: like
  }
})

router.get('/favor', new Auth().m, async ctx => {
  const uid = ctx.auth.uid
  ctx.body = await Favor.getMyClassicFavors(uid)
})

module.exports = router
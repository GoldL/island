const Router = require('koa-router')

const {
  SearchValidator,
  PositiveIntegerValidator
} = require('@validator')

const {
  Auth
} = require('@middlewares/auth')

const {
  HotBook
} = require('@model/hot-book')

const {
  Book
} = require('@model/book')

const {
  Favor
} = require('@model/favor')

const router = new Router({
  prefix: '/v1/book'
})

router.get('/hot_list', async ctx => {
  const books = await HotBook.getAll()
  ctx.body = books
})

router.get('/:id/detail', async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const book = await new Book(v.get('path.id')).detail()
  ctx.body = book
})

router.get('/search', async ctx => {
  const v = await new SearchValidator().validate(ctx)
  const result = await Book.searchFromYuShu(
    v.get('query.q'), v.get('query.start'), v.get('query.count'))
  ctx.body = result
})

router.get('/favor/count', new Auth().m, async ctx => {
  const count = await Book.getMyFavorBookCount(ctx.auth.uid)
  ctx.body = {
    count
  }
})

router.get('/:bookId/favor', new Auth().m, async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'bookId'
  })
  const favor = await Favor.getBookFavor(
    ctx.auth.uid, v.get('path.bookId'))
  ctx.body = favor
})

module.exports = router
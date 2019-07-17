const Router = require('koa-router')

const {
  PositiveIntegerValidator
} = require('@validator')

const {
  HotBook
} = require('@model/hot-book')

const {
  Book
} = require('@model/book')

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

module.exports = router
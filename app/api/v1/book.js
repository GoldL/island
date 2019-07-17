const Router = require('koa-router')

const {
  HotBook
} = require('@model/hot-book')

const router = new Router({
  prefix: '/v1/book'
})

router.get('/hot_list', async ctx => {

  const books = await HotBook.getAll()
  ctx.body = books
})

module.exports = router
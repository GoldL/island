const Router = require('koa-router')

const { User } = require('@model/user')

const { success } = require('@lib/helper')

const { RegisterValidator } = require('@validator')

const router = new Router({
  prefix: '/v1/user'
})

router.post('/register', async (ctx, next) => {
  const v = await new RegisterValidator().validate(ctx)
  const user = {
    email: v.get('body.email'),
    password: v.get('body.password2'),
    nickname: v.get('body.nickname')
  }

  User.create(user)

  success()
})

module.exports = router
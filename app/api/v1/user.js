const bcrypt = require('bcryptjs')
const Router = require('koa-router')

const { User } = require('../../model/user')

const { RegisterValidator } = require('../../validators/validator')

const router = new Router({
  prefix: '/v1/user/'
})

router.post('register', async (ctx, next) => {
  const v = await new RegisterValidator().validate(ctx)
  const salt = bcrypt.genSaltSync(10)
  const pwd = bcrypt.hashSync(v.get('body.password2'), salt)

  const user = {
    email: v.get('body.email'),
    password: pwd,
    nickname: v.get('body.nickname')
  }

  User.create(user)
})

module.exports = router
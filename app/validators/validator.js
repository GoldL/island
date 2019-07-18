const {
  Rule,
  LinValidator
} = require('@core/lin-validator-v2')

const {
  User
} = require('@model/user')

const {
  LoginType,
  ArtType
} = require('@lib/enum')
class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super()
    this.id = [
      new Rule('isInt', '需要传入正整数', {
        min: 1
      })
    ]
  }
}

class RegisterValidator extends LinValidator {
  constructor() {
    super()
    this.email = [
        new Rule('isEmail', '电子邮箱不符合规范，请输入正确的邮箱')
      ],
      this.password1 = [
        new Rule('isLength', '密码至少6个字符，最多32个字符', {
          min: 6,
          max: 32
        }),
        new Rule('matches', '密码不符合规范', "^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![,\.#%'\+\*\-:;^_`]+$)[,\.#%'\+\*\-:;^_`0-9A-Za-z]{6,20}$")
      ],
      this.password2 = this.password1,
      this.nickname = [
        new Rule('isLength', '昵称不符合长度规范', {
          min: 4,
          max: 32
        }),
      ]
  }

  validatePassword(vals) {
    const password1 = vals.body.password1
    const password2 = vals.body.password2
    if (password1 !== password2) {
      throw new Error('两个密码不一致')
    }
  }

  async validateEmail(vals) {
    const email = vals.body.email
    const user = await User.findOne({
      where: {
        email
      }
    })

    if (user) {
      throw new Error('邮箱已存在')
    }
  }
}

class TokenValidator extends LinValidator {
  constructor() {
    super()
    this.account = [
        new Rule('isLength', '账号长度不符合规范', {
          min: 4,
          max: 32
        })
      ],
      this.secret = [
        new Rule('isOptional'),
        new Rule('isLength', '至少6个字符', {
          min: 6,
          max: 128
        })
      ]
  }

  validateLoginType(vals) {
    if (!vals.body.type) {
      throw new Error('type是必传参数')
    }
    if (!LoginType.isThisType(vals.body.type)) {
      throw new Error('type参数不合法')
    }
  }
}

class NotEmptyValidate extends LinValidator {
  constructor() {
    super()
    this.token = [
      new Rule('isLength', '不允许为空', {
        min: 1
      })
    ]
  }
}

function checkArtType(vals) {
  let type = vals.body.type || vals.path.type
  if (!type) {
    throw new Error('type是必须参数')
  }
  type = parseInt(type)

  if (!ArtType.isThisType(type)) {
    throw new Error('type参数不合法')
  }
}

class LikeValidator extends PositiveIntegerValidator {
  constructor() {
    super()
    this.validateType = checkArtType
  }
}

class ClassicValidator extends LikeValidator {

}

class SearchValidator extends LinValidator {
  constructor() {
    super()
    this.q = [
      new Rule('isLength', '搜索关键词不能为空', {
        min: 1,
        max: 16
      })
    ]
    this.start = [
      new Rule('isInt', '不符合规范', {
        min: 0,
        max: 60000
      }),
      new Rule('isOptional', '', 0)
    ]
    this.count = [
      new Rule('isInt', '不符合规范', {
        min: 1,
        max: 20
      }),
      new Rule('isOptional', '', 20)
    ]

  }
}

class AddShortCommentValidator extends PositiveIntegerValidator {
  constructor() {
    super()
    this.content = [
      new Rule('isLength', '必须在1到12个字符之间', {
        min: 1,
        max: 12
      })
    ]
  }
}

module.exports = {
  PositiveIntegerValidator,
  RegisterValidator,
  TokenValidator,
  NotEmptyValidate,
  LikeValidator,
  ClassicValidator,
  SearchValidator,
  AddShortCommentValidator
}
const { Success } = require('../../core/http-exception')

const success = (msg, errorCode) => {
  throw new Success(msg, errorCode)
}

module.exports = {
  success
}
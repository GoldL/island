const axios = require('axios')
const util = require('util')

const {
  sequelize
} = require('@core/db')

const {
  Sequelize,
  Model
} = require('sequelize')

class Book extends Model {
  constructor(id) {
    super()
    this.id = id
  }

  async detail () {
    const url = util.format(global.config.yushu.detailUrl, this.id)
    const detail = await axios.get(url)
    return detail.data
  }

  static async searchFromYuShu(q, start, count, summary = 1) {
    const url = util.format(
        global.config.yushu.keywordUrl, encodeURI(q), count, start, summary)
    const result = await axios.get(url)
    return result.data
}
}

Book.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  favNums: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
    tableName: 'book'
})

module.exports = {
  Book
}
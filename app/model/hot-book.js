const {
  sequelize
} = require('@core/db')

const {
  Sequelize,
  Model,
  Op
} = require('sequelize')

const {
  Favor
} = require('@model/favor')

class HotBook extends Model {
  static async getAll() {
    const books = await HotBook.findAll({
      order: ['index']
    })

    const ids = books.map(book => book.id)
    const favors = await Favor.findAll({
      where: {
        artId: {
          [Op.in]: ids
        },
        type: 400
      },
      group: ['artId'],
      attributes: ['artId', [Sequelize.fn('COUNT', '*'), 'count']]
    })

    books.forEach(book => {
      HotBook._getEachBookStatus(book, favors)
    })

    return books
  }

  static _getEachBookStatus(book, favors) {
    let count = 0
    favors.forEach(favor => {
      if (favor.artId === book.id) {
        count = favor.get('count')
      }
    })
    book.setDataValue('favNums', count)
    return book
  }
}

HotBook.init({
  index: Sequelize.INTEGER,
  image: Sequelize.STRING,
  author: Sequelize.STRING,
  title: Sequelize.STRING
}, {
  sequelize,
  tableName: 'hot_book'
})

module.exports = {
  HotBook
}
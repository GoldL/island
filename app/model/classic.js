const {
  Sequelize,
  Model
} = require('sequelize')

const {
  sequelize
} = require('@core/db')

const classicFields = {
  image: Sequelize.STRING,
  content: Sequelize.STRING,
  pubdate: Sequelize.DATEONLY,
  favNums: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  title: Sequelize.STRING,
  type: Sequelize.TINYINT,
}

class Movie extends Model {

}

Movie.init(classicFields, {
  sequelize,
  tableName: 'movie' // 重命名
})

class Sentence extends Model {

}

Sentence.init(classicFields, {
  sequelize,
  tableName: 'sentence' // 重命名
})

class Music extends Model {

}

const musicFields = Object.assign({
  url: Sequelize.STRING,
}, classicFields)

Music.init(musicFields, {
  sequelize,
  tableName: 'music' // 重命名
})

module.exports = {
  Movie,
  Sentence,
  Music
}
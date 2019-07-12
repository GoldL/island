const {
  Movie,
  Sentence,
  Music
} = require('../model/classic')

class Art {
  static async getData(artId, type) {
    let art = null
    const finder = {
      where: {
        id: artId
      }
    }
    switch (type) {
      case 100:
        art = await Movie.findOne(finder)
        break
      case 200:
        art = await Music.findOne(finder)
        break
      case 300:
        art = await Sentence.findOne(finder)
      case 400:
        break
      default:
        break
    }
    return art
  }
}

module.exports = {
  Art
}
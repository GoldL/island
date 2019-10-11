const {
  flatten
} = require('lodash')

const {
  Op
} = require('sequelize')

const {
  Movie,
  Sentence,
  Music
} = require('@model/classic')

class Art {

  constructor(artId, type) {
    this.artId = artId
    this.type = type
  }

  async getDetail(uid) {
    const {
      Favor
    } = require('@model/favor')

    const art = await Art.getData(this.artId, this.type)
    if (!art) {
      throw new global.errs.NotFound()
    }
    const like = await Favor.userLikeIt(this.artId, this.type, uid)
    return {
      art: art,
      likeStatus: like
    }
  }

  static async getList(artInfoList) {
    const artInfoObj = {
      100: [],
      200: [],
      300: []
    }
    for (let artInfo of artInfoList) {
      artInfoObj[artInfo.type].push(artInfo.artId)
    }
    const arts = []
    for (let key in artInfoObj) {
      const ids = artInfoObj[key]
      if (!ids.length) {
        continue
      }
      key = parseInt(key)
      arts.push(await Art._getListByType(ids, key))
    }
    return flatten(arts)
  }

  static async _getListByType(ids, type) {
    let arts = []
    const finder = {
      where: {
        id: {
          [Op.in]: ids
        }
      }
    }
    const scope = 'bh'
    switch (type) {
      case 100:
        arts = await Movie.scope(scope).findAll(finder)
        break
      case 200:
        arts = await Music.scope(scope).findAll(finder)
        break
      case 300:
        arts = await Sentence.scope(scope).findAll(finder)
        break
      case 400:
        break
      default:
        break
    }
    return arts
  }

  static async getData(artId, type, useScope = true) {
    let art = null
    const finder = {
      where: {
        id: artId
      }
    }
    const scope = useScope ? 'bh' : null
    switch (type) {
      case 100:
        art = await Movie.scope(scope).findOne(finder)
        break
      case 200:
        art = await Music.scope(scope).findOne(finder)
        break
      case 300:
        art = await Sentence.scope(scope).findOne(finder)
        break
      case 400:
        const {
          Book
        } = require('@model/book')
        art = await Book.scope(scope).findOne(finder)
        if (!art) {
          art = await Book.create({
            id: artId
          })
        }
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
module.exports = {
  // prod
  environment: 'env',
  database: {
    dbName: 'island',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456'
  },
  security: {
    secretKey: "abcdefg",
    expiresIn: 60 * 60 * 24 * 30
  },
  wx: {
    appId: 'wx115a6ed098ec63e7',
    appSecret: '737efa16ce85177ca43b6cf290aa618b',
    loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
  },
  yushu: {
    detailUrl: 'http://t.yushu.im/v2/book/id/%s',
    keywordUrl: 'http://t.yushu.im/v2/book/search?q=%s&count=%s&start=%s&summary=%s'
  },
  host: 'https://island.youbego.top/'
}
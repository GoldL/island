require('module-alias/register')

const Koa = require('koa')
const InitManager = require('@core/init')
const bodyParser = require('koa-bodyparser')
const catchError = require('@middlewares/exception')
const path = require('path')
const static = require('koa-static')

const app = new Koa()
app.use(catchError)
app.use(bodyParser())
app.use(static(path.join(__dirname, './static')))

InitManager.initCore(app)

app.listen(3001)
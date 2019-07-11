import Koa from 'koa'

interface IState {

}

interface ICustom {

}

const app = new Koa<IState, ICustom>()

app.use(async ctx => {
  ctx.body = 'plugin-poll-server-svc'
})

app.listen(3000)

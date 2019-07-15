
const process = require('process')
const Koa = require('koa')
const Router = require('koa-trie-router')
const bodyParser = require('koa-bodyparser')
const { parentPort } = require('worker_threads')
const _ = require('lodash')


const botStatus = {
    qrurl: null,
    login: null,
    messages: []
}

parentPort.on('message', message => {
    const {event, data} = message
    switch(event) {
        case 'scan':
            botStatus.qrurl = data
            break
        case 'login':
            botStatus.login = data
            break
        case 'logout':
            botStatus.login = null
            botStatus.qrurl = null
            botStatus.messages = []
        case 'message':
            botStatus.messages.push(data)
            break
        case 'error':
            process.exit(1)
            break
    }
})

let app = new Koa()
let router = new Router()
app.use(bodyParser());
router
.get('/', async ctx => {
    ctx.body = 'Why you here?'
})
.get('/api/scan', async ctx => {
    /**
     * curl localhost:3010/api/scan | jq .
     */
    if (botStatus.qrurl) {
        ctx.body = {
            ok: true,
            qrurl: botStatus.qrurl,
        }
    } else {
        ctx.body = {
            ok: false,
            error: 'Not initialized',
        }
    }
})
.get('/api/status', async ctx => {
    /**
     * curl localhost:3010/api/status | jq .
     */
    if (botStatus.login) {
        ctx.body = {
            ok: true,
            login: botStatus.login
        }
    } else {
        ctx.body = {
            ok: false,
            error: 'Not login',
        }
    }
})
.get('/api/message', async ctx => {
    /**
     * curl localhost:3010/api/message | jq .
     */
    if (botStatus.login) {
        ctx.body = {
            ok: true,
            messages: botStatus.messages.slice(
                Math.max(botStatus.messages.length - 5, 0)
            ).filter(msg => {
                const now = new Date()
                if (now - msg.date > 5 * 60 * 1000) {
                    return false
                }
                return true
            })
        }
    } else {
        ctx.body = {
            ok: false,
            error: 'Not login',
        }
    }
})
.post('/api/message', async ctx => {
    /**
     * curl -H 'Content-Type: application/json' -XPOST localhost:3010/api/message -d '{"name": "superman", "text": "hello"}' | jq .
     */
    if (!ctx.request.body) {
        ctx.body = {
            ok: false,
            error: 'Invalid post body, not a JSON'
        }
        return
    }
    if (!_.isString(ctx.request.body.name) && !_.isString(ctx.request.body.topic)) {
        ctx.body = {
            ok: false,
            error: 'Invalid name or topic, must have one of them'
        }
        return
    }
    if (!_.isString(ctx.request.body.text)) {
        ctx.body = {
            ok: false,
            error: 'Invalid text'
        }
        return
    }
    parentPort.postMessage({
        event: 'message',
        data: ctx.request.body,
    })
    ctx.body = {
        ok: true,
    }
})

app.use(router.middleware())
app.listen(3010, '0.0.0.0', () => {
    console.log('SERVER GREEN')
})


const process = require('process')
const { Wechaty } = require('wechaty')
const { PuppetPadpro } = require('wechaty-puppet-padpro')
const { parentPort } = require('worker_threads')

let bot = null

if (process.env.WECHATY_PUPPET_PADPRO_TOKEN) {
    console.log('Start with padpro')
    const puppet = new PuppetPadpro({token: process.env.WECHATY_PUPPET_PADPRO_TOKEN})
    bot = Wechaty.instance({puppet, profile: 'wechaty-bot'}) // Global Instance
} else {
    console.log('Start with normal')
    bot = Wechaty.instance({profile: 'wechaty-bot'}) // Global Instance
}



async function serializeMessage(message) {
    if (!message) {
        return null
    }
    let obj = {}
    obj.id = message.id
    obj.from = await serializeContact(message.from())
    obj.to = await serializeContact(message.to())
    obj.room = await serializeRoom(message.room())
    obj.text = message.text()
    obj.date = await message.date()
    return obj
}

async function serializeContact(contact) {
    if (!contact) {
        return null
    }
    let obj = {}
    obj.id = contact.id
    obj.name = contact.name()
    obj.alias = await contact.alias()
    obj.isFriend = contact.friend()
    obj.gender = contact.gender()
    obj.province = contact.province()
    obj.city = contact.city()
    obj.isSelf = contact.self()
    return obj
}

async function serializeRoom(room) {
    if (!room) {
        return null
    }
    let obj = {}
    obj.id = room.id
    obj.topic = await room.topic()
    obj.announce = await room.announce()
    return obj
}


parentPort.on('message', async message => {
    const {event, data} = message
    if (event === 'message') {
        const {topic, name, text} = data
        if (!text) {
            return
        }
        let contact = null
        let room = null
        if (name) {
            contact = await bot.Contact.find({name})
        }
        if (topic) {
            room = await bot.Room.find({topic})
        }
        if (room && contact && await room.has(contact)) {
            room.say(`@${contact.name()} ${text}`)
        } else if (room) {
            room.say(text)
        } else if (contact) {
            contact.say(text)
        }
    }
})


bot
.on('scan', (qrcode, status) => {
    qrurl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`
    console.log(`Scan QR Code to login: ${status}\n${qrurl}`)
    parentPort.postMessage({
        event: 'scan',
        data: qrurl
    })
})
.on('login', user => {
    console.log(`User ${user} logined`)
    parentPort.postMessage({
        event: 'login',
        data: user
    })
})
.on('logout', (user) => {
    // Logout Event will emit when bot detected log out.
    console.log(`user ${user} logout`)
    parentPort.postMessage({
        event: 'logout',
        data: user
    })
})
.on('message', async (message) => {
    if (message.age() > 60 * 1000) {
        console.log('Message discarded because its TOO OLD(than 1 minute)')
        console.log(message)
        return
    }
    if (message.self()) {
        console.log('Message discarded because its mysel')
        return
    }
    console.log(`Message: ${message}`)
    parentPort.postMessage({
        event: 'message',
        data: await serializeMessage(message)
    })
})
.on('friendship', (friendship) => {
    // Friendship Event will emit when got a new friend request, or friendship is confirmed.
    if(friendship.type() === Friendship.Type.Receive) { // 1. receive new friendship request from new contact
        const contact = friendship.contact()
        // let result = await friendship.accept()
        // if(result) {
        //     console.log(`Request from ${contact.name()} is accept succesfully!`)
        // } else {
        //     console.log(`Request from ${contact.name()} failed to accept!`)
        // }
    } else if (friendship.type() === Friendship.Type.Confirm) { // 2. confirm friendship
        console.log(`new friendship confirmed with ${contact.name()}`)
    }
})
.on('room-join', (room, inviteeList, inviter) => {
    // room-join Event will emit when someone join the room.
    const nameList = inviteeList.map(c => c.name()).join(',')
    console.log(`Room ${room.topic()} got new member ${nameList}, invited by ${inviter}`)
})
.on('room-leave', (room, leaverList) => {
    // room-leave Event will emit when someone leave the room.
    const nameList = leaverList.map(c => c.name()).join(',')
    console.log(`Room ${room.topic()} lost member ${nameList}`)
})
.on('room-topic', (room, topic, oldTopic, changer) => {
    // room-topic Event will emit when someone change the room's topic.
    console.log(`Room ${room.topic()} topic changed from ${oldTopic} to ${topic} by ${changer.name()}`)
})
.on('room-invite', async roomInvitation => {
    // room-invite Event will emit when there's an room invitation.
    try {
        console.log(`received room-invite event.`)
        // await roomInvitation.accept()
    } catch (e) {
        console.error(e)
    }
})
.on('error', (error) => {
    console.error(error)
    process.exit(1)
})
.start()


from waas_client import WAAS


def on_message(bot, msg):
    text = msg.get('text')
    from_name = msg.get('from', {}).get('name')
    room_topic = msg.get('room', {}).get('topic')
    if text:
        bot.send_message(text, name=from_name, topic=room_topic)


if __name__ == '__main__':
    bot = WAAS('http://localhost:3010/api/')
    bot.start(on_message)

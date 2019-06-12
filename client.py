
import os
import time
import json
import requests

BOT_API = 'http://localhost:3010/api/'


def status():
    r = requests.get(BOT_API + 'status', timeout=10)
    r = json.loads(r.text)
    if r.get('ok'):
        return True
    return False


def scan():
    while True:
        r = requests.get(BOT_API + 'scan', timeout=10)
        r = json.loads(r.text)
        if r.get('ok'):
            return r.get('qrurl')
        print(r.get('error', 'Unknown error'))
        time.sleep(5)


def login():
    while True:
        r = requests.get(BOT_API + 'status', timeout=10)
        r = json.loads(r.text)
        if r.get('ok'):
            return
        print(r.get('error', 'Unknown error'))
        time.sleep(5)


def message():
    exists_messages = {}
    while True:
        r = requests.get(BOT_API + 'message', timeout=10)
        r = json.loads(r.text)
        if r.get('ok'):
            for msg in r.get('messages', []):
                if msg.get('id') not in exists_messages:
                    exists_messages[msg.get('id')] = msg
                    yield msg
        time.sleep(0.2)


def send_message(text, name=None, topic=None):
    body = {
        'name': name,
        'topic': topic,
        'text': text
    }
    r = requests.post(BOT_API + 'message', timeout=10, json=body)
    r = json.loads(r.text)
    if not r.get('ok'):
        print(r.get('error', 'Unknown error'))


if __name__ == '__main__':
    if not status():
        qrurl = scan()  # wait qrurl generate
        print(f'Please scan {qrurl}')
        login()  # wait login
    print('logined')
    admin = os.environ.get('ADMIN')
    for msg in message():
        print(msg)
        if msg.get('from', {}).get('name') == admin: 
            send_message('你好啊', name=admin)



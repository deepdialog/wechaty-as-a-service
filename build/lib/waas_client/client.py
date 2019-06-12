# -*- coding: utf-8 -*-

import time
import json
import requests


BOT_API = 'http://localhost:3010/api/'


class WAAS(object):
    def __init__(self, api=BOT_API):
        self.api = api
        self.qrurl = None
        print(f'Running on api {api}')

    def status(self):
        r = requests.get(self.api + 'status', timeout=10)
        r = json.loads(r.text)
        if r.get('ok'):
            return True
        return False

    def scan(self):
        while True:
            r = requests.get(self.api + 'scan', timeout=10)
            r = json.loads(r.text)
            if r.get('ok'):
                self.qrurl = r.get('qrurl')
                return
            print(r.get('error', 'Unknown error'))
            time.sleep(5)

    def login(self):
        while True:
            r = requests.get(self.api + 'status', timeout=10)
            r = json.loads(r.text)
            if r.get('ok'):
                return
            print(r.get('error', 'Unknown error'))
            time.sleep(5)

    def message(self):
        exists_messages = {}
        while True:
            r = requests.get(self.api + 'message', timeout=10)
            r = json.loads(r.text)
            if r.get('ok'):
                for msg in r.get('messages', []):
                    if msg.get('id') not in exists_messages:
                        exists_messages[msg.get('id')] = msg
                        yield msg
            time.sleep(0.2)

    def send_message(self, text, name=None, topic=None):
        body = {
            'name': name,
            'topic': topic,
            'text': text
        }
        r = requests.post(self.api + 'message', timeout=10, json=body)
        r = json.loads(r.text)
        if not r.get('ok'):
            print(r.get('error', 'Unknown error'))

    def start(self, on_message):
        if not self.status():
            self.scan()  # wait qrurl generate
            print(f'Please scan {self.qrurl}')
            self.login()  # wait login
        print('logined')
        for msg in self.message():
            print(msg)
            on_message(msg)

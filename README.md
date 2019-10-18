# Wechaty As A Service


## Usage

Run for test

```bash
docker pull registry.cn-beijing.aliyuncs.com/deepdialog/waas:latest && \
docker run -it --rm --name=waas \
-p 3010:3010 \
-v /etc/timezone:/etc/timezone:ro \
-v /etc/localtime:/etc/localtime:ro \
-v /var/wechaty-bot.memory-card.json:/bot/wechaty-bot.memory-card.json \
registry.cn-beijing.aliyuncs.com/deepdialog/waas:latest
```

Run for production

```bash
docker pull registry.cn-beijing.aliyuncs.com/deepdialog/waas:latest && \
docker run -d --restart=always --name=waas \
-p 3010:3010 \
-v /etc/timezone:/etc/timezone:ro \
-v /etc/localtime:/etc/localtime:ro \
-v /var/wechaty-bot.memory-card.json:/bot/wechaty-bot.memory-card.json \
registry.cn-beijing.aliyuncs.com/deepdialog/waas:latest
```

Run for PadPro

```
docker pull registry.cn-beijing.aliyuncs.com/deepdialog/waas:latest && \
docker run -d --restart=always --name=waas \
-p 3010:3010 \
-e PUPPET_TOKEN=THE_TOKEN \
-v /etc/timezone:/etc/timezone:ro \
-v /etc/localtime:/etc/localtime:ro \
-v /var/wechaty-bot.memory-card.json:/bot/wechaty-bot.memory-card.json \
registry.cn-beijing.aliyuncs.com/deepdialog/waas:latest
```



### Install Client

`pip install waas-client`

## DEMO

Simplest echo bot: `echo.py`

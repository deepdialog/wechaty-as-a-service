#!/bin/bash

docker pull registry.cn-beijing.aliyuncs.com/deepdialog/waas:latest && docker run -it --rm --name=waas \
-p 3010:3010 \
-v /etc/timezone:/etc/timezone:ro \
-v /etc/localtime:/etc/localtime:ro \
registry.cn-beijing.aliyuncs.com/deepdialog/waas:latest


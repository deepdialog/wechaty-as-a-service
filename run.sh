#!/bin/bash

docker pull registry.cn-beijing.aliyuncs.com/deepdialog/waas:latest && docker run -it --rm --name=waas \
-p 3010:3010 \
registry.cn-beijing.aliyuncs.com/deepdialog/waas:latest


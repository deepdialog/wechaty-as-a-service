#!/bin/bash

set -e

docker build \
    -t registry.cn-beijing.aliyuncs.com/deepdialog/waas:latest \
    .

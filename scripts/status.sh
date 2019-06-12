#!/bin/bash

set -e

curl localhost:3010/api/status | jq .
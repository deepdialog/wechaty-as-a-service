#!/bin/bash

set -e

curl localhost:3010/api/scan | jq .
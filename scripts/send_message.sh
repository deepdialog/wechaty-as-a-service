#!/bin/bash

set -e

curl -H 'Content-Type: application/json' -XPOST localhost:3010/api/message -d '{"name": "superman", "text": "hello"}' | jq .
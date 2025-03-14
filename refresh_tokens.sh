#!/bin/bash

API_URL="${REFRESH_API_URL}"
AUTH_TOKEN="${REFRESH_API_JWT}"

if [ -z "$AUTH_TOKEN" ]; then
  echo "Error: REFRESH_API_JWT is not set."
  exit 1
fi

curl -s -X GET "$API_URL" -H "Authorization: Bearer $AUTH_TOKEN"

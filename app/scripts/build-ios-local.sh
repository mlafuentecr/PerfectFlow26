#!/bin/sh

set -eu

export NODE_ENV=production

npx eas-cli@latest build --platform ios --profile production --local

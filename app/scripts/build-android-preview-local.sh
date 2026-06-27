#!/bin/sh

set -eu

JAVA_HOME=$(/usr/libexec/java_home -v 17)
export JAVA_HOME
export PATH="$JAVA_HOME/bin:$PATH"
export NODE_ENV=production

npx eas-cli@latest build --platform android --profile preview --local

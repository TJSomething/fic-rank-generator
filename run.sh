#!/bin/bash
set -eo pipefail

source ~/.bashrc
cd "$(dirname "$(readlink -f "$0")")"
yarn install
npm run update

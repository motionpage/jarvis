#!/usr/bin/env dash

# Exit if any subcommand fails
set -e
set -o pipefail

indent() {
	while read LINE; do
		echo "  $LINE" || true
	done
}

RED='\033[0;31m'
NC='\033[0m' # No Color
On_Purple='\033[45m'

rm -rf dist/**
clear

if ! command -v rsync >/dev/null; then
	printf 'rsync is not installed.\n'
	exit 1
fi

if ! command -v yarn >/dev/null; then
	printf 'Yarn is not installed.\n'
	printf 'See https://yarnpkg.com/lang/en/docs/install/ for install instructions.\n'
	exit 1
fi

exec yarn build --stats=errors-only | indent

rsync src/public/index.html dist/index.html
rsync -av src/public/assets dist/assets
rsync -av --exclude="public" --exclude="ui" --exclude="utils" --exclude="index.test.js" src/ dist/server

printf "${RED}${On_Purple}Bundled and Copied!!${NC}\n"

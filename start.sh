#!/bin/sh

npx --yes prisma db push --skip-generate
node server.js
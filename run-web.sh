#!/usr/bin/env zsh

function client() {
  cd web-client && npm run start &
}

function server() {
  cd server && npm run start &
}

(trap 'kill 0' SIGINT; client & server)

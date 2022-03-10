#!/bin/bash

export COMPOSE_FILE=./docker-compose.yml

ENV_FILE=./dev.docker-compose.env

docker-compose --env-file $ENV_FILE $@

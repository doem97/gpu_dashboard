#!/bin/bash

NGROK_AUTHTOKEN=$NGROK_AUTHTOKEN node ngrok-setup.js

ngrok http --url="$CUSTOM_URL" 80

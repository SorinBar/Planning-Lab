#!/bin/bash
# Start server in a new terminal
gnome-terminal -- python3 server.py
# Give server time to start
sleep 1
# Start the app frontend
firefox client.html
#!/bin/bash

gnome-terminal -- python3 server.py
sleep 1
/bin/sh -ec 'firefox index.html'
#!/bin/bash
sudo apt update
echo
echo "Installing pip..."
sudo apt-get install python3-pip
echo
echo "Installing asyncio..."
pip3 install asyncio
echo
echo "Installing websockets..."
pip3 install websockets
echo
echo "Done!"

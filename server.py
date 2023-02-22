import asyncio
import websockets
import json
import os.path

HOST = ''
PORT = 5000

def save_data(data):
    with open("data.json", "w") as file:
        file.write(json.dumps(data))

def get_data():
    with open("data.json", "r") as file:
        json_string = file.read()
        if len(json_string) == 0:
            return {}
        else:
            return json.loads(json_string)
#
async def parse_data(data):
    execute = asyncio.get_event_loop().run_in_executor
    if "type" in data:
        if data["type"] == "STOP":
            return None
        elif data["type"] == "POST":
            if "data" in data:
                await execute(None, save_data, data["data"])
                return {"type": "POST"}
            else:
                return {"error": 400}
        elif data["type"] == "GET":
            if await execute(None, os.path.exists, "data.json"):
                database_data = await execute(None, get_data)
                return {"type": "GET", "data": database_data}
            else:
                return {"error": 404}

    return {"error": 400}
#
async def handle_request(websocket, path):
    # Execute sync function async
    execute = asyncio.get_event_loop().run_in_executor
    # Connection with client established
    await execute(None, print, "Connected")
    # Maintain the connection
    while True:
        try:
            # Wait for a message from the client
            request = await websocket.recv()
            # INFO - Reqest received from the client
            await execute(None, print, "Reqest Received")

            # Parse the JSON message
            data = await execute(None, json.loads, request)
            # Parse the data
            response = await parse_data(data)
    
            if response == None:
                # Close the WebSocket connection and stop the server
                await websocket.close()
                asyncio.get_event_loop().stop()
                # INFO - Stopping the server
                await execute(None, print, "Stopping Server...")
                return
            
            # Send the response to the client
            await websocket.send(json.dumps(response))
            # INFO - Response sent to the client
            await execute(None, print, "Response Sent")
        
        except websockets.exceptions.ConnectionClosed:
            await execute(None, print, "Closed")
            await websocket.close()
            break
        

def main():
    # Start the websocket server
    print("Starting Server...")
    start_server = websockets.serve(handle_request, HOST, PORT)
    asyncio.get_event_loop().run_until_complete(start_server)

    # Server is running
    print("Running...")
    asyncio.get_event_loop().run_forever()

if __name__ == "__main__":
    main()
import asyncio
import websockets
import json
import os.path

HOST = 'localhost'
PORT = 8000

HTML_400 = (False, {"error": True, "code": 400})
HTML_404 = (False, {"error": True, "code": 404})
OK = (False, {"error": False})
STOP = (True, {})

DATABASE_PATH = "data.json"

def save_data(data):
    with open(DATABASE_PATH, "w") as file:
        file.write(json.dumps(data))

def get_data():
    with open(DATABASE_PATH, "r") as file:
        json_string = file.read()
        if len(json_string) == 0:
            return {}
        else:
            return json.loads(json_string)

async def parse_data(data):
    execute = asyncio.get_event_loop().run_in_executor
    if "type" in data and "data" in data:
        if data["type"] == "STOP":
            return STOP
        elif data["type"] == "POST":
            await execute(None, save_data, data["data"])
            return OK
        elif data["type"] == "GET":
            if os.path.exists(DATABASE_PATH):
                database_data = await execute(None, get_data)
                return (False, {"error": False, "data": database_data})
            else:
                return HTML_404

    return HTML_400

async def handle_request(websocket, path):
    execute = asyncio.get_event_loop().run_in_executor
    await execute(None, print, "CONNECTED")
    # Wait for a message from the client
    json_string = await websocket.recv()

    # Parse the JSON message
    data = await execute(None, json.loads, json_string)

    # Parse the data
    stop, response = await parse_data(data)

    if stop == True:
        # Close the WebSocket connection and stop the server
        await websocket.close()
        asyncio.get_event_loop().stop()
        return
    
    # Send the response to the client
    await websocket.send(json.dumps(response))

def main():
    # Start the websocket server
    print("Starting Server...")
    start_server = websockets.serve(handle_request, HOST, PORT)
    asyncio.get_event_loop().run_until_complete(start_server)

    # Server is running
    print("Running")
    asyncio.get_event_loop().run_forever()

if __name__ == "__main__":
    main()
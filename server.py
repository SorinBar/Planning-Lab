import asyncio
import json
import websockets

HOST = 'localhost'
PORT = 8000

async def parse_data(data):
    execute = asyncio.get_event_loop().run_in_executor
    if "type" not in data:
        return (False, {"error": "True", "code": 400})
    else:
        await execute(None, print, "Correct format")
        
        
        return (False, {})

async def handle_request(websocket, path):
    await asyncio.get_event_loop().run_in_executor(None, print, "connected")
    # Wait for a message from the client
    json_data = await websocket.recv()

    # Parse the JSON message
    execute = asyncio.get_event_loop().run_in_executor
    data = await execute(None, json.loads, json_data)

    # Parse the data
    stop, response = await parse_data(data)

    if stop == True:
        # Close the WebSocket connection and stop the server
        await websocket.close()
        asyncio.get_event_loop().stop()
        return
    
    # Send the response to the client
    await websocket.send(json.dumps(response))


# Start the websocket server
print("Starting Server...")
start_server = websockets.serve(handle_request, HOST, PORT)
asyncio.get_event_loop().run_until_complete(start_server)

# Server is running
print("Running ")
asyncio.get_event_loop().run_forever()
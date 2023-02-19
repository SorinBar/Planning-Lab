import asyncio
import json
import websockets
import time

async def handle_message(websocket, path):
    # Wait for a message from the client
    message = await websocket.recv()

    # Parse the JSON message
    data = json.loads(message)

    if data["name"] == 'stop':
        # Gracefully close the WebSocket connection and stop the server
        await websocket.close()
        asyncio.get_event_loop().stop()
        return

    # Loop Back
    time.sleep(1)
    # Process the message
    response = {'message': f'Hello, {data["name"]}!'}

    # Send a response back to the client in JSON format
    response_json = json.dumps(response)
    await websocket.send(response_json)

# Start the websocket server
print("Starting Server...")
start_server = websockets.serve(handle_message, 'localhost', 8000)

asyncio.get_event_loop().run_until_complete(start_server)
print("Running")
asyncio.get_event_loop().run_forever()
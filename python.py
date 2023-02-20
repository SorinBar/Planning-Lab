import asyncio
import websockets

async def handle_connection(websocket, path):
    # Handle messages from the client here
    message = await websocket.recv()
    print(f"Received message: {message}")
    response = f"Received message: {message}"
    await websocket.send(response)

async def start_server():
    # Create the WebSocket server
    server = await asyncio.start_server(
        handle_connection, 'localhost', 8765,
        family=socket.AF_INET6  # Use IPv6 to listen on localhost
    )

    print("Server started, waiting for a single client connection...")

    # Wait for a single client connection
    client_socket, _ = await server.accept()

    # Wrap the client socket in a WebSocket protocol instance
    websocket = websockets.server.WebSocketServerProtocol(
        client_socket=client_socket,
        max_size=None,  # Unlimited message size
        max_queue=None,  # Unlimited message queue size
        read_limit=2 ** 16,  # 64KiB per message
        write_limit=2 ** 16,  # 64KiB per message
    )

    # Handle messages from the connected client
    await handle_connection(websocket, None)

asyncio.run(start_server())

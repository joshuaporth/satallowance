import asyncio
import json
import logging

from cktap.transport import find_cards
from websockets.asyncio.server import serve, ServerConnection

logger = logging.getLogger(__name__)
logging.basicConfig(filename="satallowance.log", level=logging.INFO)

async def server(websocket: ServerConnection):
    logger.info("Waiting for SATSCARD...")
    nop_message = json.dumps({ "type": "ping" })
    try:
        while True:
            try:
                for c in find_cards():
                    if c.is_tapsigner:
                        logger.warning(f"TAPSIGNER detected. Ignoring card {c.card_ident}.")
                        continue
                    logger.info(f"SATSCARD {c.card_ident} found. Sending address to client.")
                    addr_message = json.dumps({
                        "type": "address",
                        "message": c.get_address()
                    })
                    return await websocket.send(addr_message)
            except RuntimeError as e:
                logger.error(e)
                return await websocket.close(1011, str(e))
            except:
                logger.warning("Error reading card(s). We'll try again.")
                pass
            await websocket.send(nop_message)
            await asyncio.sleep(1)
    except:
        logger.error("Connection closed while waiting for SATSCARD.")
        pass
        
async def main():
    async with serve(server, "localhost", 8080):
        await asyncio.get_running_loop().create_future()

if __name__ == "__main__":
    asyncio.run(main())

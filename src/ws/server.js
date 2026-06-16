
import { WebSocket, WebSocketServer} from 'ws';
import { wsArcjet } from "../arcjet.js";
// ensure socket open before server 

// send payload to one socket

function sendJson(socket, payload ){
    if(socket.readyState !== WebSocket.OPEN ) return; // guard function to check websocket is in ready state 

    socket.send(JSON.stringify(payload)); //  payload send to client 

}


// broadcast to all connected clients
function broadcast(wss, payload ){
    // this loops consider all active connections
    for (const client of wss.clients){
        // if(client.readyState !== WebSocket.OPEN ) return;
        // client.send(JSON.stringify(payload));


        // For WebSocket broadcasting, continue is usually the correct choice because one disconnected client should not block everyone else.

        //  first check state is not open 
        if (client.readyState !== WebSocket.OPEN)
            continue;
        // if client is ready then send the message 
        client.send(JSON.stringify(payload));

    }

}

// attach websocket logic to node server

export function attachWebSocketServer(server){
    // create new websocket server
    const wss = new WebSocketServer({
        server, 
        path: '/ws',
        maxPayload: 1024 * 1024, 
    });

    wss.on('connection', async (socket, req) =>{
        console.log("WebSocket connected");
        // arcjet will protet your website 
        if(wsArcjet){
            try{
                const decision = await wsArcjet.protect(req);
                if(decision.isDenied()){
                    const code = decision.reason.isRateLimit() ? 1013 : 1008 ;
                    const reason = decision.reason.isRateLimit() ? 'Rate limit exceeded' : 'Access denied';

                    socket.close(code, reason);
                    return ;
                }
            } catch(e){
                console.error('WS Connection error', e);
                socket.close(1011, 'Server security error');
                return;
            }
        }

        socket.isAlive = true; 
        socket.on('pong', ()=>{ socket.isAlive= true; });


        sendJson(socket, { type: 'welcome'});
        socket.on('error', console.error);

        socket.on("close", () => {
            console.log("WebSocket disconnected");
        });

    });

    function broadcastMatchCreated(match){
        // it will take the match and broadcast to the entore web server 
        // broadcastMatchCreated(wss, { type: 'match_created', data: match });
        broadcast(wss, {
            type: "match_created",
            data: match,
        });
    }
    
    return {broadcastMatchCreated}
}




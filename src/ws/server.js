
import { WebSocket, WebSocketServer} from 'ws';

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

    wss.on('connection', (socket) =>{
        console.log("WebSocket connected");


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




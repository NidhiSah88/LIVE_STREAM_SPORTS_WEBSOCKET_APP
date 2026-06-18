
import { WebSocket, WebSocketServer} from 'ws';
import { wsArcjet } from "../arcjet.js";

// we can track wich sockets to subscribe to which matches 
// using map because it automatically prevents a suer from being added twice 
// to the same  match , that difference between map and array 

const matchSubscribers = new Map();

function subscribe(matchId, socket){
    if(!matchSubscribers.has(matchId)){
        matchSubscribers.set(matchId, new Set());
    }
    matchSubscribers.get(matchId).add(socket);
}

function unsubscribe(matchId, socket){
    const subscribers = matchSubscribers.get(matchId);
    if(!subscribers) return;
    subscribers.delete(socket);
    if(subscribers.size === 0){
        matchSubscribers.delete(matchId);
    }
}

function cleanupSubscription(socket){
    for(const matchId of socket.subscriptions){
        unsubscribe(matchId, socket);
    }
}


// send data to interested people 
function broadcastToMatch(matchId, payload){
    const subscribers = matchSubscribers.get(matchId);
    if(!subscribers || subscribers.size === 0) return;
 console.log(
    "Subscribers:",
    subscribers?.size
);

    const message = JSON.stringify(payload);

    for(const client of subscribers){
        console.log(
            "readyState:",
            client.readyState
        );


        if(client.readyState === WebSocket.OPEN){
            console.log(
                "Sending:",
                message
            );

            
            client.send(message);

        }
    }
}

// handle socket 

function handleSocketMessage(socket, data){
    let message;

    try{
        message = JSON.parse(data.toString());
        console.log("Incoming WS:", message);

    } catch(e){
        sendJson(socket, { type: 'error', message: 'Invalid JSON'});  
        return;      
    }

    if(message?.type === "subscribe" && Number.isInteger(message.matchId)){
        
                const matchId = Number(message.matchId);

        console.log(
            "SUBSCRIBE →",
            matchId
        );


        // subscribe the user 
        subscribe(message.matchId, socket);
        socket.subscriptions.add(message.matchId);
        sendJson(socket, { type: 'subscribed', matchId: message.matchId });
        return;
    }

    if(message?.type === "unsubscribe" && Number.isInteger(message.matchId)){
        unsubscribe(message.matchId, socket);
        socket.subscriptions.delete(message.matchId);
        sendJson(socket, { type: 'unsubscribed', matchId: message.matchId });
    }

}

// ensure socket open before server 

// send payload to one socket

function sendJson(socket, payload ){
    if(socket.readyState !== WebSocket.OPEN ) return; // guard function to check websocket is in ready state 

    socket.send(JSON.stringify(payload)); //  payload send to client 

}


// broadcast to all connected clients
function broadcastToAll(wss, payload ){
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
   // Protect websocket upgrade requests
    server.on("upgrade", async (req, socket) => {
        if (!wsArcjet) return;
        
            try{
                const decision = await wsArcjet.protect(req);
                if(decision.isDenied()){
                    if(decision.reason.isRateLimit()){
                        socket.write('HTTP/1.1 429 Too many request\r\n\r\n');
                    } else {
                        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
                    }
                    socket.destroy();
                    return;
                }
            } catch(e){
                console.error('WS upgrade protection error', e);
                socket.write('HTTP/1.1 500 internal server error\r\n\r\n');
                socket.destroy();
                return;
            }
    });
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

        // attach socket to set to remember what subscribe to 
        socket.subscriptions = new Set();

        sendJson(socket, { type: 'welcome'});

        socket.on('message', (data) => {
            handleSocketMessage(socket,data);
        });

        socket.on('error', () => {
            socket.terminate();
        });

        socket.on('close', () => {
            cleanupSubscription(socket);
        });


        socket.on('error', console.error);

        socket.on("close", () => {
            console.log("WebSocket disconnected");
        });

    });

    function broadcastMatchCreated(match){
        // it will take the match and broadcast to the entore web server 
        // broadcastMatchCreated(wss, { type: 'match_created', data: match });
        broadcastToAll(wss, {
            type: "match_created",
            data: match,
        });
    }

    function broadcastCommentary(matchId, comment) {
          console.log(
                "Broadcasting commentary",
                matchId
            );


        broadcastToMatch(matchId, {
            type: "commentary",
            data: comment,
        });
    }
    
    return {broadcastMatchCreated, broadcastCommentary };

}




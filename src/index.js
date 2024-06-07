const { rejects } = require('assert');
const express = require('express');
const http = require('http');
const { resolve } = require('path');
const { Server } = require('socket.io');
const tmx = require('tmx-parser');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

async function main(){
    map = await new Promise((resolve,reject)=>{
        tmx.parseFile("./src/untitled.tmx", function(err, loadedMap) {
            if (err) return err;
            map = loadedMap;
            resolve(loadedMap);
        });
    });
        const layer = map.layers[0];
        const tiles = layer.tiles;
        const map2D = [];

        for(let row = 0; row <= map.height; row++){
            const tileRow =[];
            for(let col = 0; col <= map.width; col++)
                {
                    const tile = tiles[row * map.height + col];
                    tileRow.push(tiles[row * map.height + col]);
                }
                map2D.push(tileRow);
        }
        console.log("map2D",map2D);
        io.on("connection", (socket)=> {
            console.log("socket",socket.id);

            io.emit('map',map2D);
        });
        
        app.use(express.static("public"));
        
        httpServer.listen(5000, () => console.log('listening'));
}

main();
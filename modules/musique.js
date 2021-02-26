import * as ytdl from 'ytdl-core';

function playMusic(connection){
    let dispatcher = connection.play(ytdl(list [0], { quality: "highestaudio"}), { volume: 0.5});

    dispatcher.on("finish", () => {
        list.shift();
        dispatcher.destroy();

        if(list.length > 0){
            playMusic(connection);
        }
        else{
            connection.disconnect();
        }
    });

   dispatcher.on("error", err => {
       console.log("erreur de dispatcher : " + err);
       dispatcher.destroy();
       connection.disconnect();
    });
}

export { playMusic };
const {mainSocket, serverPort, startDb} = require("./sources/domain/server/Server");

console.log("STARTED SUCCESFULLY")

startDb(serverPort);


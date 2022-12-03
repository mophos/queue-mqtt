
var path = require('path');
require('dotenv').config({ path: path.join(__dirname, './config') });

const port = 1883
const wsPort = +process.env.MQTT_HTTP_PORT || 8080

const aedes = require('aedes')(
  {
    authenticate: (client, username, password, callback) => {
      var mqttUser = process.env.MQTT_USER || 'q4u';
      var mqttPassword = process.env.MQTT_PASSWORD.toString() || '##q4u##';
      var authorized = (username === mqttUser && password.toString() === mqttPassword);
      if (authorized) client.user = username;
      callback(null, authorized);
    },
  }
)

const server = require('net').createServer(aedes.handle);
const httpServer = require('http').createServer()
const ws = require('websocket-stream')
ws.createServer({ server: httpServer }, aedes.handle)

server.listen(port, function () {
  console.debug('Ades MQTT listening on port: ' + port)
})

httpServer.listen(wsPort, function () {
  console.debug('Aedes MQTT-WS listening on port: ' + wsPort)
  aedes.publish({ topic: 'aedes/hello', payload: "I'm broker " + aedes.id })
});

server.on('clientConnected', function (client) {
  console.log('Client Connected:', client.id);
});

// fired when a client disconnects
server.on('clientDisconnected', function (client) {
  console.log('Client Disconnected:', client.id);
});

server.on('published', function (packet, client) {
  console.log(packet);
  console.log('Published', packet.payload.toString());
});

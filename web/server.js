const express = require("express");
const http = require("http");
const mqtt = require("mqtt");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Conexão com o servidor MQTT Broker
const mqttClient = mqtt.connect("mqtt://test.mosquitto.org"); // Substitua "localhost" pelo endereço do seu servidor MQTT Broker

mqttClient.on("connect", function () {
  console.log("Conectado ao servidor MQTT Broker");

  // Inscreva-se nos tópicos MQTT para receber os dados
  mqttClient.subscribe("sensor/niveldeagua");
});

mqttClient.on("message", function (topic, message) {
  // Quando receber uma mensagem MQTT, emita-a para os clientes conectados via Socket.IO
  io.emit("dados", { topic, message: message.toString() });
});

// Rota para a página web
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Inicie o servidor HTTP
const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
  console.log(`Servidor web iniciado na porta ${PORT}`);
});

const express = require("express");
const http = require("http");
const mqtt = require("mqtt");
const socketIO = require("socket.io");
const path = require("path");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Conexão com o servidor MQTT Broker
const mqttClient = mqtt.connect("mqtt://test.mosquitto.org:1883"); // Substitua pelo endereço do seu servidor MQTT Broker

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Aqui você pode manipular os dados recebidos e enviar uma resposta
mqttClient.on("connect", function () {
  console.log("Conectado ao servidor MQTT Broker");
});

mqttClient.on("message", function (topic, message) {
  io.emit("dados", { topic, message: message.toString() });
  console.log("Mensagem recebida no tópico", topic, ":", message.toString());
});

app.get("/monitorar", (req, res) => {
  const id = req.query.id;
  if (!id) {
    res.status(400).send("ID do dispositivo não fornecido");
    return;
  }
  mqttClient.subscribe(`monitora-rs/dispositivo/${id}`, function (err) {
    if (err) {
      res.status(500).send("Erro ao subscrever ao tópico MQTT");
      return;
    }
    console.log(`Inscrito no tópico monitora-rs/dispositivo/${id}`);
    res.sendFile(path.join(__dirname, "public", "monitora.html"));
  });
});

app.get("/mostrartudo", (req, res) => {
  const id = req.query.id;
  if (!id) {
    res.status(400).send("ID do dispositivo não fornecido");
    return;
  }
  mqttClient.subscribe(`monitora-rs/dispositivo/${id}`, function (err) {
    if (err) {
      res.status(500).send("Erro ao subscrever ao tópico MQTT");
      return;
    }
    console.log(`Inscrito no tópico monitora-rs/dispositivo/${id}`);
    res.sendFile(path.join(__dirname, "public", "mostrartudo.html"));
  });
});

// Inicie o servidor HTTP
const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
  console.log(`Servidor web iniciado na porta ${PORT}`);
});

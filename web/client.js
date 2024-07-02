const mqtt = require("mqtt");

// Configurações do servidor MQTT Broker
const brokerUrl = "mqtt://test.mosquitto.org"; // Substitua "localhost" pelo endereço do seu servidor MQTT Broker
const topic = "monitora-rs/dispositivo/1"; // Tópico para enviar os dados
const qos = 0; // Nível de QoS (0: At most once, 1: At least once, 2: Exactly once)
const retain = false; // Retain flag

//////////////////////////////


// Dados simulados do dispositivo
const dados = {
  mensagem: "Situação alarmante.", // Situação preocupante // Situação comum
  nivel_de_agua: "32", // acima do solo
  temperatura: "12", // Temperatura
  nivel_alarmante: 3, // Escala. 1 = sussa. 2 = medio. 3= alarmante
};

// Função para publicar dados MQTT
function publicar() {
  // Conexão com o servidor MQTT Broker
  const client = mqtt.connect(brokerUrl);

  client.on("connect", function () {
    console.log("Conectado ao servidor MQTT Broker");

    // Publicar dados MQTT
    client.publish(
      topic,
      JSON.stringify(dados),
      { qos, retain },
      function (err) {
        if (err) {
          console.error("Erro ao publicar mensagem MQTT:", err);
        } else {
          console.log(
            `Dados publicados com sucesso no tópico '${topic}':`,
            dados
          );
        }

        // Encerrar conexão com o servidor MQTT Broker após a publicação
        client.end();
      }
    );
  });

  client.on("error", function (err) {
    console.error("Erro de conexão MQTT:", err);
  });
}

// Publicar dados a cada intervalo de tempo (em milissegundos)
const intervalo = 5000; // 5 segundos
setInterval(publicar, intervalo);

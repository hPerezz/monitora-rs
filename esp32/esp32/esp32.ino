#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "sua_rede_wifi";
const char* password = "sua_senha_wifi";
const char* mqtt_server = "test.mosquitto.org";
const char* mqtt_topic = "sensor/niveldeagua";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

float nivel_de_agua = 0; // Simulado, substitua pelo seu sensor
float temperatura = 0; // Simulado, substitua pelo seu sensor

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Conectando a ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.println("Endereço IP: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Mensagem recebida no tópico: ");
  Serial.println(topic);
  Serial.print("Conteúdo: ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Tentando se conectar ao broker MQTT...");
    if (client.connect("ESP32Client")) {
      Serial.println("Conectado");
      client.subscribe("inTopic");
    } else {
      Serial.print("Falha, rc=");
      Serial.print(client.state());
      Serial.println(" Tentando novamente em 5 segundos");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Simula a leitura do sensor
  nivel_de_agua += 0.1;
  temperatura += 1;

  // Monta a mensagem JSON
  StaticJsonDocument<200> doc;
  doc["nivel_de_agua"] = nivel_de_agua;
  doc["temperatura"] = temperatura;

  char buffer[512];
  serializeJson(doc, buffer);

  // Envia mensagem para o broker MQTT
  client.publish(mqtt_topic, buffer);

  delay(6000); // Aguarda 6 segundos antes de enviar o próximo dado
}

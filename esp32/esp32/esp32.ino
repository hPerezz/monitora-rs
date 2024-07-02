#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ssid = "iPerez";
const char* password = "12345678";
const char* mqtt_server = "test.mosquitto.org";
const char* mqtt_topic = "monitora-rs/dispositivo/1";
const int mqtt_port = 1883; 

WiFiClient espClient;
PubSubClient client(espClient);

float nivel_de_agua = 0;
float temperatura = 20;

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
        delay(5000);
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
  client.setServer(mqtt_server, mqtt_port);  // manda
  client.setCallback(callback);              // escuta
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // muda valor do sensor cada vez que loopa
  nivel_de_agua += 0.1;
  temperatura += 1;

  // monta o JSON
  StaticJsonDocument<200> doc;

  doc["temperatura"] = temperatura;
  doc["nivel_de_agua"] = nivel_de_agua;

  // encapsula
  char buffer[256];
  serializeJson(doc, buffer);

  // verifica se ainda está conectado antes de publicar
  if (client.connected()) {

    if (client.publish(mqtt_topic, buffer, false)) {  // Set QoS to 0
      Serial.print("Publicado: ");
      Serial.println(buffer);
    } else {
      Serial.println("Falha ao publicar");
    }
  } else {
    Serial.println("Não conectado ao broker, não foi possível publicar");
  }
  delay(10000);
}

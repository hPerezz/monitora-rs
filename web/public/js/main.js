const socket = io();

socket.on("dados", function (data) {
  //const listItem = document.getElementById(data.topic);
  sensor_readings = JSON.parse(data.message);
  text_box = document.getElementById("dadosList");
  text_box.innerHTML =
    sensor_readings.mensagem +
    "<br><br>" +
    "<b>💧 Nível de água</b>: " +
    sensor_readings.nivel_de_agua +
    "m do solo<br><br>" +
    "<b>🌡️ Temperatura</b>: " +
    sensor_readings.temperatura +
    "ºC";

  var nivelAlarmante = parseInt(sensor_readings.nivel_alarmante);
  console.log("Nivel:" + nivelAlarmante);
  var container = document.querySelector(".container-select-shelter100");
  if (nivelAlarmante === 3) {
    if (container) {
      container.style.setProperty(
        "background",
        "linear-gradient(-135deg, #0a0a0a, #920000)"
      );
    }
  }

  if (nivelAlarmante === 2) {
    if (container) {
      container.style.setProperty(
        "background",
        "linear-gradient(-135deg, #0a0a0a, #FFF500)"
      );
    }
  }
});

function obterValorDoId() {
  // Obtém a parte da query da URL
  var queryString = window.location.search;

  // Cria um objeto URLSearchParams com a parte da query da URL
  var urlParams = new URLSearchParams(queryString);

  // Obtém o valor do parâmetro "id"
  var id = urlParams.get("id");

  // Retorna o valor do parâmetro "id"
  return id;
}
fetch("/db.json")
  .then((response) => response.json())
  .then((data) => {
    // Obtendo o valor do id da URL
    var id = obterValorDoId();

    // Encontrando o objeto com o id obtido
    const item = data.find((obj) => obj.id === parseInt(id));

    // Verificando se o objeto foi encontrado
    if (item) {
      // Obtendo o nome do abrigo
      const nomeAbrigo = item.nome;

      // Atualizando o texto dentro do span com o nome do abrigo
      var nomeAbrigoSpan = document.getElementById("nomeAbrigo");
      nomeAbrigoSpan.innerText = nomeAbrigo;

      // Obtendo os dados de latitude e longitude
      const latitude = item.latitude;
      const longitude = item.longitude;

      // Atualizando o centro e posição do marcador com os valores de latitude e longitude
      var map = document.getElementById("map");
      map.setAttribute("center", `${latitude},${longitude}`);
      var marker = document.getElementById("marker");
      marker.setAttribute("position", `${latitude},${longitude}`);
    } else {
      console.log(`Não foi encontrado nenhum item com id ${id}.`);
    }
  })
  .catch((error) => console.error("Ocorreu um erro:", error));

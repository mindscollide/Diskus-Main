import Paho from "paho-mqtt";
export const onConnected = (newClient, subscribeID) => {
  console.log("Connected to MQTT broker onConnected");
  newClient.subscribe(subscribeID.toString());
};

export const onConnectionLost = () => {
  console.log("Connected to MQTT broker onConnectionLost");
  setTimeout(mqttConnection, 3000);
};

export const mqttConnection = (newClient, subscribeID) => {
  var min = 10000;
  console.log("mqtt resquest ")
  var max = 90000;
  var id = min + Math.random() * (max - min);
  newClient = new Paho.Client("192.168.18.241", 8228, subscribeID + "-" + id);
  newClient.connect({
    // cleanSession: false,
    onSuccess: () => {
      console.log("Connected to MQTT broker");
      onConnected(newClient,subscribeID);
    },
    onFailure: () => {
      console.log("Connected to MQTT broker onFailedConnect");
      // setTimeout(onConnectionLost, 6000);
    },
    keepAliveInterval: 30,
    reconnect: true, // Enable automatic reconnect
  });

  // setClient(newClient);
};

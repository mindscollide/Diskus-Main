import Paho from "paho-mqtt";
import { useEffect } from "react";
import { setClient } from "../../store/actions/Auth2_actions";
import Helper from "./history_logout";
let newClient;

export const onConnected = (newClient, subscribeID) => {
  console.log("Connected to MQTT broker onConnected");
  newClient.subscribe(subscribeID.toString());
  // localStorage.setItem('MqttConnectionState', true)
};

export const onConnectionLost = (subscribeID) => {
  console.log("Connected to MQTT broker onConnectionLost");
  setTimeout(mqttConnection(subscribeID), 3000);
  // localStorage.setItem('MqttConnectionState', false)
};

export const mqttConnection = (subscribeID) => {
  var min = 10000;
  console.log("mqtt resquest ");
  var max = 90000;
  var id = min + Math.random() * (max - min);

  newClient = new Paho.Client(
    "192.168.18.241",
    8228,
    parseInt(subscribeID) + "-" + id
  );
  newClient.connect({
    // cleanSession: false,
    onSuccess: () => {
      console.log("Connected to MQTT broker");
      onConnected(newClient, subscribeID);
    },

    onFailure: () => {
      console.log("Connected to MQTT broker onFailedConnect");
      setTimeout(onConnectionLost(subscribeID), 6000);
    },
    keepAliveInterval: 30,
    reconnect: true, // Enable automatic reconnect
  });
  Helper.socket = newClient;
  setClient(newClient);
};

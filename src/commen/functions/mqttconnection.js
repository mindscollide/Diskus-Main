import Paho from "paho-mqtt";
import { useEffect } from "react";
import { setClient } from "../../store/actions/Auth2_actions";
import Helper from "./history_logout";
let newClient;

export const onConnected = (newClient, subscribeID) => {
  console.log("Connected to MQTT broker onConnected");
  if (newClient.isConnected()) {
    newClient.subscribe(subscribeID.toString());
  } else {
    console.log("WebSocket is not in OPEN state for subscription.");
  }
};
export const onConnectionLost = (subscribeID) => {
  console.log("Connected to MQTT broker onConnectionLost");
  setTimeout(mqttConnection(subscribeID), 3000);
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

  var options = {
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
    userName: process.env.REACT_APP_MQTT_User,
    password: process.env.REACT_APP_MQTT_Pass,
  };
  newClient.connect(options);
  Helper.socket = newClient;
  setClient(newClient);
};
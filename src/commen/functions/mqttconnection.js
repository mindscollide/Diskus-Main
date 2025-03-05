import Paho from "paho-mqtt";
import { setClient } from "../../store/actions/Auth2_actions";
import Helper from "./history_logout";

let newClient;

export const mqttConnection = (subscribeID, dispatch) => {
  if (!subscribeID) {
    console.error("No subscribeID provided for MQTT connection.");
    return;
  }

  const min = 10000;
  const max = 90000;
  const id = min + Math.random() * (max - min);
  const clientId = `${subscribeID}-${id}`;

// Construct the correct broker URL
const brokerUrl = `ws://${process.env.REACT_APP_MQTT}:${process.env.REACT_APP_MQTT_PORT}/mqtt`;

  newClient = new Paho.Client(brokerUrl, clientId);

  newClient.onConnectionLost = (responseObject) => {
    console.log("Connection lost:", responseObject.errorMessage);
    setTimeout(() => mqttConnection(subscribeID, dispatch), 6000); // Reconnect after 3 seconds
  };

  const options = {
    onSuccess: () => {
      console.log("Connected to MQTT broker");
      newClient.subscribe(subscribeID.toString(), {
        onSuccess: () => console.log(` MQTT Subscribed to ${subscribeID}`),
        onFailure: (error) =>
          console.log(` MQTT Subscription failed: ${error.errorMessage}`),
      });
    },
    onFailure: (error) => {
      console.log("Failed to connect to MQTT broker:", error.errorMessage);
      setTimeout(() => mqttConnection(subscribeID, dispatch), 6000); // Retry connection after 6 seconds
    },
    keepAliveInterval: 30,
    reconnect: true,
    userName: process.env.REACT_APP_MQTT_User,
    password: process.env.REACT_APP_MQTT_Pass,
  };

  newClient.connect(options);
  Helper.socket = newClient;
  dispatch(
    setClient({
      clientId: newClient.clientId,
      isConnected: newClient.isConnected(),
    })
  );
};

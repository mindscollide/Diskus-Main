import Paho from "paho-mqtt";
import { setClientGuest } from "../../store/actions/Guest_Video";
import Helper from "./history_logout";

let newClient;

export const mqttConnectionGuestUser = (subscribeID) => {
  if (!subscribeID) {
    console.error("No subscribeID provided for MQTT connection.");
    return;
  }

  const min = 10000;
  const max = 90000;
  const id = min + Math.random() * (max - min);
  const clientId = `${subscribeID}-${id}`;

  newClient = new Paho.Client("192.168.18.241", 8228, clientId);

  newClient.onConnectionLost = (responseObject) => {
    console.log("Guest Connection lost:", responseObject.errorMessage);
    setTimeout(() => mqttConnectionGuestUser(subscribeID), 3000); // Reconnect after 3 seconds
  };

  // newClient.onMessageArrived = onMessageArrived;

  const options = {
    onSuccess: () => {
      console.log("Guest Connected to MQTT broker");
      newClient.subscribe(subscribeID.toString(), {
        onSuccess: () => console.log(`Guest MQTT Subscribed to ${subscribeID}`),
        onFailure: (error) =>
          console.log(`Guest MQTT Subscription failed: ${error.errorMessage}`),
      });
    },
    onFailure: (error) => {
      console.log("Guest Failed to connect to MQTT broker:", error.errorMessage);
      setTimeout(() => mqttConnectionGuestUser(subscribeID), 6000); // Retry connection after 6 seconds
    },
    keepAliveInterval: 30,
    reconnect: true,
    userName: process.env.REACT_APP_MQTT_User,
    password: process.env.REACT_APP_MQTT_Pass,
  };

  newClient.connect(options);
  Helper.guestSocket = newClient;
  setClientGuest(newClient);
};

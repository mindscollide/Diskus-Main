import Paho from "paho-mqtt";
import { setClientGuest } from "../../store/actions/Guest_Video";
import Helper from "./history_logout";

let newClient;

export const mqttConnectionGuestUser = (subscribeID, dispatch) => {
  try {
    if (!subscribeID) {
      console.error("No subscribeID provided for MQTT connection.");
      return;
    }

    const min = 10000;
    const max = 90000;
    const id = min + Math.random() * (max - min);
    const clientId = `${subscribeID}-${id}`;

    if (process.env.REACT_APP_ENV === "dev") {
      newClient = new Paho.Client(
        process.env.REACT_APP_MQTT,
        process.env.REACT_APP_MQTT_PORT,
        clientId
      );
    } else {
      const brokerUrl = `wss://${process.env.REACT_APP_MQTT}:${process.env.REACT_APP_MQTT_PORT}/mqtt`;
      newClient = new Paho.Client(brokerUrl, clientId);
    }

    newClient.onConnectionLost = (responseObject) => {
      console.error("Guest Connection lost:", responseObject.errorMessage);
      setTimeout(() => mqttConnectionGuestUser(subscribeID, dispatch), 3000); // Reconnect after 3 seconds
    };

    const options = {
      onSuccess: () => {
        console.log("Guest Connected to MQTT broker");
        try {
          newClient.subscribe(subscribeID.toString(), {
            onSuccess: () =>
              console.log(`Guest MQTT Subscribed to ${subscribeID}`),
            onFailure: (error) =>
              console.error(
                `Guest MQTT Subscription failed: ${error.errorMessage}`
              ),
          });
        } catch (subError) {
          console.error("Error during guest subscription:", subError.message);
        }
      },
      onFailure: (error) => {
        console.error(
          "Guest Failed to connect to MQTT broker:",
          error.errorMessage
        );
        setTimeout(() => mqttConnectionGuestUser(subscribeID, dispatch), 6000); // Retry connection after 6 seconds
      },
      keepAliveInterval: 30,
      reconnect: true,
      userName: process.env.REACT_APP_MQTT_User,
      password: process.env.REACT_APP_MQTT_Pass,
    };

    newClient.connect(options);
    dispatch(setClientGuest(newClient));
  } catch (error) {
    console.error("Error in Guest MQTT connection:", error.message);
    setTimeout(() => mqttConnectionGuestUser(subscribeID, dispatch), 6000); // Retry connection after 6 seconds
  }
};

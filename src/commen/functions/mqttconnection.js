import Paho from "paho-mqtt";
import { setClient } from "../../store/actions/Auth2_actions";
import Helper from "./history_logout";
import { decrypt } from "./utils";

let newClient;

export const mqttConnection = (subscribeID, dispatch) => {
  try {
    if (!subscribeID) {
      console.error("No subscribeID provided for MQTT connection.");
      return;
    }

    const min = 10000;
    const max = 90000;
    const id = min + Math.random() * (max - min);
    const clientId = `${subscribeID}-${id}`;
    // Construct the correct broker URL

    if (process.env.REACT_APP_ENV === "dev") {
      newClient = new Paho.Client("192.168.18.243", 8228, clientId);
    } else {
      const brokerUrl = `wss://${process.env.REACT_APP_MQTT}:${process.env.REACT_APP_MQTT_PORT}/mqtt`;

      newClient = new Paho.Client(brokerUrl, clientId);
    }

    newClient.onConnectionLost = (responseObject) => {
      console.error("MQTT Connection lost:", responseObject.errorMessage);
      setTimeout(() => mqttConnection(subscribeID, dispatch), 6000); // Reconnect after 6 seconds
    };

    const options = {
      onSuccess: () => {
        console.log("Connected to MQTT broker");
        try {
          newClient.subscribe(subscribeID.toString(), {
            onSuccess: () => console.log(`MQTT Subscribed to ${subscribeID}`),
            onFailure: (error) =>
              console.error(`MQTT Subscription failed: ${error.errorMessage}`),
          });
        } catch (subError) {
          console.error("Error during subscription:", subError.message);
        }
      },
      onFailure: (error) => {
        console.error("Failed to connect to MQTT broker:", error.errorMessage);
        setTimeout(() => mqttConnection(subscribeID, dispatch), 6000); // Retry connection after 6 seconds
      },
      keepAliveInterval: 30,
      reconnect: true,
      userName: decrypt(
        process.env.REACT_APP_MQTT_User,
        process.env.REACT_APP_SECERETKEY
      ),
      password: decrypt(
        process.env.REACT_APP_MQTT_Pass,
        process.env.REACT_APP_SECERETKEY
      ),
    };

    newClient.connect(options);
    Helper.socket = newClient;

    dispatch(
      setClient({
        clientId: newClient.clientId,
        isConnected: newClient.isConnected(),
      })
    );
  } catch (error) {
    console.error("Error in MQTT connection:", error.message);
    setTimeout(() => mqttConnection(subscribeID, dispatch), 6000); // Retry connection after 6 seconds
  }
};

import Paho from "paho-mqtt";
import { setClientGuest } from "../../store/actions/Guest_Video";
import { decrypt } from "./utils";

let newClient;

export const mqttConnectionGuestUser = (subscribeID, dispatch) => {
  try {
    if (!subscribeID) {
      return;
    }

    const min = 10000;
    const max = 90000;
    const id = min + Math.random() * (max - min);
    const clientId = `${subscribeID}-${id}`;

    if (process.env.REACT_APP_ENV === "dev") {
      newClient = new Paho.Client("192.168.18.243", 8228, clientId);
    } else {
      const brokerUrl = `wss://${process.env.REACT_APP_MQTT}:${process.env.REACT_APP_MQTT_PORT}/mqtt`;
      newClient = new Paho.Client(brokerUrl, clientId);
    }

    newClient.onConnectionLost = (responseObject) => {
      setTimeout(() => mqttConnectionGuestUser(subscribeID, dispatch), 3000); // Reconnect after 3 seconds
    };

    const options = {
      onSuccess: () => {
        try {
          newClient.subscribe(subscribeID.toString(), {
            onSuccess: () => {},
            onFailure: (error) => {
              console.log(error);
            },
          });
        } catch (subError) {}
      },
      onFailure: (error) => {
        setTimeout(() => mqttConnectionGuestUser(subscribeID, dispatch), 6000); // Retry connection after 6 seconds
      },
      keepAliveInterval: 30,
      reconnect: true,
      userName: decrypt(
        process.env.REACT_APP_MQTT_User,
        process.env.REACT_APP_SECERETKEY,
      ),
      password: decrypt(
        process.env.REACT_APP_MQTT_Pass,
        process.env.REACT_APP_SECERETKEY,
      ),
    };

    newClient.connect(options);
    dispatch(setClientGuest(newClient));
  } catch (error) {
    setTimeout(() => mqttConnectionGuestUser(subscribeID, dispatch), 6000); // Retry connection after 6 seconds
  }
};

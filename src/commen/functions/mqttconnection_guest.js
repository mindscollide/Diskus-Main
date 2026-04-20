/**
 * @file mqttconnection_guest.js
 * @description Establishes a Paho MQTT connection for **unauthenticated guest**
 * participants (e.g. external attendees joining a video meeting via a link).
 * Mirrors the authenticated-user flow in `mqttconnection.js` but dispatches to
 * `setClientGuest` and uses a shorter 3-second reconnect interval.
 */
import Paho from "paho-mqtt";
import { setClientGuest } from "../../store/actions/Guest_Video";
import { decrypt } from "./utils";

/** Module-level Paho client — replaced on every (re)connection attempt. */
let newClient;

/**
 * Creates a Paho MQTT client for an unauthenticated guest, connects to the
 * broker, and subscribes to `subscribeID`.  On connection loss or failure the
 * function automatically retries:
 *  - Connection loss → retry after **3 seconds**
 *  - Connection failure → retry after **6 seconds**
 *
 * Broker selection:
 *  - `dev`  environment → plain WebSocket at `192.168.18.241:8228`
 *  - other environments → secure WSS at `REACT_APP_MQTT:REACT_APP_MQTT_PORT/mqtt`
 *
 * @param {string|number} subscribeID - MQTT topic to subscribe to.
 * @param {Function} dispatch - Redux dispatch used to store the client via
 *   `setClientGuest`.
 */
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
      newClient = new Paho.Client("192.168.18.241", 8228, clientId);
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
    dispatch(setClientGuest(newClient));
  } catch (error) {
    console.error("Error in Guest MQTT connection:", error.message);
    setTimeout(() => mqttConnectionGuestUser(subscribeID, dispatch), 6000); // Retry connection after 6 seconds
  }
};

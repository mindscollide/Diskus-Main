// CR(0012249): the room an active presentation runs in, remembered per meeting.
// MEETING_PRESENTATION_STARTED saves it app-wide; the JoinMeeting response also
// carries the presentation roomID, which covers a user who was offline/logged out.
const ROOMS_KEY = "presentationRooms";

export const isValidRoomID = (id) =>
  Boolean(id) && !["null", "undefined", "0"].includes(String(id));

const readRooms = () => {
  try {
    return JSON.parse(localStorage.getItem(ROOMS_KEY)) || {};
  } catch {
    return {};
  }
};

export const savePresentationRoom = (meetingID, roomID) => {
  if (meetingID === undefined || meetingID === null || !isValidRoomID(roomID)) {
    return;
  }
  const rooms = readRooms();
  rooms[String(meetingID)] = String(roomID);
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
};

export const clearPresentationRoom = (meetingID) => {
  if (meetingID === undefined || meetingID === null) return;
  const rooms = readRooms();
  delete rooms[String(meetingID)];
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
};

// Sets localStorage.presentationRoomID for the waiting-room modal. Candidates
// (the fresh server room) win over the room saved earlier for this meeting, which
// can be stale after an offline gap. With no valid room the key is removed so a
// stale room from an earlier presentation can never be sent.
export const rememberPresentationRoomID = (meetingID, ...candidates) => {
  const room = [...candidates, readRooms()[String(meetingID)]].find(
    isValidRoomID,
  );
  if (room) {
    localStorage.setItem("presentationRoomID", String(room));
  } else {
    localStorage.removeItem("presentationRoomID");
  }
  return room;
};

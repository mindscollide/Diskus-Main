export const generateURLCaller = (callerFullName, roomID) => {
  const baseURL = "https://portal.letsdiskus.com:9414/index.html";
  const queryParams = new URLSearchParams({
    UserName: callerFullName,
    Type: "Call",
    RoomID: roomID,
  });
  return `${baseURL}?${queryParams.toString()}`;
};

export const generateURLParticipant = (participantFullName, roomID) => {
  const baseURL = "https://portal.letsdiskus.com:9414/index.html";
  const queryParams = new URLSearchParams({
    UserName: participantFullName,
    Type: "Join",
    RoomID: roomID,
  });
  return `${baseURL}?${queryParams.toString()}`;
};

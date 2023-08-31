// this is for get index of the url
export const endIndexUrl = (dynamicUrl) => {
  const endIndex = dynamicUrl.indexOf(".html") + ".html".length;
  return endIndex;
};

// this is for to get extracted url
export const extractedUrl = (dynamicUrl, endIndex) => {
  const urlExtracted = dynamicUrl.substring(0, endIndex);
  return urlExtracted;
};

// this is for caller url generator
export const generateURLCaller = (baseURL,callerFullName, roomID) => {
  const queryParams = new URLSearchParams({
    UserName: callerFullName,
    Type: "Call",
    RoomID: roomID,
  });
  return `${baseURL}?${queryParams.toString()}`;
};

// this is for Participant url generator
export const generateURLParticipant = (baseURL,participantFullName, roomID) => {
  const queryParams = new URLSearchParams({
    UserName: participantFullName,
    Type: "Join",
    RoomID: roomID,
  });
  return `${baseURL}?${queryParams.toString()}`;
};

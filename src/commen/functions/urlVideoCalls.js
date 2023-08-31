export const generateURLCaller = (callerFullName, roomID) => {
  const baseURL = 'http://diskus.axis-work.com:9514/index.html'
  const queryParams = new URLSearchParams({
    UserName: callerFullName,
    Type: 'Call',
    RoomID: roomID,
  })
  return `${baseURL}?${queryParams.toString()}`
}

export const generateURLParticipant = (participantFullName, roomID) => {
  const baseURL = 'http://diskus.axis-work.com:9514/index.html'
  const queryParams = new URLSearchParams({
    UserName: participantFullName,
    Type: 'Join',
    RoomID: roomID,
  })
  return `${baseURL}?${queryParams.toString()}`
}

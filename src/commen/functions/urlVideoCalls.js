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

// Adds a unique query param to the video iframe URL so the browser always
// fetches the Zoom app's index.html fresh instead of reusing a cached copy that
// still points at an old build. Only index.html is affected: its JS is
// content-hashed and its SDK files live under a versioned /lib/<sdk>/ path, so
// those stay cached. Apply this only to the iframe `src`, never to the stored
// URL, because the panel compares stored URLs to decide when to reload.
export const withFreshIframeLoad = (url) => {
  if (!url) return url;
  const [path, hash = ""] = url.split("#");
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}_v=${Date.now()}${hash ? `#${hash}` : ""}`;
};

// this is for caller url generator
export const generateURLCaller = (
  baseURL,
  callerFullName,
  roomID,
  UserGuid
) => {
  let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
  let queryParams;
  
  
  if (isZoomEnabled) {
    queryParams = `userName=${callerFullName}&sessionKey=${roomID}&userGuid=${UserGuid}&isHideCamera=false&isMute=false`;
    
  } else {
    queryParams = new URLSearchParams({
      UserName: callerFullName,
      Type: "Call",
      RoomID: roomID,
    });
  }

  return `${baseURL}?${queryParams.toString()}`;
};

// this is for Participant url generator
export const generateURLParticipant = (
  baseURL,
  participantFullName,
  roomID,
  UserGuid
) => {
  let queryParams;
  let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
  
  
  
  if (isZoomEnabled) {
    let presenterViewvideoURL = localStorage.getItem("presenterViewvideoURL");
    
    if (presenterViewvideoURL) {
      return presenterViewvideoURL;
    } else {
      queryParams = `userName=${participantFullName}&sessionKey=${roomID}&userGuid=${UserGuid}&isHideCamera=false&isMute=false`;
      
    }
    

    
  } else {
    
    queryParams = new URLSearchParams({
      UserName: participantFullName,
      Type: "Join",
      RoomID: roomID,
    });
  }

  
  return `${baseURL}?${queryParams.toString()}`;
};

export const generateRandomGuest = () => {
  // Generate a random 4-digit number
  const randomNum = Math.floor(Math.random() * 9000) + 1000;

  // Create the final string by appending the random number
  const guestString = `Guest${randomNum}`;

  // Return the result
  return guestString;
};

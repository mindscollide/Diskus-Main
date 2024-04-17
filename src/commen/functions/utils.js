// export const updateLocalUserRoutes=(userFeatures,LocalUserRoutes)=> {
//     userFeatures.forEach(feature => {
//         // Check if the packageFeatureID exists in the routes array
//         const matchingRoute = routes.find(route => route.id === feature.packageFeatureID);
//         if (matchingRoute) {
//             // If a matching route is found, push it to LocalUserRoutes if it's not already included
//             if (!LocalUserRoutes.some(route => route.id === matchingRoute.id)) {
//                return LocalUserRoutes.push(matchingRoute);
//             }
//         }
//     });
// }

// this is function save avalable feature for current user implementation its save all data in local storage
export function savePackageFeatureIDs(userFeatures) {
  // Fetch existing data from local storage
  const storedData = localStorage.getItem('packageFeatureIDs');
  const existingIDs = storedData ? JSON.parse(storedData) : [];

  // Create a new array to store packageFeatureIDs from userFeatures
  const newIDs = userFeatures.map(feature => feature.packageFeatureID);

  // Combine existing IDs with new IDs (avoid duplicates using a Set)
  const combinedIDs = Array.from(new Set([...existingIDs, ...newIDs]));

  // Store the combined array back in local storage
  localStorage.setItem('packageFeatureIDs', JSON.stringify(combinedIDs));
}


// this is function match data if id is exsit in deatures
export function checkFeatureID(id) {
  // Retrieve the packageFeatureIDs string from local storage and parse it into an array
  const storedIDs = localStorage.getItem("packageFeatureIDs");
  const packageFeatureIDs = storedIDs ? JSON.parse(storedIDs) : [];

  // Check if the provided ID is in the array of packageFeatureIDs
  return packageFeatureIDs.includes(id);
}

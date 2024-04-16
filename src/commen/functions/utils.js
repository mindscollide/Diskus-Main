export const updateLocalUserRoutes=(userFeatures,LocalUserRoutes)=> {
    userFeatures.forEach(feature => {
        // Check if the packageFeatureID exists in the routes array
        const matchingRoute = routes.find(route => route.id === feature.packageFeatureID);
        if (matchingRoute) {
            // If a matching route is found, push it to LocalUserRoutes if it's not already included
            if (!LocalUserRoutes.some(route => route.id === matchingRoute.id)) {
               return LocalUserRoutes.push(matchingRoute);
            }
        }
    });
}
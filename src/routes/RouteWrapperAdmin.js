const RouteWrapperAdmin = ({ name, children }) => {
  const storedRoutes = JSON.parse(
    localStorage.getItem("LocalAdminRoutes") || "[]"
  );
  const isAllowed = storedRoutes.some((route) => route.name === name);
  if (!isAllowed) {
    // This could be as simple as null, a plain message, or a dedicated component.
    return null; // or <div>Access Denied</div> or <YourCustomAccessDeniedComponent />
  }

  // If allowed, render the children as normal.
  return children;
};
export default RouteWrapperAdmin;

/**
 * @file RouteWrapperAdmin.js
 * @description Permission wrapper for admin routes.
 *
 * Mirrors `RouteWrapperUser` but reads from the `LocalAdminRoutes` key in
 * localStorage, which is populated with the admin's permitted pages after login.
 * Routes not present in that list render `null`.
 *
 * Wraps every child `<Route>` inside the `/Admin/*` branch in `routes.js`.
 */

/**
 * Renders `children` only when `name` is found in the stored admin route list.
 *
 * @param {{ name: string, children: React.ReactNode }} props
 * @param {string}           props.name     - Route identifier to look up.
 * @param {React.ReactNode}  props.children - Page content to conditionally render.
 * @returns {React.ReactNode|null} Children or `null` when access is denied.
 */
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

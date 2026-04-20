/**
 * @file RouteWrapperUser.js
 * @description Permission wrapper for authenticated user routes.
 *
 * Reads the `LocalUserRoutes` array from localStorage (populated after login)
 * and checks whether a route with the given `name` is present.  If the route
 * is not in the permitted list the component renders `null` (effectively a
 * blank screen / access-denied), preventing the child page from mounting.
 *
 * This is used as an inner wrapper inside every `<Route element>` inside the
 * `/Diskus/*` branch of `routes.js`, providing fine-grained feature-flag style
 * access control per-page.
 */

/**
 * Renders `children` only when `name` is found in the stored user route list.
 *
 * @param {{ name: string, children: React.ReactNode }} props
 * @param {string}           props.name     - Route identifier to look up.
 * @param {React.ReactNode}  props.children - Page content to conditionally render.
 * @returns {React.ReactNode|null} Children or `null` when access is denied.
 */
const RouteWrapperUser = ({ name, children }) => {
  const storedRoutes = JSON.parse(
    localStorage.getItem("LocalUserRoutes") || "[]"
  );
  console.log("LocalUserRoutesLocalUserRoutes", storedRoutes);
  const isAllowed = storedRoutes.some((route) => route.name === name);
  if (!isAllowed) {
    // This could be as simple as null, a plain message, or a dedicated component.
    return null; // or <div>Access Denied</div> or <YourCustomAccessDeniedComponent />
  }

  // If allowed, render the children as normal.
  return children;
};
export default RouteWrapperUser;

import { useContext } from "react";
import { Navigate, Route, RouteProps, useLocation } from "react-router";
import { UserContext } from "../user/UserContext";

const ProtectedRoute = ({ path, element }: RouteProps) => {
  const { state } = useContext(UserContext);

  const location = useLocation();

  const toUrl = `/login?to=${encodeURI(location.pathname)}`;

  return (
    <Route
      path={path}
      element={state.token ? element : <Navigate to={toUrl}></Navigate>}
    ></Route>
  );
};

export default ProtectedRoute;

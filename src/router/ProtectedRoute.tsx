import { useContext } from "react";
import { Navigate, Route, RouteProps } from "react-router";
import { UserContext } from "../user/UserContext";

const ProtectedRoute = ({ path, element }: RouteProps) => {
  const { state } = useContext(UserContext);

  return (
    <Route
      path={path}
      element={state.token ? element : <Navigate to="/login"></Navigate>}
    ></Route>
  );
};

export default ProtectedRoute;

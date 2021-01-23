import { useContext } from "react";
import { Navigate, Route, RouteProps } from "react-router";
import { UserContext } from "../user/UserContext";

const AnonymousRoute = ({ path, element }: RouteProps) => {
  const { state } = useContext(UserContext);

  return (
    <Route
      path={path}
      element={!state.token ? element : <Navigate to="/notes"></Navigate>}
    ></Route>
  );
};

export default AnonymousRoute;

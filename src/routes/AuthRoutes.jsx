import { Navigate, useLocation } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useSelector } from "react-redux";

const AuthRoutes = ({ children }) => {
  const location = useLocation();
  const isUserAuthenticated = useSelector(
    (state) => state.login.isAuthenticated
  );
  const token = localStorage.getItem("pixtunToken");

  if (!isUserAuthenticated || !token) {
    console.log(token, "token");
    return (
      <Navigate
        to="/login"
        replace={true}
        state={{ currentPath: location.pathname }}
      />
    );
  }

  return <Layout>{children}</Layout>;
};
export default AuthRoutes;

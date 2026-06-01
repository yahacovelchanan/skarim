import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHooks";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({
  children,
}: Props) => {
  const { isAuthenticated } =
    useAppSelector(
      (state) => state.auth
    );

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
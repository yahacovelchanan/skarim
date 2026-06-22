import { useEffect } from "react";
import api from "../api/axios";
import { setCredentials } from "../store/slices/authSlice";
import { useAppDispatch } from "./reduxHooks";

const useAuthInit = () => {
  const dispatch =
    useAppDispatch();

  useEffect(() => {
    const initAuth =
      async () => {
        try {
          const response =
            await api.get(
              "/auth/refresh"
            );

          dispatch(
            setCredentials({
              user:
                response.data.user,
            })
          );
        } catch {
          console.log(
            "No active session"
          );
        }
      };

    initAuth();
  }, [dispatch]);
};

export default useAuthInit;
import { useEffect } from "react";

import api from "../api/axios";

import { setCredentials } from "../store/slices/authSlice";

import {
  useAppDispatch,
} from "./reduxHooks";

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
            localStorage.setItem(
             "accessToken",
              response.data.accessToken
            );

          dispatch(
            setCredentials({
              user:
                response.data
                  .user,
              accessToken:
                response.data
                  .accessToken,
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
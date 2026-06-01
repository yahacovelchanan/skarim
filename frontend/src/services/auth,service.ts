import api from "../api/axios";

export const loginUser = async (
  username: string,
  password: string
) => {
  const response = await api.post(
    "/auth/login",
    {
      username,
      password,
    }
  );

  return response.data;
};
export const registerUser = async (
  username: string,
  password: string
) => {
  const response = await api.post(
    "/auth/register",
    {
      username,
      password,
    }
  );

  return response.data;
};
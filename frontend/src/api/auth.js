import api from './axios';

export const register = async (data) => {
  const res = await api.post('/auth/register', {
    username: data.username,
    password: data.password,
    user_type: data.user_type || "office_worker",
  });
  return res.data;
};

export const login = async (data) => {
  const formData = new URLSearchParams();
  formData.append("grant_type", "password");
  formData.append("username", data.username);
  formData.append("password", data.password);

  const res = await api.post('/auth/token', formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return res.data;
};

export const getUser = async (token) => {
  const res = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
  return res.data;
};

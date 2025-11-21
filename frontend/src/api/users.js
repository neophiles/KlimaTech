import api from './axios';

export const userGet = async (token) => {
  const res = await api.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
  return res.data;
}
  

export const userUpdate = async (data, token) => {
  const res = await api.patch("/users/me", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};


export const userMe = async (token) => {
  const res = await api.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}
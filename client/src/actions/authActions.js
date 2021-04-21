import axios from "axios";

import { SET_CURRENT_USER } from "./types";

export const setCurrentUser = () => dispatch => {
  return axios
    .get("/api/current_user")
    .then(res => {
      dispatch({
        type: SET_CURRENT_USER,
        payload: res.data
      });
    })
    .catch(err => {
      console.log(err.response);
    });
};

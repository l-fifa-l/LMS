import { useContext, useEffect } from "react";
import { Context, context } from "../../context";
import { SyncOutlined } from "ant-design/icons";
import axios from "axios";

import React from "react";

export const StripeCallback = async (req, res) => {
  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  useEffect(() => {
    if (user) {
      axios.post("/api/get-account-status").then((res) => {
        dispatch({
          type: "LOGIN",
          dispatch: res.data,
        });
        window.localStorage.setItem("user", JSON.stringify(res.data));
        window.location.href = "/instructor";
      });
    }
  }, []);

  return (
    <SyncOutlined
      spin
      className="d-flex justify-content-center display-1 text-danger p-5"
    />
  );
};

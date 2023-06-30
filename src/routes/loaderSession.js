import { redirect } from "react-router-dom";
import http from "../config/axios";

const getUser = async () => {
  return http
    .get("/api/user")
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return false;
    });
};

const loader = async () => {
  const user = await getUser();
  if (!user) {
    return redirect("/");
  }
  return null;
};

export default loader;

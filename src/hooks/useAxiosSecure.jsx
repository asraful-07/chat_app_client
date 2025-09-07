import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});
const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;

// https://talk-app-45w3.onrender.com
// https://chat-app-ngl4.onrender.com
// https://talk-app-server.onrender.com
// https://kotha-boli.onrender.com

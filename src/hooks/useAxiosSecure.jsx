import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "https://kotha-boli.onrender.com/api",
  withCredentials: true,
});
const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;

// https://chat-app-ngl4.onrender.com
// https://talk-app-server.onrender.com
// https://kotha-boli.onrender.com

import axios from "axios"; 
// import Swal from "sweetalert2";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASEURL
});
export default instance;

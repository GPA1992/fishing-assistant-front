import axios from "axios";

export const nominatimClient = axios.create({
  baseURL: "https://nominatim.openstreetmap.org",
  headers: {
    "Accept-Language": "pt-BR",
  },
});

export default nominatimClient;

import axios from "axios";
import { api_route, socket } from "../App";
import { toSchemaCompanyData } from "./offerFeatureSelection";

export async function saveCompanySelection(userData, companyData) {
  sessionStorage.setItem("companyData", JSON.stringify(companyData));
  if (userData?._id) {
    sessionStorage.setItem("id", userData._id);
    try {
      await axios.post(`${api_route}/apply/${userData._id}`, {
        companyData: toSchemaCompanyData(companyData),
      });
      socket.emit("newData", userData._id);
    } catch (err) {
      console.error(err);
    }
  }
}

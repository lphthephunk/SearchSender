import { useContext } from "react";
import { RouterContext } from "../utils/WrappedBrowserRouter";

export default function useHistory() {
  return useContext(RouterContext);
}

import { toast } from "react-toastify";
import CustomToast from "../Components/CustomToast";

const baseConfig = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: true,
  closeButton: false,
  pauseOnHover: true
};

export const showToast = {
  success: (message, title = "Success") =>
    toast(
      <CustomToast severity="success" title={title} message={message} />,
      baseConfig
    ),

  error: (message, title = "Error") =>
    toast(
      <CustomToast severity="error" title={title} message={message} />,
      baseConfig
    ),

  warning: (message, title = "Warning") =>
    toast(
      <CustomToast severity="warning" title={title} message={message} />,
      baseConfig
    ),

  info: (message, title = "Info") =>
    toast(
      <CustomToast severity="info" title={title} message={message} />,
      baseConfig
    )
};

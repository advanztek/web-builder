import { Alert, AlertTitle, Stack } from "@mui/material";

const CustomToast = ({
    title,
    message,
    severity = "info"
}) => {
    return (
        <Alert
            severity={severity}
            variant="filled"
            sx={{
                minWidth: 320,
                borderRadius: 2,
                fontWeight: 500,
                alignItems: "center"
            }}
        >
            {title && <AlertTitle>{title}</AlertTitle>}
            {message}
        </Alert>
    );
};

export default CustomToast;

import React from "react";

import { Paper, Typography, Button } from "@material-ui/core";

export default function ConfirmationPopup({
  message,
  handleSubmit,
  handleCancel,
  submitBtnText,
  cancelBtnText
}) {
  return (
    <div>
      <div
        style={{
          background: "gray",
          opacity: ".7",
          zIndex: 500,
          position: "absolute",
          top: "0",
          bottom: "0",
          right: "0",
          left: "0",
          transition: "all 0.2s"
        }}
      />
      <Paper
        style={{
          position: "absolute",
          zIndex: "1000",
          width: "fit-content",
          padding: "10px",
          marginLeft: "auto",
          marginRight: "auto",
          left: "0",
          right: "0",
          top: "25%",
          transition: "all 0.2s"
        }}
      >
        <Typography component="h5" variant="h6">
          {message}
        </Typography>
        <div style={{ display: "flex" }}>
          <Button color="primary" onClick={handleSubmit}>
            {submitBtnText ? submitBtnText : "Submit"}
          </Button>
          <Button color="secondary" onClick={handleCancel}>
            {cancelBtnText ? cancelBtnText : "Cancel"}
          </Button>
        </div>
      </Paper>
    </div>
  );
}

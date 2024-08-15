import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Grid,
} from "@mui/material";
import { toast } from "react-toastify";
import "./styles.css";

const TemplateCrud = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [template, setTemplate] = useState({
    id: Date.now(),
    templateName: "",
    ownerName: "",
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const templateId = searchParams.get("templateId");
    if (templateId) {
      const templates = JSON.parse(localStorage.getItem("templates")) || [];
      const foundTemplate = templates.find((t) => t.id === Number(templateId));
      if (foundTemplate) {
        setTemplate(foundTemplate);
        setIsEdit(true);
      }
    }
  }, [location]);

  const handleChange = (e) => {
    setTemplate({ ...template, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const templates = JSON.parse(localStorage.getItem("templates")) || [];
    if (isEdit) {
      const updatedTemplates = templates.map((t) =>
        t.id === template.id ? template : t
      );
      localStorage.setItem("templates", JSON.stringify(updatedTemplates));
      toast.success("Template updated");
    } else {
      templates.push(template);
      localStorage.setItem("templates", JSON.stringify(templates));
      toast.success("New template created");
    }
    navigate("/");
  };

  return (
    <div className="crud-form-container">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Container component={Paper} className="custom-container">
            <Typography variant="h5">
              {isEdit ? "Edit Template" : "Add New Template"}
            </Typography>
            <form>
              <TextField
                label="Template Name"
                name="templateName"
                value={template.templateName}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Owner Name"
                name="ownerName"
                value={template.ownerName}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ marginTop: "20px" }}
              >
                {isEdit ? "Update" : "Create"}
              </Button>
            </form>
          </Container>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Grid>
      </Grid>
    </div>
  );
};

export default TemplateCrud;

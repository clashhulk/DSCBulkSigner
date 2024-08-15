import React, { useState, useEffect } from "react";
import "./styles.css";
import Header from "../../components/header/Header";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  OutlinedInput,
  FormHelperText,
  Button,
  IconButton,
  Fab,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const [sourceFolder, setSourceFolder] = useState("");
  const [destinationFolder, setDestinationFolder] = useState("");
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const defaultTemplates = [
      { id: 1, templateName: "Yes Bank", ownerName: "Rohan Sharma" },
      {
        id: 2,
        templateName: "Piramal Enterprises",
        ownerName: "Sneha Chowdhury",
      },
    ];

    const loadedTemplates = JSON.parse(localStorage.getItem("templates"));

    if (!loadedTemplates || loadedTemplates.length === 0) {
      localStorage.setItem("templates", JSON.stringify(defaultTemplates));
      setTemplates(defaultTemplates);
    } else {
      setTemplates(loadedTemplates);
    }
  }, []);

  const handleEditAlert = (templateName) => {
    alert(`Editing ${templateName}`);
  };
  const navigate = useNavigate();

  const handleAddNewTemplate = () => {
    navigate("/template/crud");
  };
  const handleFolderChange = (event, setFolder) => {
    if (event.target.files.length > 0) {
      const path = event.target.files[0].webkitRelativePath;
      const folder = path.substr(0, path.lastIndexOf("/"));
      setFolder(folder);
    }
  };

  useEffect(() => {
    const loadedTemplates = JSON.parse(localStorage.getItem("templates")) || [];
    setTemplates(loadedTemplates);
  }, []);

  const handleDelete = (id) => {
    const updatedTemplates = templates.filter((template) => template.id !== id);
    setTemplates(updatedTemplates);
    localStorage.setItem("templates", JSON.stringify(updatedTemplates));
    toast.success("Template deleted successfully!");
  };

  return (
    <>
      <div className="home-container">
        <div className="template-grid">
          <TableContainer component={Paper}>
            <div className="template-list-head">
              <p className="template-table-title">Recent templates</p>
              <Tooltip title="Add New Template">
                <Fab
                  size="small"
                  color="primary"
                  onClick={handleAddNewTemplate}
                  className="small-fab"
                >
                  <AddIcon style={{ fontSize: "20px" }} />
                </Fab>
              </Tooltip>
            </div>
            <Table aria-label="template table">
              <TableHead>
                <TableRow>
                  <TableCell className="compact-table-cell">
                    Template Name
                  </TableCell>
                  <TableCell className="compact-table-cell">
                    Owner Name
                  </TableCell>
                  <TableCell className="compact-table-cell" align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="compact-table-cell">
                      {template.templateName}
                    </TableCell>
                    <TableCell className="compact-table-cell">
                      {template.ownerName}
                    </TableCell>
                    <TableCell className="compact-table-cell" align="right">
                      <IconButton
                        onClick={() =>
                          navigate(`/template/crud?templateId=${template.id}`)
                        }
                        color="primary"
                        className="small-icon-button"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(template.id)}
                        color="secondary"
                        className="small-icon-button"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div className="operations-grid">
          <form className="operations-form">
            <FormControl
              fullWidth
              variant="outlined"
              size="small"
              style={{ marginBottom: "20px" }}
            >
              {/* <InputLabel htmlFor="source-folder">Source Folder</InputLabel> */}
              <OutlinedInput
                id="source-folder"
                type="file"
                inputProps={{ directory: "true", webkitdirectory: "true" }}
                onChange={(e) => handleFolderChange(e, setSourceFolder)}
                label="Source Folder"
              />
              <FormHelperText>Select a source directory</FormHelperText>
            </FormControl>

            <FormControl fullWidth variant="outlined" size="small">
              {/* <InputLabel htmlFor="destination-folder">
                Destination Folder
              </InputLabel> */}
              <OutlinedInput
                id="destination-folder"
                type="file"
                inputProps={{ directory: "true", webkitdirectory: "true" }}
                onChange={(e) => handleFolderChange(e, setDestinationFolder)}
                label="Destination Folder"
              />
              <FormHelperText>Select a destination directory</FormHelperText>
            </FormControl>
          </form>
          <Button
            variant="contained"
            color="primary"
            style={{ alignSelf: "flex-end" }}
          >
            Move
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;

import './styles.css';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Fab,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const TemplateList = () => {
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
    <div>
      {" "}
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
              <TableCell className="compact-table-cell">Owner Name</TableCell>
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
  );
};

export default TemplateList;

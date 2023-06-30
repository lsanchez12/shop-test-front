import React, { useEffect, useState } from "react";
import http from "../../config/axios";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@mui/material/Modal";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  p: 4,
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Users() {
  const [idUser, setIdUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [mode, setMode] = useState("");

  const [users, setUsers] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [checked, setChecked] = useState(true);

  const handleClickOpenDelete = (id) => {
    setIdUser(id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleOpenCreate = () => {
    setMode("create");
    setChecked(true);
    setOpenCreate(true);
  };
  const handleCloseModal = () => setOpenCreate(false);

  const resetInput = () => {
    setIdUser(null);
    setName("");
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");
  };

  const handleOpenEdit = (item) => {
    setIdUser(item.id);
    setName(item.name);
    setEmail(item.email);
    setChecked(false);
    setMode("edit");
    setOpenCreate(true);
  };

  const handleChangeName = (event) => {
    setName(event.target.value);
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleChangePasswordConfirmation = (event) => {
    setPasswordConfirmation(event.target.value);
  };

  const getUser = () => {
    http
      .get("/api/users")
      .then((response) => {
        setUsers(response.data.users.data);
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    getUser();
  }, []);

  const create = async (event) => {
    event.preventDefault();
    if (password != passwordConfirmation) {
      alert("The password not match");
    } else {
      http
        .post("/api/users", {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        })
        .then((response) => {
          getUser();
          handleCloseModal();
          resetInput();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const update = async (event) => {
    event.preventDefault();
    if (password != passwordConfirmation) {
      alert("The password not match");
    } else {
      http
        .put(`/api/users/${idUser}`, {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
          change_password: checked,
        })
        .then((response) => {
          getUser();
          handleCloseModal();
          resetInput();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const deleteUser = async () => {
    http
      .delete(`/api/users/${idUser}`)
      .then((response) => {
        getUser();
        handleCloseDelete();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      {!users.length && <Skeleton variant="rectangular" height={60} />}
      <List>
        {users.map((item) => (
          <>
            <ListItem
              secondaryAction={
                <>
                  <Tooltip title="Update">
                    <IconButton
                      edge="end"
                      aria-label="update"
                      onClick={() => handleOpenEdit(item)}
                    >
                      <ModeEditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleClickOpenDelete(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </>
              }
            >
              <ListItemAvatar>
                <Avatar>{item.name[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={item.name} secondary={item.email} />
            </ListItem>
            <Divider />
          </>
        ))}
      </List>

      <Modal
        open={openCreate}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          component="form"
          onSubmit={(event) => {
            mode == "create" ? create(event) : update(event);
          }}
          noValidate
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {`${mode == "create" ? "Create" : "Edit"} User`}
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoFocus
            onChange={handleChangeName}
            value={name}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handleChangeEmail}
            value={email}
            disabled={mode == "create" ? false : true}
          />
          {mode == "edit" && (
            <FormControlLabel
              value="end"
              control={
                <Checkbox
                  checked={checked}
                  onChange={handleChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Change password?"
              labelPlacement="end"
            />
          )}

          {checked && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                id="password"
                type="password"
                onChange={handleChangePassword}
                value={password}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password_confirmation"
                label="Password confirmation"
                id="password"
                type="password"
                onChange={handleChangePasswordConfirmation}
                value={passwordConfirmation}
              />
            </>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {mode == "create" ? "Create" : "Update"}
          </Button>
        </Box>
      </Modal>

      <Dialog
        open={openDelete}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDelete}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Do you want to delete the selected item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button onClick={deleteUser}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
        }}
        onClick={handleOpenCreate}
      >
        <AddIcon />
      </Fab>
    </>
  );
}

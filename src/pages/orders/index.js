import React, { useEffect, useState } from "react";
import http from "../../config/axios";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import VisibilityIcon from "@mui/icons-material/Visibility";

import Grid from "@mui/material/Grid";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  p: 4,
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Users() {
  const [uuidOrder, setUuidOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleClickOpenDelete = (id) => {
    setUuidOrder(id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleOpenView = (item) => {
    setOpenView(true);
    setOrder(item);
    console.info(item);
  };
  const handleCloseModal = () => setOpenView(false);

  const getTotal = (items) => {
    let total = 0;
    items.forEach((item) => {
      total += item.quantity * item.product.amount;
    });
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(total);
  };

  const getOrder = () => {
    http
      .get("/api/order")
      .then((response) => {
        setOrders(response.data.orders.data);
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    getOrder();
  }, []);

  const deleteOrder = async () => {
    http
      .delete(`/api/order/${uuidOrder}`)
      .then((response) => {
        getOrder();
        handleCloseDelete();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      {!orders.length && <Skeleton variant="rectangular" height={60} />}
      <List>
        {orders.map((item) => (
          <>
            <ListItem
              secondaryAction={
                <>
                  <Tooltip title="Details">
                    <IconButton
                      edge="end"
                      aria-label="update"
                      onClick={() => handleOpenView(item)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleClickOpenDelete(item.uuid)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </>
              }
            >
              <ListItemAvatar>
                <Avatar>{item.id}</Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={`Order #${item.id} - ${item.user.name}`}
                secondary={`Products: ${item.line_items.length} - ${getTotal(
                  item.line_items
                )}`}
              />
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
      {order && (
        <Modal
          open={openView}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} component="form" onSubmit={(event) => {}} noValidate>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {`Order #${order.id}`}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={8}>
                <Typography variant="h5" gutterBottom>
                  {order.user.name}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  {order.user.email}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="h5" gutterBottom>
                  {"Total:"}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {getTotal(order.line_items)}
                </Typography>
              </Grid>

              <Grid item xs={12} md={12}>
                <Divider />
                <List>
                  {order.line_items.map((item) => (
                    <>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar src={item.product.image_url} />
                        </ListItemAvatar>

                        <ListItemText
                          primary={`${item.product.name} `}
                          secondary={`Quantity: ${
                            item.quantity
                          } x ${new Intl.NumberFormat("es-CO", {
                            style: "currency",
                            currency: "COP",
                          }).format(
                            item.product.amount
                          )} = ${new Intl.NumberFormat("es-CO", {
                            style: "currency",
                            currency: "COP",
                          }).format(item.product.amount * item.quantity)}`}
                        />
                      </ListItem>
                      <Divider />
                    </>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      )}

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
          <Button onClick={deleteOrder}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

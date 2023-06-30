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
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

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

export default function Products() {
  const [idProduct, setIdProduct] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [mode, setMode] = useState("");
  const [cartShop, setCartShop] = useState(null);

  const [products, setProducts] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAddCart, setOpenCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleClickOpenDelete = (id) => {
    setIdProduct(id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleOpenCreate = () => {
    setMode("create");
    setOpenCreate(true);
  };
  const handleCloseModal = () => setOpenCreate(false);

  const handleOpenConfirmation = async (id) => {
    setIdProduct(id);
    await getCart();
    setOpenCart(true);
  };
  const handleCloseConfirmation = () => {
    setOpenCart(false);
    setQuantity(1);
  };

  const resetInput = () => {
    setIdProduct(null);
    setName("");
    setDescription("");
    setAmount("");
    setImageUrl("");
  };

  const handleOpenEdit = (item) => {
    setMode("edit");
    setIdProduct(item.id);
    setName(item.name);
    setDescription(item.description);
    setAmount(item.amount);
    setImageUrl(item.image_url);
    setOpenCreate(true);
  };

  const handleChangeName = (event) => {
    setName(event.target.value);
  };

  const handleChangeDescription = (event) => {
    setDescription(event.target.value);
  };

  const handleAmount = (event) => {
    setAmount(event.target.value);
  };
  const handleQuantity = (event) => {
    setQuantity(event.target.value);
  };

  const handleImageUrl = (event) => {
    setImageUrl(event.target.value);
  };

  const getProducts = () => {
    http
      .get("/api/product")
      .then((response) => {
        setProducts(response.data.products.data);
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    getProducts();
  }, []);

  const getCart = async () => {
    const cart = localStorage.getItem("cart");
    if (cart) {
      setCartShop(cart);
    } else {
      http
        .post("/api/order")
        .then((response) => {
          localStorage.setItem("cart", response.data.order.uuid);
          setCartShop(response.data.order.uuid);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const create = async (event) => {
    event.preventDefault();

    http
      .post("/api/product", {
        name,
        description,
        amount,
        image_url: imageUrl,
      })
      .then((response) => {
        getProducts();
        handleCloseModal();
        resetInput();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const update = async (event) => {
    event.preventDefault();

    http
      .put(`/api/product/${idProduct}`, {
        name,
        description,
        amount,
        image_url: imageUrl,
      })
      .then((response) => {
        getProducts();
        handleCloseModal();
        resetInput();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteProduct = async () => {
    http
      .delete(`/api/product/${idProduct}`)
      .then((response) => {
        getProducts();
        handleCloseDelete();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const addToTheCart = async () => {
    http
      .post("/api/line-item", {
        uuid: cartShop,
        quantity,
        product_id: idProduct,
      })
      .then((response) => {
        handleCloseConfirmation();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      {!products.length && <Skeleton variant="rectangular" height={60} />}
      <List>
        {products.map((item) => (
          <>
            <ListItem
              secondaryAction={
                <>
                  <Tooltip title="Add to cart">
                    <IconButton
                      edge="end"
                      aria-label="add_cart"
                      onClick={() => handleOpenConfirmation(item.id)}
                    >
                      <AddShoppingCartIcon />
                    </IconButton>
                  </Tooltip>
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
                <Avatar src={item.image_url} />
              </ListItemAvatar>
              <ListItemText
                primary={`${item.name} - ${new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                }).format(item.amount)}`}
                secondary={item.description}
              />
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
            {`${mode == "create" ? "Create" : "Edit"} Product`}
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
            id="description"
            label="Description"
            name="description"
            autoFocus
            multiline
            rows={4}
            onChange={handleChangeDescription}
            value={description}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="amount"
            label="Amount"
            id="amount"
            onChange={handleAmount}
            value={amount}
            type={"number"}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="image_url"
            label="Image url"
            id="image_url"
            type={"url"}
            onChange={handleImageUrl}
            value={imageUrl}
          />
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
          <Button onClick={deleteProduct}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAddCart}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseConfirmation}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Do you want add the selected item?
          </DialogContentText>
          <TextField
            margin="normal"
            required
            fullWidth
            name="quantity"
            label="Quantity"
            id="quantity"
            onChange={handleQuantity}
            value={quantity}
            type={"number"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation}>Cancel</Button>
          <Button onClick={addToTheCart}>Add</Button>
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

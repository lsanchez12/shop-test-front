import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Outlet, Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
      <Container maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography
          component="h2"
          variant="h3"
          align="center"
          color="text.primary"
        >
          Options
        </Typography>
      </Container>
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardHeader
                title={"Users"}
                titleTypographyProps={{ align: "center" }}
                sx={{
                  backgroundColor: (theme) => theme.palette.grey[200],
                }}
              />
              <CardActions>
                <Link to={`/users/`}>
                  <Button fullWidth>View</Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardHeader
                title={"Products"}
                titleTypographyProps={{ align: "center" }}
                sx={{
                  backgroundColor: (theme) => theme.palette.grey[200],
                }}
              />
              <CardActions>
                <Link to={`/products/`}>
                  <Button fullWidth>View</Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardHeader
                title={"Orders"}
                titleTypographyProps={{ align: "center" }}
                sx={{
                  backgroundColor: (theme) => theme.palette.grey[200],
                }}
              />
              <CardActions>
                <Link to={`/orders/`}>
                  <Button fullWidth>View</Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

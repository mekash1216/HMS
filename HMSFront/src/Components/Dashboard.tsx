import { Box, Typography, Grid, Paper, Card, CardContent } from "@mui/material";
const Dashboard = () => {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Hotel Management System
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Occupied Rooms</Typography>
                <Typography variant="h4">120</Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Total Revenue</Typography>
                <Typography variant="h4">$30,000</Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Bookings Today</Typography>
                <Typography variant="h4">45</Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Guests Checked In</Typography>
                <Typography variant="h4">80</Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

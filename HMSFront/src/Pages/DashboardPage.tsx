import { Box, Typography, Grid, Paper, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Bar } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  // Static Data for the Table
  const tableData = [
    { id: 1, name: 'John Doe', age: 28, city: 'New York' },
    { id: 2, name: 'Jane Smith', age: 34, city: 'Los Angeles' },
    { id: 3, name: 'Sam Wilson', age: 23, city: 'Chicago' },
    { id: 4, name: 'Sara Lee', age: 29, city: 'Miami' },
  ];

  // Static Data for the Bar Graph
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May','June','July','Augest','September','October','November','December'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [12000, 15000, 13000, 17000, 19000,18000,17000,16000,15000,18000,14000,12000],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Monthly Revenue',
      },
    },
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        mt: 0,
        transition: "margin 0.3s ease-in-out",
        overflowX: 'hidden',  // Prevent horizontal overflow
      }}
    >
      <Grid container spacing={3}>
         {/* Card for Occupied Rooms */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ borderRadius: 2 }}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                  Occupied Rooms
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 2 }}>
                  120
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        {/* Card for Total Revenue */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ borderRadius: 2 }}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                  Total Revenue
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 2 }}>
                  $30,000
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        {/* Card for Bookings Today */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ borderRadius: 2 }}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                  Bookings Today
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 2 }}>
                  45
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        {/* Card for Guests Checked In */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ borderRadius: 2 }}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                  Guests Checked In
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 2 }}>
                  80
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>

      {/* Graph */}
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2, maxWidth: '100%' }}>
            <Bar data={data} options={options} />
          </Paper>
        </Grid>
      </Grid>

      {/* Table */}
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              User Data Table
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Age</TableCell>
                    <TableCell>City</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.age}</TableCell>
                      <TableCell>{row.city}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;

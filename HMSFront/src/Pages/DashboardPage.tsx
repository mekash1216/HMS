import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getRooms, getBookings, getInvoices, getGuests } from "../Services/Services";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [totalRooms, setTotalRooms] = useState(0);
  const [occupiedRooms, setOccupiedRooms] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [todayBookings, setTodayBookings] = useState(0);
  const [guestsCount, setGuestsCount] = useState(0);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [rooms, bookings, invoices, guests] = await Promise.all([
          getRooms(),
          getBookings(),
          getInvoices(),
          getGuests(),
        ]);

        setTotalRooms(rooms.length);
        setOccupiedRooms(rooms.filter((r) => r.status === "Booked").length);
        setTotalRevenue(invoices.reduce((sum, i) => sum + (i.amountPaid || 0), 0));
        setGuestsCount(guests.length);

        const today = new Date().toISOString().split("T")[0];
        const todayBookingsCount = bookings.filter(
          (b) => b.checkInDate.split("T")[0] === today
        ).length;
        setTodayBookings(todayBookingsCount);

        setRecentBookings(
          bookings
            .sort(
              (a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime()
            )
            .slice(0, 5)
        );
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Chart data (simulate revenue by month from invoices)
  const monthlyRevenue = Array(12).fill(0);
  const now = new Date();
  const currentYear = now.getFullYear();

  // Aggregate monthly revenue dynamically
  recentBookings.forEach((booking) => {
    const month = new Date(booking.checkInDate).getMonth();
    monthlyRevenue[month] += booking.totalPrice || 0;
  });

  const data = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        label: `Revenue ${currentYear} (Br)`,
        data: monthlyRevenue,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { title: { display: true, text: "Monthly Revenue (Br)" } },
  };

  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>
          Loading Dashboard Data...
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ flexGrow: 1, p: 3, mt: 0 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        🏨 Hotel Management Dashboard
      </Typography>

      <Grid container spacing={3}>
        {[
          { label: "Total Rooms", value: totalRooms },
          { label: "Occupied Rooms", value: occupiedRooms },
          { label: "Total Revenue", value: `${totalRevenue.toLocaleString()} Br` },
          { label: "Bookings Today", value: todayBookings },
          { label: "Registered Guests", value: guestsCount },
        ].map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={3} sx={{ borderRadius: 2 }}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "text.secondary" }}
                  >
                    {card.label}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mt: 2 }}>
                    {card.value}
                  </Typography>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Revenue Chart */}
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2, maxWidth: "100%" }}>
            <Bar data={data} options={options} />
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Bookings */}
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              📅 Recent Bookings
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Guest ID</TableCell>
                    <TableCell>Room ID</TableCell>
                    <TableCell>Check-In</TableCell>
                    <TableCell>Check-Out</TableCell>
                    <TableCell>Total Price (Br)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentBookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>{b.guestId}</TableCell>
                      <TableCell>{b.roomId}</TableCell>
                      <TableCell>
                        {new Date(b.checkInDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(b.checkOutDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{b.totalAmount?.toLocaleString() ?? "0"}</TableCell>
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

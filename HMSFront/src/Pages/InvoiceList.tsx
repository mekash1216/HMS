import { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  Button,
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Divider,
} from "@mui/material";
import { getInvoices, addPayment } from "../Services/Services";
import { InvoiceRow } from "../Models/InvoiceRow";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRow | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [printDialogOpen, setPrintDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const data: InvoiceRow[] = await getInvoices();
      setInvoices(data);
    } catch (error) {
      console.error("❌ Failed to fetch invoices:", error);
      setInvoices([]);
    }
  };

  const handleAddPaymentClick = (invoice: InvoiceRow) => {
    setSelectedInvoice(invoice);
    setPaymentAmount(0);
    setDialogOpen(true);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedInvoice) return;

    try {
      await addPayment(selectedInvoice.id!, { amountPaid: paymentAmount });
      setDialogOpen(false);
      setSelectedInvoice(null);
      fetchInvoices();
    } catch (error) {
      console.error("❌ Failed to add payment:", error);
    }
  };

  const handlePrintInvoice = (invoice: InvoiceRow) => {
    setSelectedInvoice(invoice);
    setPrintDialogOpen(true);
  };

  const handlePrint = () => {
    const printContents = document.getElementById("invoice-print-area")?.innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow?.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 30px; }
            h2, h4 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            td, th { border: 1px solid #ccc; padding: 8px; text-align: left; }
            .footer { text-align: center; margin-top: 40px; font-size: 12px; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    printWindow?.document.close();
    printWindow?.print();
  };

  const columns: GridColDef<InvoiceRow>[] = [
    { field: "bookingId", headerName: "Booking ID", flex: 1 },
    { field: "totalAmount", headerName: "Total Amount (Br)", flex: 1 },
    { field: "amountPaid", headerName: "Amount Paid (Br)", flex: 1 },
    {
      field: "paymentStatus",
      headerName: "Status",
      flex: 1,
      renderCell: (params: GridRenderCellParams<InvoiceRow>) => (
        <Typography
          sx={{
            color:
              params.row.paymentStatus === "Paid"
                ? "green"
                : params.row.paymentStatus === "Partially Paid"
                ? "orange"
                : "red",
            fontWeight: "bold",
          }}
        >
          {params.row.paymentStatus}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      sortable: false,
      renderCell: (params: GridRenderCellParams<InvoiceRow>) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            disabled={params.row.paymentStatus === "Paid"}
            onClick={() => handleAddPaymentClick(params.row)}
          >
            {params.row.paymentStatus === "Paid" ? "Fully Paid" : "Add Payment"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handlePrintInvoice(params.row)}
          >
            Print
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        💳 Invoice & Payment Management
      </Typography>

      <DataGrid
        rows={invoices}
        columns={columns}
        getRowId={(row: InvoiceRow) => row.id!}
        autoHeight
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 20]}
      />

      {/* Payment Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add Payment</DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Booking ID: {selectedInvoice.bookingId}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Total: {selectedInvoice.totalAmount} Br | Paid:{" "}
                {selectedInvoice.amountPaid} Br
              </Typography>
            </>
          )}
          <TextField
            type="number"
            label="Payment Amount (Br)"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(Number(e.target.value))}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handlePaymentSubmit}>
            Submit Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Print Invoice Dialog */}
      <Dialog open={printDialogOpen} onClose={() => setPrintDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Invoice Details</DialogTitle>
        <DialogContent id="invoice-print-area">
          {selectedInvoice && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h4" align="center" gutterBottom>
                🏨 Hotel Invoice
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography><b>Invoice ID:</b> {selectedInvoice.id}</Typography>
              <Typography><b>Booking ID:</b> {selectedInvoice.bookingId}</Typography>
              <Typography><b>Total Amount:</b> {selectedInvoice.totalAmount} Br</Typography>
              <Typography><b>Amount Paid:</b> {selectedInvoice.amountPaid} Br</Typography>
              <Typography><b>Payment Status:</b> {selectedInvoice.paymentStatus}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" align="center" className="footer">
                Thank you for staying with us!<br />
                Printed on {new Date().toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrintDialogOpen(false)}>Close</Button>
          <Button variant="contained" color="success" onClick={handlePrint}>
            Print
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InvoiceList;

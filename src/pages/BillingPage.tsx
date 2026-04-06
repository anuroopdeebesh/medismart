import { Box, Button, Card, CardContent, Chip, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import type { Invoice, Patient, Payment } from '../types';

type Props = {
  patients: Patient[];
  invoices: Invoice[];
  payments: Payment[];
  onCreateInvoice: (payload: Record<string, unknown>) => Promise<void>;
  onCreatePayment: (payload: Record<string, unknown>) => Promise<void>;
};

export function BillingPage({ patients, invoices, payments, onCreateInvoice, onCreatePayment }: Props) {
  const [invoiceForm, setInvoiceForm] = useState({
    invoice_number: `INV-${Date.now()}`,
    patient_id: patients[0]?.id ?? 1,
    subtotal: 100,
    tax: 10,
    total: 110,
    balance_due: 110,
    status: 'Issued',
    insurance_provider: '',
    notes: '',
  });

  const [paymentForm, setPaymentForm] = useState({
    invoice_id: invoices[0]?.id ?? 1,
    amount: 110,
    method: 'Card',
    transaction_reference: '',
    received_by_id: 5,
  });

  const paymentColumns = useMemo<GridColDef[]>(() => [
    { field: 'paid_at', headerName: 'Paid At', width: 180 },
    { field: 'invoice_id', headerName: 'Invoice ID', width: 110 },
    { field: 'amount', headerName: 'Amount', width: 110 },
    { field: 'method', headerName: 'Method', width: 120 },
    { field: 'transaction_reference', headerName: 'Reference', flex: 1 },
  ], []);

  const invoiceTotals = useMemo(() => {
    const totalBilled = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const totalOutstanding = invoices.reduce((sum, invoice) => sum + invoice.balance_due, 0);
    const paidInvoices = invoices.filter((invoice) => invoice.balance_due <= 0).length;
    return { totalBilled, totalOutstanding, paidInvoices };
  }, [invoices]);

  const selectedInvoice = invoices.find((invoice) => invoice.id === paymentForm.invoice_id) ?? invoices[0];

  const downloadReceipt = (payment: Payment) => {
    const receipt = [
      ['Receipt ID', `RCP-${payment.id}`],
      ['Paid At', payment.paid_at],
      ['Invoice ID', String(payment.invoice_id)],
      ['Amount', String(payment.amount)],
      ['Method', payment.method],
      ['Reference', payment.transaction_reference ?? 'N/A'],
    ]
      .map((row) => row.join(','))
      .join('\n');
    const blob = new Blob([receipt], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${payment.id}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const invoiceGridColumns = useMemo<GridColDef[]>(() => [
    { field: 'invoice_number', headerName: 'Invoice #', width: 130 },
    { field: 'patient_id', headerName: 'Patient ID', width: 110 },
    { field: 'total', headerName: 'Total', width: 110 },
    { field: 'balance_due', headerName: 'Balance Due', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      renderCell: (params) => <Chip label={params.value as string} size="small" color={(params.value as string) === 'Paid' ? 'success' : (params.value as string) === 'Overdue' ? 'error' : 'warning'} />,
    },
    { field: 'insurance_provider', headerName: 'Insurance', flex: 1 },
  ], []);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3" sx={{ fontFamily: 'Space Grotesk' }}>Billing & Finance</Typography>
        <Typography color="text.secondary">Invoices, payment processing, insurance workflows, and accounting oversight.</Typography>
      </Box>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">Total billed</Typography>
              <Typography variant="h4" sx={{ fontFamily: 'Space Grotesk' }}>{invoiceTotals.totalBilled.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">Outstanding balance</Typography>
              <Typography variant="h4" sx={{ fontFamily: 'Space Grotesk' }}>{invoiceTotals.totalOutstanding.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">Paid invoices</Typography>
              <Typography variant="h4" sx={{ fontFamily: 'Space Grotesk' }}>{invoiceTotals.paidInvoices}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: 380, mb: 2.5 }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Space Grotesk' }}>Invoices</Typography>
              <DataGrid rows={invoices} columns={invoiceGridColumns} disableRowSelectionOnClick pageSizeOptions={[10, 25]} initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }} sx={{ border: 0 }} />
            </CardContent>
          </Card>
          <Card sx={{ height: 320 }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Space Grotesk' }}>Payments</Typography>
              <DataGrid rows={payments} columns={paymentColumns} disableRowSelectionOnClick pageSizeOptions={[10, 25]} initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }} sx={{ border: 0 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Stack spacing={2.5}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ fontFamily: 'Space Grotesk' }}>New invoice</Typography>
                  <TextField label="Invoice number" value={invoiceForm.invoice_number} onChange={(event) => setInvoiceForm({ ...invoiceForm, invoice_number: event.target.value })} />
                  <TextField select label="Patient" value={invoiceForm.patient_id} onChange={(event) => setInvoiceForm({ ...invoiceForm, patient_id: Number(event.target.value) })}>
                    {patients.map((patient) => (
                      <MenuItem key={patient.id} value={patient.id}>{patient.full_name} ({patient.mrn})</MenuItem>
                    ))}
                  </TextField>
                  <TextField label="Subtotal" type="number" value={invoiceForm.subtotal} onChange={(event) => setInvoiceForm({ ...invoiceForm, subtotal: Number(event.target.value) })} />
                  <TextField label="Tax" type="number" value={invoiceForm.tax} onChange={(event) => setInvoiceForm({ ...invoiceForm, tax: Number(event.target.value) })} />
                  <TextField label="Total" type="number" value={invoiceForm.total} onChange={(event) => setInvoiceForm({ ...invoiceForm, total: Number(event.target.value) })} />
                  <TextField label="Balance due" type="number" value={invoiceForm.balance_due} onChange={(event) => setInvoiceForm({ ...invoiceForm, balance_due: Number(event.target.value) })} />
                  <TextField label="Insurance provider" value={invoiceForm.insurance_provider} onChange={(event) => setInvoiceForm({ ...invoiceForm, insurance_provider: event.target.value })} />
                  <TextField label="Notes" value={invoiceForm.notes} onChange={(event) => setInvoiceForm({ ...invoiceForm, notes: event.target.value })} multiline minRows={2} />
                  <Button startIcon={<AddRoundedIcon />} variant="contained" onClick={() => onCreateInvoice({ ...invoiceForm, insurance_provider: invoiceForm.insurance_provider || undefined, notes: invoiceForm.notes || undefined })}>
                    Save invoice
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ fontFamily: 'Space Grotesk' }}>Record payment</Typography>
                  {selectedInvoice ? (
                    <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(15,118,110,0.07)' }}>
                      <Typography sx={{ fontWeight: 800 }}>{selectedInvoice.invoice_number}</Typography>
                      <Typography variant="body2" color="text.secondary">Balance due: {selectedInvoice.balance_due}</Typography>
                      <Typography variant="body2" color="text.secondary">Insurance: {selectedInvoice.insurance_provider || 'Self-pay'}</Typography>
                      <Chip
                        label={selectedInvoice.balance_due <= 0 ? 'Paid' : selectedInvoice.balance_due < selectedInvoice.total ? 'Pending' : 'Due'}
                        size="small"
                        color={selectedInvoice.balance_due <= 0 ? 'success' : selectedInvoice.balance_due < selectedInvoice.total ? 'warning' : 'error'}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  ) : null}
                  <TextField select label="Invoice" value={paymentForm.invoice_id} onChange={(event) => setPaymentForm({ ...paymentForm, invoice_id: Number(event.target.value) })}>
                    {invoices.map((invoice) => (
                      <MenuItem key={invoice.id} value={invoice.id}>{invoice.invoice_number} - {invoice.balance_due} due</MenuItem>
                    ))}
                  </TextField>
                  <TextField label="Amount" type="number" value={paymentForm.amount} onChange={(event) => setPaymentForm({ ...paymentForm, amount: Number(event.target.value) })} />
                  <TextField label="Method" value={paymentForm.method} onChange={(event) => setPaymentForm({ ...paymentForm, method: event.target.value })} />
                  <TextField label="Transaction reference" value={paymentForm.transaction_reference} onChange={(event) => setPaymentForm({ ...paymentForm, transaction_reference: event.target.value })} />
                  <TextField label="Received by user ID" type="number" value={paymentForm.received_by_id} onChange={(event) => setPaymentForm({ ...paymentForm, received_by_id: Number(event.target.value) })} />
                  <Button startIcon={<AddRoundedIcon />} variant="contained" onClick={() => onCreatePayment({ ...paymentForm, transaction_reference: paymentForm.transaction_reference || undefined })}>
                    Save payment
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      const amount = selectedInvoice?.balance_due ?? paymentForm.amount;
                      setPaymentForm((prev) => ({
                        ...prev,
                        amount,
                        method: prev.method === 'Razorpay' ? 'Razorpay' : 'Stripe',
                      }));
                    }}
                  >
                    One-click pay (Stripe/Razorpay)
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'Space Grotesk', mb: 2 }}>Invoice breakdown</Typography>
              {selectedInvoice ? (
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">Date: {new Date().toLocaleDateString()}</Typography>
                  <Typography variant="body2">Service total: {selectedInvoice.subtotal}</Typography>
                  <Typography variant="body2">Tax: {selectedInvoice.tax}</Typography>
                  <Typography variant="body2">Insurance coverage: {selectedInvoice.insurance_provider ? 'Included' : 'Not applied'}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>Net payable: {selectedInvoice.balance_due}</Typography>
                </Stack>
              ) : (
                <Typography color="text.secondary">Select an invoice to view detailed breakdown.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'Space Grotesk', mb: 2 }}>Receipts</Typography>
              <Stack spacing={1.25}>
                {payments.slice(0, 4).map((payment) => (
                  <Box key={payment.id} sx={{ p: 1.25, borderRadius: 2, backgroundColor: 'rgba(29,111,214,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>Payment #{payment.id}</Typography>
                      <Typography variant="caption" color="text.secondary">{new Date(payment.paid_at).toLocaleString()} · {payment.amount}</Typography>
                    </Box>
                    <Button size="small" variant="outlined" onClick={() => downloadReceipt(payment)}>Download</Button>
                  </Box>
                ))}
                {payments.length === 0 ? <Typography color="text.secondary">No payments recorded yet.</Typography> : null}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        {[
          ['Invoices', 'Generate line-item invoices and track balances due.'],
          ['Payments', 'Capture payment methods, transaction references, and receipts.'],
          ['Insurance', 'Store payer details and coverage context for claims.'],
          ['Revenue Analytics', 'Expose collections, aging, and denials data.'],
        ].map(([title, description]) => (
          <Grid item xs={12} md={6} key={title}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontFamily: 'Space Grotesk' }}>{title}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>{description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
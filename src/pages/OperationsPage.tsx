import { Box, Button, Card, CardContent, Checkbox, Grid, Stack, TextField, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import type { InventoryItem, LabOrder, OperationalSnapshot } from '../types';

type Props = {
  inventory: InventoryItem[];
  labOrders: LabOrder[];
  snapshots: OperationalSnapshot[];
  onCreateInventory: (payload: Record<string, unknown>) => Promise<void>;
};

export function OperationsPage({ inventory, labOrders, snapshots, onCreateInventory }: Props) {
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<OperationalSnapshot | null>(null);
  const [actionMessage, setActionMessage] = useState('');
  const [tasks, setTasks] = useState([
    { id: 'task-1', label: 'Check vitals in Ward A', done: false },
    { id: 'task-2', label: 'Administer morning medications', done: false },
    { id: 'task-3', label: 'Change post-op bandages', done: false },
  ]);
  const [bedAssignments, setBedAssignments] = useState([
    { id: 'bed-101', patient: 'Patient #1001', ward: 'Ward A' },
    { id: 'bed-203', patient: 'Patient #1004', ward: 'Ward B' },
    { id: 'bed-ER5', patient: 'Patient #1007', ward: 'Emergency' },
  ]);
  const [form, setForm] = useState({
    sku: `SKU-${Date.now()}`,
    name: '',
    category: 'Medication',
    quantity_on_hand: 1,
    reorder_level: 0,
    unit_cost: 0,
    location: 'Pharmacy A',
    supplier: '',
    expiry_date: '',
  });

  const inventoryColumns = useMemo<GridColDef[]>(() => [
    { field: 'sku', headerName: 'SKU', width: 150 },
    { field: 'name', headerName: 'Item', flex: 1.2 },
    { field: 'category', headerName: 'Category', width: 140 },
    { field: 'quantity_on_hand', headerName: 'Qty', width: 100 },
    { field: 'reorder_level', headerName: 'Reorder', width: 110 },
    { field: 'location', headerName: 'Location', flex: 1 },
  ], []);

  const labColumns = useMemo<GridColDef[]>(() => [
    { field: 'order_number', headerName: 'Order #', width: 130 },
    { field: 'patient_id', headerName: 'Patient ID', width: 110 },
    { field: 'test_name', headerName: 'Test', flex: 1.2 },
    { field: 'priority', headerName: 'Priority', width: 110 },
    { field: 'status', headerName: 'Status', width: 120 },
  ], []);

  const visibleInventory = useMemo(
    () => (lowStockOnly ? inventory.filter((item) => item.quantity_on_hand <= item.reorder_level) : inventory),
    [inventory, lowStockOnly],
  );

  const applySnapshotToForm = () => {
    if (!selectedSnapshot) return;
    const normalized = selectedSnapshot.title.toLowerCase();
    const inferredCategory = normalized.includes('ward') ? 'Ward Supply' : normalized.includes('emergency') ? 'Emergency Supply' : normalized.includes('surgery') ? 'Surgical Supply' : 'Medication';
    const inferredLocation = normalized.includes('ward') ? 'Ward Store' : normalized.includes('emergency') ? 'Emergency Bay' : normalized.includes('surgery') ? 'OT Store' : 'Pharmacy A';
    setForm((prev) => ({ ...prev, category: inferredCategory, location: inferredLocation }));
    setActionMessage(`Applied ${selectedSnapshot.title} context to inventory form.`);
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3" sx={{ fontFamily: 'Space Grotesk' }}>Hospital Operations Hub</Typography>
        <Typography color="text.secondary">Supply chain, wards, OT, diagnostics, and emergency logistics in one clinical console.</Typography>
      </Box>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: 380, mb: 2.5 }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Space Grotesk' }}>Supply Inventory</Typography>
              <DataGrid rows={visibleInventory} columns={inventoryColumns} disableRowSelectionOnClick pageSizeOptions={[10, 25]} initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }} sx={{ border: 0 }} />
            </CardContent>
          </Card>
          <Card sx={{ height: 320 }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Space Grotesk' }}>Laboratory orders</Typography>
              <DataGrid rows={labOrders} columns={labColumns} disableRowSelectionOnClick pageSizeOptions={[10, 25]} initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }} sx={{ border: 0 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontFamily: 'Space Grotesk' }}>Add inventory item</Typography>
                <TextField label="SKU" value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} />
                <TextField label="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                <TextField label="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
                <TextField label="Quantity on hand" type="number" value={form.quantity_on_hand} onChange={(event) => setForm({ ...form, quantity_on_hand: Number(event.target.value) })} />
                <TextField label="Reorder level" type="number" value={form.reorder_level} onChange={(event) => setForm({ ...form, reorder_level: Number(event.target.value) })} />
                <TextField label="Unit cost" type="number" value={form.unit_cost} onChange={(event) => setForm({ ...form, unit_cost: Number(event.target.value) })} />
                <TextField label="Location" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} />
                <TextField label="Supplier" value={form.supplier} onChange={(event) => setForm({ ...form, supplier: event.target.value })} />
                <TextField label="Expiry date" type="date" value={form.expiry_date} onChange={(event) => setForm({ ...form, expiry_date: event.target.value })} InputLabelProps={{ shrink: true }} />
                <Button startIcon={<AddRoundedIcon />} variant="contained" onClick={() => onCreateInventory({ ...form, supplier: form.supplier || undefined, expiry_date: form.expiry_date || undefined })}>
                  Save item
                </Button>
                <Button variant="outlined" onClick={() => setLowStockOnly((prev) => !prev)}>
                  {lowStockOnly ? 'Show all inventory' : 'Show low stock only'}
                </Button>
                <Button variant="outlined" onClick={applySnapshotToForm} disabled={!selectedSnapshot}>
                  Use selected snapshot in form
                </Button>
                {actionMessage ? <Typography variant="body2" color="text.secondary">{actionMessage}</Typography> : null}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        {snapshots.map((snapshot) => (
          <Grid item xs={12} md={6} key={snapshot.id}>
            <Card onClick={() => { setSelectedSnapshot(snapshot); setActionMessage(`Selected ${snapshot.title}.`); }} sx={{ cursor: 'pointer', borderColor: selectedSnapshot?.id === snapshot.id ? '#0f766e' : undefined }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontFamily: 'Space Grotesk' }}>{snapshot.title}</Typography>
                <Typography sx={{ mt: 1, fontWeight: 700 }} color="primary.main">{snapshot.status}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>{snapshot.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'Space Grotesk' }}>Nursing station tasks</Typography>
              <Stack spacing={1} sx={{ mt: 1.5 }}>
                {tasks.map((task) => (
                  <Stack key={task.id} direction="row" alignItems="center" spacing={1} sx={{ p: 1, borderRadius: 2, backgroundColor: task.done ? 'rgba(11,138,131,0.08)' : 'rgba(15,23,42,0.03)' }}>
                    <Checkbox
                      checked={task.done}
                      onChange={(event) => setTasks((prev) => prev.map((item) => (item.id === task.id ? { ...item, done: event.target.checked } : item)))}
                    />
                    <Typography sx={{ textDecoration: task.done ? 'line-through' : 'none' }}>{task.label}</Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'Space Grotesk' }}>Critical vitals alerts</Typography>
              <Stack spacing={1.25} sx={{ mt: 1.5 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(225,29,72,0.12)' }}>
                  <Typography sx={{ fontWeight: 700 }}>Patient #1007 · Oxygen saturation 86%</Typography>
                  <Typography variant="body2" color="text.secondary">Escalate to duty doctor and respiratory support.</Typography>
                </Box>
                <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(217,119,6,0.12)' }}>
                  <Typography sx={{ fontWeight: 700 }}>Patient #1004 · BP trending high</Typography>
                  <Typography variant="body2" color="text.secondary">Re-check vitals in 15 minutes.</Typography>
                </Box>
                <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(11,138,131,0.1)' }}>
                  <Typography sx={{ fontWeight: 700 }}>Patient #1001 · Stable after meds</Typography>
                  <Typography variant="body2" color="text.secondary">Continue routine monitoring.</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'Space Grotesk' }}>Bed management</Typography>
              <Stack spacing={1.25} sx={{ mt: 1.5 }}>
                {bedAssignments.map((assignment) => (
                  <Box key={assignment.id} sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(29,111,214,0.06)', display: 'flex', justifyContent: 'space-between', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{assignment.patient} · {assignment.id}</Typography>
                      <Typography variant="body2" color="text.secondary">Current ward: {assignment.ward}</Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="outlined" onClick={() => setBedAssignments((prev) => prev.map((item) => (item.id === assignment.id ? { ...item, ward: 'Ward A' } : item)))}>Move to Ward A</Button>
                      <Button size="small" variant="outlined" onClick={() => setBedAssignments((prev) => prev.map((item) => (item.id === assignment.id ? { ...item, ward: 'Ward B' } : item)))}>Move to Ward B</Button>
                      <Button size="small" variant="outlined" onClick={() => setBedAssignments((prev) => prev.map((item) => (item.id === assignment.id ? { ...item, ward: 'Emergency' } : item)))}>Move to ER</Button>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        {[
          ['Inventory & Pharmacy', 'Track stock, reorder thresholds, and vendor supply pipelines.'],
          ['Nursing & Ward Management', 'Beds, tasks, vitals, and handovers.'],
          ['Surgery & OT', 'Schedule rooms, staff, and critical resources.'],
          ['Emergency Department', 'Triage acuity, protocols, and escalation.'],
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
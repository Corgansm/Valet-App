export const MOCK_VEHICLES = [
  { id: '1', ticket: 'T001', name: 'John Smith', plate: 'ABC 1234', make: 'Toyota Camry', status: 'Parked', arrival: '2025-03-14T09:15:00' },
  { id: '2', ticket: 'T002', name: 'Jane Doe', plate: 'XYZ 5678', make: 'Honda Accord', status: 'Requested', arrival: '2025-03-14T08:45:00' },
  { id: '3', ticket: 'T003', name: 'Bob Wilson', plate: 'DEF 9012', make: 'Ford F-150', status: 'Parked', arrival: '2025-03-14T10:00:00' },
  { id: '4', ticket: 'T004', name: 'Alice Brown', plate: 'GHI 3456', make: 'Tesla Model 3', status: 'Retrieving', arrival: '2025-03-14T09:30:00' },
  { id: '5', ticket: 'T005', name: 'Charlie Davis', plate: 'JKL 7890', make: 'BMW 330i', status: 'Retrieved', arrival: '2025-03-14T08:00:00' },
  { id: '6', ticket: 'T006', name: 'Eva Martinez', plate: 'MNO 2345', make: 'Mercedes C-Class', status: 'Out', arrival: '2025-03-14T07:20:00' },
  { id: '7', ticket: 'T007', name: 'Frank Lee', plate: 'PQR 6789', make: 'Toyota RAV4', status: 'Parked', arrival: '2025-03-14T10:20:00' },
  { id: '8', ticket: 'T008', name: 'Grace Kim', plate: 'STU 0123', make: 'Honda Civic', status: 'Requested', arrival: '2025-03-14T09:50:00' },
];

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Vehicles' },
  { value: 'Parked', label: 'Parked' },
  { value: 'Requested', label: 'Requested' },
  { value: 'Retrieving', label: 'Retrieving' },
  { value: 'Retrieved', label: 'Retrieved' },
  { value: 'Out', label: 'Out' },
];

export const SORT_OPTIONS = [
  { value: 'arrival-asc', label: 'Arrival Time (Asc)' },
  { value: 'arrival-desc', label: 'Arrival Time (Desc)' },
  { value: 'ticket-asc', label: 'Ticket Number (Asc)' },
  { value: 'ticket-desc', label: 'Ticket Number (Desc)' },
];

export function formatArrival(iso) {
  const d = new Date(iso);
  const now = new Date();
  const today = d.toDateString() === now.toDateString();
  if (today) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function matchesSearch(vehicle, query) {
  if (!query || !query.trim()) return true;
  const lower = query.toLowerCase().trim();
  const plateNorm = (s) => (s || '').toLowerCase().replace(/\s/g, '');
  return (
    (vehicle.ticket || '').toLowerCase().includes(lower) ||
    (vehicle.name || '').toLowerCase().includes(lower) ||
    plateNorm(vehicle.plate).includes(plateNorm(query)) ||
    (vehicle.make || '').toLowerCase().includes(lower)
  );
}

export function getStatusLabel(value) {
  const opt = STATUS_OPTIONS.find((o) => o.value === value);
  return opt ? opt.label : value;
}

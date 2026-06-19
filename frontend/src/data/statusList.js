// src/data/statusList.js
export const statusList = [
  { id: 1, name: 'No Pickup' },
  { id: 2, name: 'Bonding / Might Keep In Touch' },
  { id: 3, name: 'Not Interested' },
  { id: 4, name: 'WhatsApp' },
  { id: 5, name: 'Stop Following Up' },
  { id: 6, name: 'Pending Appointment' },
  { id: 7, name: 'Appointment' },
  { id: 8, name: 'Booking' },
  { id: 9, name: 'Completed' },
  { id: 10, name: 'Not Yet Call' },
].sort((a, b) => a.name.localeCompare(b.name));

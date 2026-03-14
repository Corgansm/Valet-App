import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import ValetScreen from './src/screens/ValetScreen';
import CheckInScreen from './src/screens/CheckInScreen';
import { MOCK_VEHICLES } from './src/data/vehicles';

export default function App() {
  const [screen, setScreen] = useState('valet');
  const [vehicles, setVehicles] = useState(MOCK_VEHICLES);

  const handleConfirmCheckIn = ({ ticket, guestName, phone, rate }) => {
    const now = new Date().toISOString();
    setVehicles((prev) => {
      const nextId = String(prev.length + 1);
      const next = [
        {
          id: nextId,
          ticket: ticket || `T${nextId.padStart(3, '0')}`,
          name: guestName || 'Guest',
          plate: '',
          make: '',
          status: 'Parked',
          arrival: now,
          phone: phone || '',
          rate: rate?.value || null,
        },
        ...prev,
      ];
      return next;
    });
    setScreen('valet');
  };

  return (
    <>
      <StatusBar style="light" />
      {screen === 'valet' ? (
        <ValetScreen
          vehicles={vehicles}
          onPressCheckIn={() => setScreen('checkin')}
        />
      ) : (
        <CheckInScreen
          onBack={() => setScreen('valet')}
          onConfirm={handleConfirmCheckIn}
        />
      )}
    </>
  );
}

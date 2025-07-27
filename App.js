import { Tabs } from './components/Tabs';
import React, { useState, useEffect } from 'react';

export default function App() {
  const backendIP = "https://fwm-backend.vercel.app";
  // Enter IP here
  const [ip, setIP] = useState(YourIP);

  return <Tabs ip={ip}></Tabs>
}

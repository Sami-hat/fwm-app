import { Tabs } from './components/Tabs';
import React, { useState, useEffect } from 'react';

export default function App() {
  const backendIP = "192.168.1.226";
  // Enter IP here
  const [ip, setIP] = useState(YourIP);

  return <Tabs ip={ip}></Tabs>
}

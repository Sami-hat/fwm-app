import { Tabs } from './components/Tabs';
import React, { useState, useEffect } from 'react';

export default function App() {
  const YourIP = "138.251.180.0";
  // Enter IP here
  const [ip, setIP] = useState(YourIP);

  return <Tabs ip={ip}></Tabs>
}

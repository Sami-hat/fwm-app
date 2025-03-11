import { Tabs } from './components/Tabs';
import React, { useState, useEffect } from 'react';

export default function App() {
  const YourIP = "";
  // Enter IP here
  const [ip, setIP] = useState(YourIP);

  return <Tabs ip={ip}></Tabs>
}

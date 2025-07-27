import { Tabs } from './components/Tabs';
import React, { useState, useEffect } from 'react';

export default function App() {
  const backendIP = "https://fwm-backend.vercel.app/api";

  return <Tabs ip={backendIP}></Tabs>
}

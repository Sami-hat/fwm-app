import { Tabs } from './components/Tabs';

export default function App() {
  const API_BASE_URL = "https://fwm-backend-f0bnkvrtw-sami-hats-projects.vercel.app/api";

  return <Tabs ip={API_BASE_URL}></Tabs>
}

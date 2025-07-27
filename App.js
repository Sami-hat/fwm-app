import { Tabs } from './components/Tabs';

export default function App() {
  const API_BASE_URL = "https://fwm-backend-ah4x0vdkh-sami-hats-projects.vercel.app";

  return <Tabs ip={API_BASE_URL}></Tabs>
}

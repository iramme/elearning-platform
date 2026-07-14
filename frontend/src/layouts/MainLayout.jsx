import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
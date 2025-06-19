import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileModal from './MobileModal';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-white">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <MobileModal />
    </div>
  );
};

export default Layout;

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
const Layout: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  return <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>;
};
export default Layout;
import React from 'react';

import NavBar from 'components/NavBar';
import Sidebar from 'components/Sidebar';

interface Props {
  children: React.ReactNode | any;
}

function Layout({ children }: Props) {
  return (
    <div className="wrapper">
      <header className="header">
        <NavBar />
      </header>
      <aside>
        <Sidebar />
      </aside>
      <main className="main">
        <section className="vertical">{children}</section>
      </main>
    </div>
  );
}

export default Layout;

import { Outlet } from 'react-router-dom';

export function RootLayout() {
  return (
    <div>
      <nav>
        <a href="/">Home</a> | 
        <a href="/examples/astrochart">AstroChart Demo</a>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
} 
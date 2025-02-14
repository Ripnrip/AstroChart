import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import { AstroChartComponent } from '../examples/astrochart/AstroChartComponent';
import { RootLayout } from './components/RootLayout';
import '../examples/astrochart/styles.css';

// Create routes using JSX syntax for better clarity
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<div>Home</div>} />
      <Route path="examples">
        <Route path="astrochart" element={<AstroChartComponent />} />
      </Route>
    </Route>
  )
);

// Create root and render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
); 
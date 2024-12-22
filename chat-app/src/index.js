import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RegistrationPage from './components/RegistrationPage/RegistrationPage';
import LoginPage from './components/LoginPage/LoginPage';
import NoteState from './components/NoteState'; // Import your NoteState

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/Register",
    element: <RegistrationPage />,
  },
  {
    path: "/Login",
    element: <LoginPage />,
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NoteState>
      <RouterProvider router={router} />
    </NoteState>
  </React.StrictMode>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RegistrationPage from './components/RegistrationPage';
import LoginPage from './components/LoginPage';
import NoteState from './components/NoteState'; // Import your NoteState

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/Register",
    element: <RegistrationPage/>,
  },
  {
    path : "/Login" ,
    element:<LoginPage/>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NoteState> {/* Wrap everything inside NoteState */}
      <RouterProvider router={router}/>
    </NoteState>
  </React.StrictMode>
);

reportWebVitals();

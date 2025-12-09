import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';
import Dashboard from './components/dashboard/Dashboard';
import AddGem from './components/gems/AddGem';
import PrivateRoute from './components/auth/PrivateRoute';
import './App.css';
import MyGems from './components/gems/MyGems';
import GemDetails from './components/gems/GemDetails';
import EditGem from './components/gems/EditGem';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Seller/Collector Routes */}
            <Route
              path="/add-gem"
              element={
                <PrivateRoute roles={['seller', 'collector']}>
                  <AddGem />
                </PrivateRoute>
              }
            />

            {/* My Gems Route (for later) */}
            

            {/* Marketplace Route (for later) */}
            <Route
              path="/marketplace"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Watchlist Route (for later) */}
            <Route
              path="/watchlist"
              element={
                <PrivateRoute roles={['buyer']}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
  <Route
  path="/edit-gem/:id"
  element={
    <PrivateRoute roles={['seller', 'collector']}>
      <EditGem />
    </PrivateRoute>
  }
/>


<Route
  path="/my-gems"
  element={
    <PrivateRoute roles={['seller', 'collector']}>
      <MyGems />
    </PrivateRoute>
  }
/>
<Route
  path="/gems/:id"
  element={
    <PrivateRoute>
      <GemDetails />
    </PrivateRoute>
  }
/>

            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
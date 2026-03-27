/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Simulator from './pages/Simulator';
import Coach from './pages/Coach';
import Wallet from './pages/Wallet';
import Quizzes from './pages/Quizzes';
import Onboarding from './pages/Onboarding';
import NetWorthCalculator from './pages/NetWorthCalculator';
import Home from './pages/Home';

export default function App() {
  const isLoggedIn = useStore((state) => state.isLoggedIn);

  return (
    <BrowserRouter>
      {!isLoggedIn ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="simulator" element={<Simulator />} />
            <Route path="coach" element={<Coach />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="quizzes" element={<Quizzes />} />
            <Route path="net-worth" element={<NetWorthCalculator />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  );
}

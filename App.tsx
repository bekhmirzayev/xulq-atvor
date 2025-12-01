import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { StudentAnalysis } from './pages/StudentAnalysis';
import { StaffAnalysis } from './pages/StaffAnalysis';
import { Trends } from './pages/Trends';
import { DataProvider } from './contexts/DataContext';

const App: React.FC = () => {
  return (
    <DataProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<StudentAnalysis />} />
            <Route path="/staff" element={<StaffAnalysis />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </DataProvider>
  );
};

export default App;
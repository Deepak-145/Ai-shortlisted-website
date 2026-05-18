import { Routes, Route, Navigate } from 'react-router-dom';
// redeploy
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddCandidate from './pages/AddCandidate.jsx';
import CandidateList from './pages/CandidateList.jsx';
import JobMatching from './pages/JobMatching.jsx';
import AIShortlist from './pages/AIShortlist.jsx';
import EditCandidate from './pages/EditCandidate.jsx';

export default function App() {
  return (
    <div className="min-h-full bg-app-gradient dark:bg-app-gradient">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/candidates" element={<CandidateList />} />
            <Route path="/candidates/new" element={<AddCandidate />} />
            <Route path="/candidates/:id/edit" element={<EditCandidate />} />
            <Route path="/match" element={<JobMatching />} />
            <Route path="/ai" element={<AIShortlist />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

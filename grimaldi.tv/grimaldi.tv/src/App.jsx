import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';

import Layout from './components/Layout';
import Home from './pages/Home';
import Episodes from './pages/Episodes';
import About from './pages/About';
import Store from './pages/Store';
import FunnyPhotos from './pages/FunnyPhotos';
import PressEvents from './pages/PressEvents';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import PhotoDetail from './pages/PhotoDetail';
import Live from './pages/Live';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/Home" replace />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/Episodes" element={<Episodes />} />
              <Route path="/About" element={<About />} />
              <Route path="/Store" element={<Store />} />
              <Route path="/FunnyPhotos" element={<FunnyPhotos />} />
              <Route path="/FunnyPhotos/:id" element={<PhotoDetail />} />
              <Route path="/PressEvents" element={<PressEvents />} />
              <Route path="/Blog" element={<Blog />} />
              <Route path="/Blog/:slug" element={<BlogPost />} />
              <Route path="/Live" element={<Live />} />
            </Route>
            {/* Auth pages exist standalone (no top nav chrome) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App

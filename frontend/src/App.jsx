import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import CreateCourse from './pages/instructor/CreateCourse';
import ManageCourse from './pages/instructor/ManageCourse';
import Home from './pages/public/Home';
import CourseCatalog from './pages/public/CourseCatalog';
import CourseDetail from './pages/public/CourseDetail';
import CheckoutSuccess from './pages/public/CheckoutSuccess';
import CheckoutCancel from './pages/public/CheckoutCancel';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/student/Dashboard';
import InstructorDashboard from './pages/instructor/Dashboard';
import MyCourses from './pages/student/MyCourses';
import CoursePlayer from './pages/student/CoursePlayer';
import MyCertificates from './pages/student/MyCertificates';
function App() {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/cancel" element={<CheckoutCancel />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-courses"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <MyCourses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/learn/:slug"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <CoursePlayer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses/new"
            element={
             <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
               <CreateCourse />
             </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/courses/:slug/edit"
            element={
             <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
               <ManageCourse />
             </ProtectedRoute>
          }
          />
          <Route
            path="/my-certificates"
            element={
             <ProtectedRoute allowedRoles={['STUDENT']}>
               <MyCertificates />
             </ProtectedRoute>
          } 
         />
         </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
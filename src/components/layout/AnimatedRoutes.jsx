import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import ProtectedRoute from '../../routes/ProtectedRoute';
import AdminRoute     from '../../routes/AdminRoute';

import Home          from '../../pages/Home';
import SupportWall   from '../../pages/SupportWall';
import JoinMovement  from '../../pages/JoinMovement';
import SignIn        from '../../pages/SignIn';
import ForgotPassword from '../../pages/ForgotPassword';
import Profile       from '../../pages/Profile';
import EditProfile   from '../../pages/EditProfile';
import AboutUs       from '../../pages/AboutUs';
import DefensePage   from '../../pages/DefensePage';
import Dashboard     from '../../pages/admin/Dashboard';

import PortalLayout  from '../portal/PortalLayout';
import PatientPortal from '../../pages/PatientPortal';
import LearnPage     from '../../pages/portal/LearnPage';
import QuizPage      from '../../pages/portal/QuizPage';
import SymptomsPage  from '../../pages/portal/SymptomsPage';
import DrugsPage     from '../../pages/portal/DrugsPage';
import ProgressPage  from '../../pages/portal/ProgressPage';

import HCPLayout      from '../hcp/HCPLayout';
import HCPPortal      from '../../pages/HCPPortal';
import AWaRePage      from '../../pages/hcp/AWaRePage';
import HCPQuizPage    from '../../pages/hcp/HCPQuizPage';
import ToolPage       from '../../pages/hcp/ToolPage';
import TrendsPage     from '../../pages/hcp/TrendsPage';
import HCPProgressPage from '../../pages/hcp/HCPProgressPage';

export default function AnimatedRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>

        <Route path="/"             element={<Home />} />
        <Route path="/support-wall" element={<SupportWall />} />
        <Route path="/join"         element={<JoinMovement />} />
        <Route path="/sign-in"      element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile/:uid" element={<Profile />} />
        <Route path="/about"        element={<AboutUs />} />
        <Route path="/defense"      element={<DefensePage />} />

        <Route path="/portal" element={<PortalLayout />}>
          <Route index           element={<PatientPortal />} />
          <Route path="learn"    element={<LearnPage />} />
          <Route path="quiz"     element={<QuizPage />} />
          <Route path="symptoms" element={<SymptomsPage />} />
          <Route path="drugs"    element={<DrugsPage />} />
          <Route path="progress" element={<ProgressPage />} />
        </Route>

        <Route path="/hcp" element={<HCPLayout />}>
          <Route index         element={<HCPPortal />} />
          <Route path="aware"    element={<AWaRePage />} />
          <Route path="quiz"     element={<HCPQuizPage />} />
          <Route path="tool"     element={<ToolPage />} />
          <Route path="trends"   element={<TrendsPage />} />
          <Route path="progress" element={<HCPProgressPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/profile/edit" element={<EditProfile />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Dashboard />} />
        </Route>

      </Routes>
    </>
  );
}

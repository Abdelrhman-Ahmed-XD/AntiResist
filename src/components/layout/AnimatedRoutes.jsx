import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ScrollToTop from './ScrollToTop';
import ProtectedRoute from '../../routes/ProtectedRoute';
import AdminRoute     from '../../routes/AdminRoute';

import Home          from '../../pages/Home';
import SupportWall   from '../../pages/SupportWall';
import JoinMovement  from '../../pages/JoinMovement';
import SignIn          from '../../pages/SignIn';
import ForgotPassword from '../../pages/ForgotPassword';
import Profile       from '../../pages/Profile';
import EditProfile   from '../../pages/EditProfile';
import AboutUs       from '../../pages/AboutUs';
import DefensePage   from '../../pages/DefensePage';
import Dashboard     from '../../pages/admin/Dashboard';

/* Portal layout + pages */
import PortalLayout  from '../portal/PortalLayout';
import PatientPortal from '../../pages/PatientPortal';
import LearnPage     from '../../pages/portal/LearnPage';
import QuizPage      from '../../pages/portal/QuizPage';
import SymptomsPage  from '../../pages/portal/SymptomsPage';
import DrugsPage     from '../../pages/portal/DrugsPage';
import ProgressPage  from '../../pages/portal/ProgressPage';

/* HCP layout + pages */
import HCPLayout     from '../hcp/HCPLayout';
import HCPPortal     from '../../pages/HCPPortal';
import AWaRePage     from '../../pages/hcp/AWaRePage';
import HCPQuizPage   from '../../pages/hcp/HCPQuizPage';
import ToolPage      from '../../pages/hcp/ToolPage';
import TrendsPage    from '../../pages/hcp/TrendsPage';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit:    { opacity: 0, transition: { duration: 0 } },
};

function PageWrapper({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
    <ScrollToTop />
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>

        {/* Standalone pages */}
        <Route path="/"            element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/support-wall" element={<PageWrapper><SupportWall /></PageWrapper>} />
        <Route path="/join"        element={<PageWrapper><JoinMovement /></PageWrapper>} />
        <Route path="/sign-in"        element={<PageWrapper><SignIn /></PageWrapper>} />
        <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
        <Route path="/profile/:uid" element={<PageWrapper><Profile /></PageWrapper>} />
        <Route path="/about"       element={<PageWrapper><AboutUs /></PageWrapper>} />
        <Route path="/defense"     element={<PageWrapper><DefensePage /></PageWrapper>} />

        {/* Patient Portal — nested under shared layout */}
        <Route path="/portal" element={<PageWrapper><PortalLayout /></PageWrapper>}>
          <Route index        element={<PatientPortal />} />
          <Route path="learn"    element={<LearnPage />} />
          <Route path="quiz"     element={<QuizPage />} />
          <Route path="symptoms" element={<SymptomsPage />} />
          <Route path="drugs"    element={<DrugsPage />} />
          <Route path="progress" element={<ProgressPage />} />
        </Route>

        {/* HCP Portal — nested under shared layout */}
        <Route path="/hcp" element={<PageWrapper><HCPLayout /></PageWrapper>}>
          <Route index        element={<HCPPortal />} />
          <Route path="aware"  element={<AWaRePage />} />
          <Route path="quiz"   element={<HCPQuizPage />} />
          <Route path="tool"   element={<ToolPage />} />
          <Route path="trends" element={<TrendsPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/profile/edit" element={<PageWrapper><EditProfile /></PageWrapper>} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<PageWrapper><Dashboard /></PageWrapper>} />
        </Route>

      </Routes>
    </AnimatePresence>
    </>
  );
}

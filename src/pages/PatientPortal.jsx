import HeroPortal      from '../components/portal/HeroPortal';
import PortalDashboard from '../components/portal/PortalDashboard';
import InfoModules     from '../components/portal/InfoModules';
import MedicineCabinet from '../components/portal/MedicineCabinet';

export default function PatientPortal() {
  return (
    <>
      <HeroPortal />
      <PortalDashboard />
      <div className="border-t border-purple-900/30" style={{ background: 'rgba(7,7,26,0.4)' }}>
        <InfoModules />
      </div>
      <div className="border-t border-purple-900/30" style={{ background: 'rgba(7,7,26,0.5)' }}>
        <MedicineCabinet />
      </div>
    </>
  );
}

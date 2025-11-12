import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import StoragePieChart from '../components/StoragePieChart';
import UniversityAccordion from '../components/UniversityAccordion';
import '../css/style.css';

const StorageDashboard = ({userRole}) => {
  const [capacity, setCapacity] = useState({ used: 0, free: 0, total: 1 });
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    fetch('/api/metrics')
      .then(res => res.json())
      .then(data => setCapacity(data));

    fetch('/api/documents')
      .then(res => res.json())
      .then(data => setUniversities(data));
  }, []);

  return (
    <>
      <Sidebar userRole={userRole} />
      <div className='pie-section'>
        <h1>Documents Storage</h1>
        <StoragePieChart capacity={capacity} />
        <UniversityAccordion universities={universities} setUniversities={setUniversities} />
      </div>
    </>
  );
};

export default StorageDashboard;

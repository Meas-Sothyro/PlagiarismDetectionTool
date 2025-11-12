import { useState } from 'react';
import { Link } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';
import '../css/style.css';

const Sidebar = ({ userRole }) => {
  const [isClosed, setIsClosed] = useState(false);

  const toggleSidebar = () => {
    setIsClosed(!isClosed);
  };

  return (
    <div className={`sidebar ${isClosed ? 'close' : ''}`}>
      <div className="logo-details">
        <i className='bx bx-menu' onClick={toggleSidebar}></i>
        <span className="logo_name">MoEYS</span>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/upload">
            <i className='bx bx-pie-chart-alt-2'></i>
            <span className="link_name">Check Plagiarism</span>
          </Link>
        </li>
        <li>
          <Link to="/new-upload">
            <i className='bx bx-compass'></i>
            <span className="link_name">Upload New Files</span>
          </Link>
        </li>
        {userRole === 'admin' && (
          <li>
            <Link to="/storage">
              <i className='bx bx-compass'></i>
              <span className="link_name">Files</span>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;

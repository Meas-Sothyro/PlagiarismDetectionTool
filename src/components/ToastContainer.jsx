import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastMaster = () => {
  return <ToastContainer position="top-center" autoClose={2000} toastStyle={{ background: '#11101D', color: 'white' }} />;
};

export default ToastMaster;

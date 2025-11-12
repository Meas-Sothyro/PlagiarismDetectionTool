import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-toastify';
import DragDropArea from '../components/DragDropArea';
import UploadButton from '../components/UploadButton'
import EmailInput from '../components/EmailInput';
import axios from 'axios';
import FilePanel from '../components/FilePanel';

const UploadPage = ({userRole}) => {
  const [accumulatedFiles, setAccumulatedFiles] = useState([]);
  const [email, setEmail] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Prevent opening new page when dragging files
  const handleDrop = (e) => {
    e.preventDefault();
    const files = [...e.dataTransfer.files];
    setAccumulatedFiles(prev => [...prev, ...files]);
  };

  const handleDragOver = (e) => e.preventDefault();

  // Check files type during upload
  const handleFileChange = (e) => {
    const files = [...e.target.files];
    const validFiles = files.filter(file => ['pdf', 'docx', 'txt'].includes(file.name.split('.').pop()));
    setAccumulatedFiles(prev => [...prev, ...validFiles]);
  };

  // Remove files function
  const removeFile = (index) => {
    setAccumulatedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Alert when no files are found
  const syncAndSubmit = async (e) => {
    e.preventDefault();

    if (isUploading) return;
    setIsUploading(true); 

    if (accumulatedFiles.length === 0) {
      toast.warn('No files selected.');
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    accumulatedFiles.forEach(file => formData.append('files', file));

    const toastId = toast.loading("Uploading... 0%");

    try {
      const response = await axios.post(
        '/api/analyze',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            toast.update(toastId, {
              render: `Uploading... ${percent}%`,
              isLoading: true,
            });
          }
        }
      );

      toast.update(toastId, {
        render: response.data.message || 'Files queued for analysis.',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });

    } catch (err) {
      toast.update(toastId, {
        render: err.response?.data?.error || 'Failed to send files: ' + err.message,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
      console.error(err);
    } finally {
      setIsUploading(false); // ✅ Always re-enable upload
      setAccumulatedFiles([]);
      setEmail('');
    }
  };


  return (
    <>
      <Sidebar userRole={userRole} />

      <div className="home-section">
        <h1 style={{ marginBottom: '15px' }}>Upload a Document for Plagiarism Check</h1>

        <form onSubmit={syncAndSubmit} className="upload-form">
          
          <EmailInput email={email} setEmail={setEmail} />

          <div className="uploader-row">
            <DragDropArea
              handleFileChange={handleFileChange}
              handleDrop={handleDrop}
              handleDragOver={handleDragOver}
            />

            <FilePanel accumulatedFiles={accumulatedFiles} removeFile={removeFile} />
          </div>
                              
          <UploadButton isUploading={isUploading} />

        </form>
      </div>
    </>
  );
};

export default UploadPage;

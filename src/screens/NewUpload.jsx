import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import '../css/style.css';
import { toast } from 'react-toastify';
import DragDropArea from '../components/DragDropArea';
import UploadButton from '../components/UploadButton';
import FileList from '../components/FileList';
import UniversitySelector from '../components/UniversitySelector';
import EmailInput from '../components/EmailInput';
import axios from 'axios';
import FilePanel from '../components/FilePanel';

const UploadNewPage = ({userRole}) => {
    
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [newUniversity, setNewUniversity] = useState('');
  const [accumulatedFiles, setAccumulatedFiles] = useState([]);
  const [showNewUniversityInput, setShowNewUniversityInput] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [email, setEmail] = useState('');
  const [isUploading, setIsUploading] = useState(false);


  // University Selection
  const handleUniversityChange = (e) => {
    const value = e.target.value;
    setSelectedUniversity(value);
    setShowNewUniversityInput(value === 'new');
  };

  // Find files
  const handleFileChange = (e) => {
    e.preventDefault();
    const files = [...e.target.files];
    const validFiles = files.filter(file =>
      ['pdf', 'docx'].includes(file.name.split('.').pop())
    );
    setAccumulatedFiles(prev => [...prev, ...validFiles]);
  };

  // Avoid opening new browser
  const handleDrop = (e) => {
    e.preventDefault();
    const files = [...e.dataTransfer.files];
    setAccumulatedFiles(prev => [...prev, ...files]);
  };

  const handleDragOver = (e) => e.preventDefault();

  // Remove selected files
  const removeFile = (index) => {
    setAccumulatedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Files Submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isUploading) return; // prevent duplicate click
    
    if (!selectedUniversity) {
      toast.error('Please select a university or add a new one.');
      return;
    }

    if (selectedUniversity === 'new' && newUniversity.trim() === '') {
      toast.error('Please enter the name of the new university.');
      return;
    }

    if (accumulatedFiles.length === 0) {
      toast.error('No files selected. Please select a file before uploading.');
      return;
    }
  
    setIsUploading(true);
    
    // Upload documents to the server side
    const formData = new FormData();
    formData.append('university', selectedUniversity === 'new' ? newUniversity : selectedUniversity);
    formData.append('email', email);
    accumulatedFiles.forEach(file => formData.append('files', file));

    try {
      const toastId = toast.loading('Uploading... 0%');

      const response = await axios.post(
        '/api/upload',
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

      const result = response.data;

      toast.update(toastId, {
        render: result.message || 'Upload completed.',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });

      if (result.errors && result.errors.length > 0) {
        result.errors.forEach(err => toast.error(err));
      }

    } catch (err) {
      toast.update(toastId, {
        render: err.response?.data?.error || 'Upload failed: ' + err.message,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
      console.error(err.message);
    } finally {
    setIsUploading(false);
  }

    setAccumulatedFiles([]);
    setSelectedUniversity('');
    setNewUniversity('');
    setShowNewUniversityInput(false);
  };

  useEffect(() => {
  fetch('/api/universities')
    .then(res => res.json())
    .then(data => {
      if (data.universities) {
        setUniversities(data.universities);
      } else {
        console.log(data.error)
        toast.error('Failed to load universities: ' + data.error);
      }
    })
    .catch(err => toast.error('Failed to load universities'));
  }, []);

  return (
    <>
      <Sidebar userRole={userRole} />
      <div className="home-section">
        <h1 style={{ marginBottom: '15px' }}>Upload New Document to Centralized Database</h1>

        <form onSubmit={handleSubmit} className="upload-form">

          <UniversitySelector
            universities={universities}
            selectedUniversity={selectedUniversity}
            handleUniversityChange={handleUniversityChange}
          />

          {showNewUniversityInput && (
            <div className="form-group" style={{ marginBottom: '5px' }}>
              <label htmlFor="new-university-name">New University Name: </label>
              <input
                type="text"
                placeholder='Enter University Name'
                id="new-university-name"
                className="form-control decorated-input"
                value={newUniversity}
                onChange={(e) => setNewUniversity(e.target.value)}
              />
            </div>
          )}
          <EmailInput email={email} setEmail={setEmail} />

          <div className="uploader-row">
            <DragDropArea
              handleFileChange={handleFileChange}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
            />

            <FilePanel accumulatedFiles={accumulatedFiles} removeFile={removeFile} />
          </div>
          <UploadButton isUploading={isUploading} />
        </form>
      </div>
    </>
  );
};

export default UploadNewPage;

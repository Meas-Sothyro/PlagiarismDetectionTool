import { useState } from 'react';
import '../css/accordion.css';
import { toast } from 'react-toastify';

const UniversityAccordion = ({ universities, setUniversities }) => {

  const [openUni, setOpenUni] = useState(null);
  const [confirmingFile, setConfirmingFile] = useState(null);
  const [confirmingFolder, setConfirmingFolder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const term = searchTerm.trim().toLowerCase();

  const handleDeleteFile = async (uniName, fileUid, fileName) => {
    toast.info(`Deleting file "${fileName}"...`);
    try {
      const res = await fetch(
        `/api/delete-file/${encodeURIComponent(uniName)}/${encodeURIComponent(fileUid)}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        toast.success(`Deleted file "${fileName}" from ${uniName}`);
        // Update UI state
        setUniversities(prev => {
          return prev.map(uni => {
            if (uni.name !== uniName) return uni;
            return {
              ...uni,
              files: uni.files.filter(f => f !== fileName)
            };
          }).filter(uni => uni.files.length > 0 || uni.name !== uniName); // Remove uni if no files
        });
      } else {
        toast.error(`Failed to delete file "${fileName}"`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error deleting file');
    }
  };

  const handleDeleteUniversity = async (uniName) => {
    toast.info(`Deleting folder "${uniName}"...`);
    try {
      const res = await fetch(
        `/api/delete-university/${encodeURIComponent(uniName)}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        toast.success(`Deleted folder "${uniName}"`);
        // Update UI state
        setUniversities(prev => prev.filter(uni => uni.name !== uniName));
      } else {
        toast.error(`Failed to delete folder "${uniName}"`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error deleting folder');
    }
  };


  const filteredUniversities = universities
    .map((uni) => {
    const uniMatch = uni.name.toLowerCase().includes(term);
    const files = uniMatch
      ? uni.files // show all files if university name matches
      : uni.files.filter((file) =>
          file.filename.toLowerCase().includes(term)
        );

    return { ...uni, files };
    })
    .filter((uni) => uni.files.length > 0);

  return (
    <div className="accordion-wrapper">
      <div className="accordion-header-bar">
        <h2 className="accordion-title">Overall Documents</h2>
        <input
          type="text"
          className="accordion-search"
          placeholder="Search files or universities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="accordion-container">
        {filteredUniversities.length > 0 ? (
          filteredUniversities.map((uni, index) => (
            <div className="accordion-card" key={uni.name}>
              <button
                className="accordion-header"
                onClick={() => setOpenUni(openUni === uni.name ? null : uni.name)}
              >
                <span style={{ fontFamily: 'Noto Sans Khmer' }}>{uni.name}</span>
                <div>
                <button
                  className="delete-button-rect"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirmingFolder === uni.name) {
                      handleDeleteUniversity(uni.name);
                      setConfirmingFolder(null);
                    } else {
                      setConfirmingFolder(uni.name);
                      toast.info(`Click again to confirm deletion of folder "${uni.name}"`);
                      setTimeout(() => setConfirmingFolder(null), 3000);
                    }
                  }}
                >
                  {confirmingFolder === uni.name ? 'CONFIRM DELETE' : 'DELETE'}
                </button>
                <span>{openUni === uni.name ? '▲' : '▼'}</span>
                </div>
              </button>

              {openUni === uni.name && uni.files.map((file, i) => (
                <li key={file.uid} className="file-item">
                  <a
                    href={`/api/download/${encodeURIComponent(uni.name)}/${encodeURIComponent(file.uid)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.filename}
                  </a>
                  <button
                    className="delete-button-rect"
                    onClick={() => {
                      const key = `${uni.name}/${file.uid}`;
                      if (confirmingFile === key) {
                        handleDeleteFile(uni.name, file.uid, file.filename);
                        setConfirmingFile(null);
                      } else {
                        setConfirmingFile(key);
                        toast.info(`Click again to confirm deletion of "${file.filename}"`);
                        setTimeout(() => setConfirmingFile(null), 3000);
                      }
                    }}
                  >
                    {confirmingFile === `${uni.name}/${file.uid}` ? 'CONFIRM DELETE' : 'DELETE'}
                  </button>
                </li>
              ))}
            </div>
          ))
        ) : (
          <p style={{ marginTop: '1rem', color: '#777' }}>
            No documents found.
          </p>
        )}
      </div>
    </div>
  );
};

export default UniversityAccordion;

const FileList = ({ accumulatedFiles, removeFile }) => {
  return (
    <div className="file-list-container">
      {accumulatedFiles.map((file, index) => (
        <div key={index} className="file-entry">
          <span title={file.name}>{file.name}</span>
          <button
            type="button"
            className="delete-file-btn"
            onClick={() => removeFile(index)}
          >
            <i className="bx bxs-trash"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default FileList;

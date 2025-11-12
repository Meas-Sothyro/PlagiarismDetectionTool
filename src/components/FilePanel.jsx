const FilePanel = ({ accumulatedFiles, removeFile }) => {
  const formatBytes = (bytes) => {
    if (!bytes && bytes !== 0) return "";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
    return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${sizes[i]}`;
  };

  return (
    <aside className="file-panel">
      <div className="file-panel-header">
        <span>Files ({accumulatedFiles.length})</span>
      </div>

      <div className="file-scroll">
        {accumulatedFiles.length === 0 ? (
          <div className="file-empty">No files yet</div>
        ) : (
          accumulatedFiles.map((file, index) => (
            <div key={`${file.name}-${index}`} className="file-bar">
              <span className="file-name" title={file.name}>
                {file.name}
              </span>
              <span className="file-size">{formatBytes(file.size)}</span>
              <button
                type="button"
                className="delete-file-btn"
                onClick={() => removeFile(index)}
              >
                <i className="bx bxs-trash"></i>
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default FilePanel;
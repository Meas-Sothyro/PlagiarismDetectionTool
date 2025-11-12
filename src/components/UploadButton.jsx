const UploadButton = ({ isUploading }) => {
  return (
    <div className="button-container">
      <button
        type="submit"
        className="upload-button"
        disabled={isUploading}
      >
        {isUploading && <span className="spinner"></span>}
        {isUploading ? 'Uploading...' : 'Submit Files'}
      </button>
    </div>
  );
};

export default UploadButton;

import { useRef } from 'react';

const DragDropArea = ({ handleFileChange, handleDrop, handleDragOver }) => {
  const fileInputRef = useRef(null);

  const handleDivClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className="drag-drop-area"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleDivClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        hidden
        multiple
        accept=".pdf,.docx,.txt"
        onChange={handleFileChange}
      />
      <label className="drag-drop-text">
        Drag and drop a file here or click to select a file
      </label>
    </div>
  );
};

export default DragDropArea;

const UniversitySelector = ({
  universities = [],
  selectedUniversity,
  handleUniversityChange
}) => {
  // helper: detect Khmer vs English
  const isKhmer = (text) => /^[\u1780-\u17FF]/.test(text); // Khmer unicode block
  const isEnglish = (text) => /^[A-Za-z]/.test(text);

  const sortedUniversities = [...universities].sort((a, b) => {
    const aKhmer = isKhmer(a);
    const bKhmer = isKhmer(b);
    const aEng = isEnglish(a);
    const bEng = isEnglish(b);

    // Khmer first
    if (aKhmer && !bKhmer) return -1;
    if (bKhmer && !aKhmer) return 1;

    // English second
    if (aEng && !bEng) return -1;
    if (bEng && !aEng) return 1;

    // If same category → alphabetical
    return a.localeCompare(b);
  });

  return (
    <div className="form-floating" style={{ marginBottom: "5px" }}>
      <label htmlFor="university-select">Choose the Following Universities: </label>
      <select
        id="university-select"
        className="form-select decorated-input"
        value={selectedUniversity}
        onChange={handleUniversityChange}
      >
        <option value="">Select University</option>
        {sortedUniversities.map((uni, index) => (
          <option key={index} value={uni}>
            {uni}
          </option>
        ))}
        <option value="new">Add New University</option>
      </select>
    </div>
  );
};

export default UniversitySelector;
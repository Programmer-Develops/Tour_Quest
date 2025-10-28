import React from 'react';

const FileBase64 = ({ multiple, onDone }) => {
  const handleChange = (e) => {
    // get the files
    const files = e.target.files;

    // Process each file
    const allFiles = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = () => {
        // Store result
        allFiles.push({
          base64: reader.result,
          name: file.name,
          type: file.type,
          size: Math.round(file.size / 1000) + ' kB',
        });
        
        // If all files have been processed
        if (allFiles.length === (multiple ? files.length : 1)) {
          // Return the files
          onDone(multiple ? allFiles : allFiles[0]);
        }
      };
    }
  };

  return (
    <input
      type="file"
      onChange={handleChange}
      multiple={multiple}
      accept="image/*"
    />
  );
};

export default FileBase64;
import { useState } from "react";
import axios from "axios";
import { IoAttach } from "react-icons/io5";

function FileUploadButton() {
  const [message, setMessage] = useState("");

  const onFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      await onFileUpload(selectedFile);
    }
  };

  const onFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setMessage("Upload successful!");
      }
    } catch (error) {
      console.error("There was an error uploading the file!", error);
      setMessage("Upload failed.");
    }
  };

  return (
    <>
      <input
        type="file"
        onChange={onFileChange}
        style={{ display: "none" }}
        id="fileInput"
      />
      <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
        <IoAttach size="30px" />
      </label>
    </>
  );
}

export default FileUploadButton;

import React, { useState } from "react";
import axiosInstance from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css"; // Import the CSS module

function Register() {
  const navigate = useNavigate();
  const [UserEmail, setUserEmail] = useState<string>('');
  const [UserName, setUserName] = useState<string>('');
  const [UserPassword, setUserPassword] = useState<string>('');
  const [ProfileFile, setProfileFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("UserEmail", UserEmail);
    formData.append("UserName", UserName);
    formData.append("UserPassword", UserPassword);
    if (ProfileFile) {
      formData.append("ProfilePicture", ProfileFile);
    }

    try {
      const response = await axiosInstance.post("/createUsers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(response.data.message);
      navigate("/login");
    } catch (error: any) {
      console.error(error.response?.data || "Something went wrong");
    }
  };

  const gotoLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <div className={styles.mainStyles}>
        <div className={styles.card}>
          <h2  className={styles.title}>Register</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setProfileFile(e.target.files[0]);
                }
              }}
            />
            <label className={styles.labelForm}>Profile Picture</label>

            <label className={styles.labelForm}>User Name:</label>
            <input
              type="text"
              value={UserName}
              className={styles.inputField}
              onChange={(e) => setUserName(e.target.value)}
            />
            <label className={styles.labelForm}>User Email:</label>
            <input
              type="email"
              value={UserEmail}
              className={styles.inputField}
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <label className={styles.labelForm}>User Password:</label>
            <input
              type="password"
              value={UserPassword}
              className={styles.inputField}
              onChange={(e) => setUserPassword(e.target.value)}
            />
            <button type="submit" className={styles.submitBtn}>
              Register
            </button>
            <button onClick={gotoLogin} className={styles.submitButton}>
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;

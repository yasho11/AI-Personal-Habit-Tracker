import React, { useState } from "react";
import axiosInstance from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css"; // Import the CSS module

function Login() {
  const [UserEmail, setUserEmail] = useState<string>('');
  const [UserPassword, setUserPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/login", {
        UserEmail,
        UserPassword
      });
      if (response.data.token) {
        localStorage.setItem('jwt', response.data.token);
      } else {
        console.log('Login Failed');
      }
      console.log(response.data);

      navigate("/profile");
    } catch (error: any) {
      console.error(error.response?.data || "Something went wrong");
    }
  };
  const gotoRegister =  ()=>{
    navigate('/register')
  }
  return (
    <>
      <div className={styles.maincontainer}>
        <div className={styles.card}>
          <h2 className={styles.title}>Login</h2>
          <form onSubmit={handleSubmit}>
            <label className={styles.labelForm}>Email:</label>
            <input
              type="email"
              value={UserEmail}
              className={styles.inputfield}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
            <label className={styles.labelForm}>Password:</label>
            <input
              type="password"
              value={UserPassword}
              className={styles.inputfield}
              onChange={(e) => setUserPassword(e.target.value)}
              required
            />
            <button type="submit" className={styles.submitButton}>Log In</button>
            <button onClick={gotoRegister} className={styles.submitButton}>Register</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;

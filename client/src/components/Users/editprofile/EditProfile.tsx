import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import styles from "./EditProfile.module.css"; // ✅ Import CSS Module

function EditProfile() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState<string>("");
    const [profileImg, setProfileImg] = useState<string>("");
    const [profileFile, setProfileFile] = useState<File | null>(null);
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [passwordVerified, setPasswordVerified] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showDelete, setShowDelete] = useState<boolean>(false);
    const [deletePassword, setDeletePassword] = useState<string>("");

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            navigate("/login");
        } else {
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            fetchUserData();
        }
    }, [navigate]);

    const fetchUserData = async () => {
        try {
            const response = await axiosInstance.get("/getUser");
            setUserName(response.data.user.UserName || "");
            setProfileImg(`http://localhost:5000${response.data.user.ProfileUrl}`);
        } catch (err) {
            console.error("Failed to fetch user:", err);
            setError("Failed to load user data. Please try again later.");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfileFile(e.target.files[0]);
        }
    };

    const verifyOldPassword = async () => {
        try {
            const response = await axiosInstance.post("/verify-password", {
                password: oldPassword
            });

            if (response.data.success) {
                setPasswordVerified(true);
                setError(null);
            } else {
                setError("Incorrect old password.");
            }
        } catch (err) {
            console.error("Error verifying password:", err);
            setError("Failed to verify password. Try again.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("UpUserName", userName);
        formData.append("UpUserPassword", newPassword);
        
        if (profileFile) {
            formData.append("ProfilePicture", profileFile);
        }
    
        const token = localStorage.getItem("jwt");
    
        try {
            const response = await axiosInstance.patch("/UpdateUser", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Profile updated:", response.data);
            fetchUserData(); 
        } catch (error: any) {
            console.error("Error updating profile:", error);
            if (error.response) {
                console.error("Server Response:", error.response.data);
            }
            setError("Error updating profile. Please try again.");
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const response = await axiosInstance.post("/delete-account", {
                password: deletePassword
            });

            if (response.data.success) {
                localStorage.removeItem("jwt");
                navigate("/login");
            } else {
                setError("Incorrect password. Account not deleted.");
            }
        } catch (err) {
            console.error("Error deleting account:", err);
            setError("Failed to delete account. Try again.");
        }
    };

    return (
        <div className={styles.mainStyles}>
            {error && <p className={styles.error}>{error}</p>}

            <form className={styles.formStyle} onSubmit={handleSubmit}>
                <div className={styles.imageSection}>
                    {profileImg && <img src={profileImg} alt="Profile" className={styles.profileImage} />}
                    <label className={styles.labelForm}>Profile Picture</label>
                    <input type="file" onChange={handleFileChange} />
                </div>

                <label className={styles.labelForm}>User Name:</label>
                <input 
                    type="text"
                    value={userName}
                    className={styles.inputField}
                    onChange={(e) => setUserName(e.target.value)}
                />

                {!passwordVerified ? (
                    <>
                        <label className={styles.labelForm}>Old Password:</label>
                        <input
                            type="password"
                            className={styles.inputField}
                            placeholder="Enter old password"
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <button type="button" className={styles.verifyBtn} onClick={verifyOldPassword}>
                            Verify Password
                        </button>
                    </>
                ) : (
                    <>
                        <label className={styles.labelForm}>New Password:</label>
                        <input
                            type="password"
                            className={styles.inputField}
                            placeholder="Enter new password"
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </>
                )}

                <button type="submit" className={styles.submitBtn}>Save Changes</button>
                <button 
                    type="button" 
                    className={styles.cancelBtn} 
                    onClick={() => navigate("/profile")}
                >
                    Cancel
                </button>
            </form>

            <div className={styles.deleteSection}>
                <button 
                    className={styles.deleteBtn} 
                    onClick={() => setShowDelete(true)}
                >
                    Delete Account
                </button>

                {showDelete && (
                    <>
                        <label className={styles.labelForm}>Enter Password to Delete:</label>
                        <input
                            type="password"
                            className={styles.inputField}
                            placeholder="Enter password"
                            onChange={(e) => setDeletePassword(e.target.value)}
                        />
                        <button className={styles.confirmDeleteBtn} onClick={handleDeleteAccount}>
                            Confirm Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default EditProfile;

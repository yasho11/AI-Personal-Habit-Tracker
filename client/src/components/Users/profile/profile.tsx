import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import Logout from "../logout/logout";
import styles from "./Profile.module.css"; // ✅ Import CSS Module

function Profile() {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const [points, setPoints] = useState<number>(0);
    const [profileImg, setProfileImg] = useState<string>("");

    // Fetch user data on component mount
    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            navigate("/login");
        } else {
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            fetchUserData();
        }
    }, [navigate]);

    // Fetch user data
    const fetchUserData = async () => {
        try {
            const response = await axiosInstance.get("/getUser");
            setUserEmail(response.data.user.UserEmail || "");
            setUserName(response.data.user.UserName || "");
            setPoints(response.data.user.Points || 0);
            setProfileImg(`http://localhost:5000${response.data.user.ProfileUrl}`);
        } catch (err) {
            console.error("Failed to fetch user:", err);
        }
    };

    return (
        <div className={styles.mainStyles}>
            <div className={styles.profileContainer}>
                {profileImg && <img src={profileImg} alt="Profile" className={styles.profileImage} />}
                <h2 className={styles.userName}>{userName}</h2>
                <p className={styles.userInfo}><strong>Email:</strong> {userEmail}</p>
                <p className={styles.userInfo}><strong>Points:</strong> {points}</p>

                <button 
                    className={styles.editBtn}
                    onClick={() => navigate("/edit-profile")}
                >
                    Edit Profile
                </button>
                <Logout/>
            </div>
        </div>
    );
}

export default Profile;

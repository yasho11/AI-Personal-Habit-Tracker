import Logout from "../logout/logout";
import styles from "./navbar.module.css";

function NavBar() {
    return (
        <div className={styles.navbar}>
            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <a href="/viewHabit">Home</a>
                </li>
                <li className={styles.navItem}>
                    <a href="/addHabit">Add Habit</a>
                </li>
                <li className={styles.navItem}>
                    <a href="/profile">Profile</a>
                </li>
            </ul>
            <div className={styles.logout}>
                <Logout />
            </div>
        </div>
    );
}

export default NavBar;

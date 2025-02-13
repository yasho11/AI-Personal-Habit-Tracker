import { useNavigate } from "react-router-dom";


function logout(){
    const navigate = useNavigate();
    const handleLogout = () =>{
        localStorage.removeItem("jwt");
        const token = localStorage.getItem("jwt");
        if(!token){
            navigate("/login");
        }else{
            navigate("/login")
        }
    }

    return(<>
    
    <button onClick={handleLogout}>Log out</button>
    </>)


}

export default logout;

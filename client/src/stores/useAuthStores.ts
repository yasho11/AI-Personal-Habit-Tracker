// src/store/useAuthStore.ts
import {create}from "zustand";
import {axiosInstance} from "../libs/axios";
import {toast} from "react-hot-toast";
import axios from "axios";



interface AuthStore {
    authUser: any; 
    isCheckingAuth: boolean;
    isSigningUp: boolean;
    isSigningOut: boolean;
    isSigningIn: boolean;
    isUpdatingProfile: boolean;
    checkAuth: () => void;
    signin: (data: any) => void; 
    signup: (data: any) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  isCheckingAuth: false,
  isSigningIn: false,
  isSigningOut: false,
  isSigningUp: false,
  isUpdatingProfile: false,

  //?-----------------------------------------------------
    //! name: checkAuth
    //! description: Check if the user is authenticated

    checkAuth: async()=>{
        try{
            const response = await axiosInstance.get("/api/check");
            set({authUser: response.data});
            console.log("Auth user: " , response.data);
        }
        catch(error){
            console.log("Error in checkAuth: ", error);
            set({authUser: null})
        }finally{
            set({isCheckingAuth: false});
        }
    },



    //?-------------------------------------------------------------------------
    //!@name: signup
    //!@desc: This is used to create a new accoount
    signup: async(data) => {
        try{
            set({isSigningUp: true})
            const response = await axiosInstance.post("/api/signup", data);

            set({authUser: response.data});
            toast.success("Account created successfully!");


        }catch(error){
            if(axios.isAxiosError(error)){
                console.error("Signup error: " , error.response?.data);
                toast.error(error.response?.data?.message || "Signup failed!!");
            }else{
                console.error("Unexpected error: ", error);
                toast.error("Something went wrong");
            }

        }finally{
            set({isSigningUp: false})
        }

    },


    //?----------------------------------------------------------------
    //! @name: sign in
    //! @desc: Used to sign in users
    signin: async (data) => {
        try {
            set({isSigningIn: true});
            const response = await axiosInstance.post("/api/signin", data);
            set({authUser: response.data});
            const {authUser} = get();
            console.log("User signed in : " , authUser);
            toast.success("Sign in successful");

        } catch (error) {
            if(axios.isAxiosError(error)){
                console.error("Sign In error: ", error.response?.data);
                toast.error(error.response?.data?.message || "Sign In error")

            }else{
                console.error("Unexpected error: " , error);
                toast.error("Something went wrong");
            }
        } finally{
            set({isSigningIn: false});
        }
    },

    //?--------------------------------------------------------------------------

    //! @name: signout
    //! @desc: Used to sign out user

    logout: async()=>{
        try{
            set({isSigningOut: true});
            await axiosInstance.post("/api/signout");
            set({authUser: null});
            toast.success("Signed Out Successfully!");
        }catch(error){
            console.error("signout error: " , error);
            toast.error("Signout failed!!");

        }finally{
            set({isSigningOut: false});
        }

    },

    //?----------------------------------------------------------------------



}));

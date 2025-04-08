import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStores";
import { Camera, Mail, User } from "lucide-react";


function ProfilePage(){
    const {authUser, isUpdatingProfile, updateProfile} = useAuthStore();
    const [selectedImg, setSelectedImg] = useState<string | ArrayBuffer | null>(null);

    const handleImageUpload = async (e:React.FormEvent) =>{
        const file = (e.target as HTMLInputElement).files?.[0];
        if(!file) return;

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = async()=>{
            const base64Image = reader.result;
            setSelectedImg(base64Image);
            await updateProfile({profileUrl : base64Image})
        }
    };

    return(
        <div className="h-screen pt-20">
            <div className="max-w-2xl mx-auto p-4 py-8">
                <div className="bg-base-300 rounded-xl p-6 space-y-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold"> Profile</h1>
                        <p className="mt-2"> Your Profile Information </p>
                    </div>

                    {/* avatar upload section */}


                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <img src={selectedImg || authUser.user.profileUrl ||  "/avatar.png"} alt="Profile" className="size-32 rounded-full object-cover border-4" />

                            <label htmlFor="avatar-upload" className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""} `}>
                                <Camera className="w-5 h-5 text-base-200"/>

                                <input type="file" id="avatar-upload" className = "hidden" accept="image/" onChange={handleImageUpload} disabled={isUpdatingProfile}/>
                            </label>

                        </div>
                        <p className="text-sm text-zinc-400">
                            {isUpdatingProfile ? "Uploading...":"Click the camera icon to update your profile"}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-400 flex items-center gap-2" >
                                <User className="w-4 h-4"/>
                                Full Name
                            </div>

                            

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



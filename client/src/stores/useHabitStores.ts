import { create } from "zustand";
import {toast} from "react-hot-toast";
import { axiosInstance } from "../libs/axios";
import { HabitType } from "../libs/types";

interface HabitStore {
    Recommendation: string;
    Habit: any;
    Habits: any,
    isUpdatingStreak: boolean;
    isFetchingHabit: boolean;
    isAddingHabit: boolean;
    isEditingHabit: boolean;
    isDeletingHabit: boolean;
    isAddingStreak: boolean;
    isFetchingRecommendation: boolean;
    fetchHabit: (id: string) => Promise<HabitType | null>;
    fetchAllHabit: () => void;
    createHabit: (data: any)=> void;
    editHabit:(data: any, id: string) => Promise<void>;
    deleteHabit: (id: string) => void;
    updateStreak:(id:string, Status: string) => void;
    search:(searchTerm: string) => void;
    recommend: ( id:string) => void;
}


export const useHabitStores = create<HabitStore>((set, get)=>({
    Recommendation: "",
    Habit: null,
    Habits: [],
    isUpdatingStreak: false,
    isFetchingHabit: false,
    isAddingHabit: false,
    isDeletingHabit: false,
    isEditingHabit: false,
    isAddingStreak: false,
    isFetchingRecommendation: false,

    //?---------------------------------------------

    //! @name: fetchHabit
    //! @desc: used to fetch a single habit
    fetchHabit: async (id: string): Promise<HabitType | null> => {
      try {
        set({ isFetchingHabit: true });
        const response = await axiosInstance.get(`/api/getHabit/${id}`);
        const habit: HabitType = response.data.habit;
        set({ Habit: habit });
        console.log("Habit from fetch habiit:", habit);
        return habit;
      } catch (error) {
        console.error("Error in fetchHabit:", error);
        set({ Habit: null });
        return null;
      } finally {
        set({ isFetchingHabit: false });
      }
    },
  
    
    //?------------------------------------------------------------

    //! @name: fetchAllHabit
    //! @desc: used to fetch all the habit of one user

    fetchAllHabit: async () => {
        try {
          set({ isFetchingHabit: true });
          const response = await axiosInstance.get(`/api/viewHabit`);
          set({ Habits: response.data.Habits || [] }); // Handle shape of response properly
          console.log("Habits from fetch all:", response.data.Habits);
        } catch (error) {
          console.error("Error in fetchAllHabit:", error);
          set({ Habits: [] });
        } finally {
          set({ isFetchingHabit: false });
        }
      },

    //?-----------------------------------------------------------------------

    //! @name: createHabit
   //! @desc: creating a new habit

   createHabit: async(data) =>{

    try {
        set({isAddingHabit: true});
        const response = await axiosInstance.post("/api/create", data);

        set({Habit: response.data});
        toast.success("Habit created");
    } catch (error) {

       console.error("Error in createHabit: ", error );
       toast.error("Error creating habit")
        set({Habit: null});
    }finally{
        set({isAddingHabit: false});

    }


   },

   //?------------------------------------------------------------------------

   //! @name: editHabit
   //! @desc: edit a habit

   editHabit: async(data, id)=>{
        try {
            set({isEditingHabit: true});
            const response = await axiosInstance.put(`/api/edit/${id}`, data)
            
            set({Habit: response.data});
            toast.success("Habit Updated");
            console.log("Frin Edit Habit",response.data)

        } catch (error) {
            
            console.error("Error in editHabit: ", error);
            toast.error("Error Updating Habit");
            
        }finally{
            set({isEditingHabit: false});
        }
   },

   //?--------------------------------------------------------------------------------

   //! @name: deleteHabit
   //! @desc: Delete a habit

   deleteHabit: async(id)=>{
        try{
            set({isDeletingHabit: true});
            const response = await axiosInstance.delete(`/api/delete/${id}`);
            
            toast.success ("Habit deleted");
        }catch(error){

            console.error("Error in deleteHabit: ", error);
            toast.error("Error Updating Habit");
        }finally{
            set({isDeletingHabit: false});
        }
   },

   //?-----------------------------------------------------------------------------------

   //! @name: updateStreak
   //! @desc: used to update streak


   updateStreak: async(id, Status)=>{
    try {
        set({isUpdatingStreak: true});

        const response = await axiosInstance.put(`/api/upStreak/${id}`, {Status});
        console.log("Update Streak: ", response.data);
        toast.success("Streak Updated");


    } catch (error) {
        console.error("Error in updateStreak: ", error);
        toast.error("Error Updating in streak");
        
    }finally{
        set({isUpdatingStreak: false});
    }

},

   //?---------------------------------------------------------------------------------------

   //! @name: searchTerm
   //! @desc: used to search terms

   search: async (searchTerm) => {
    try {
      set({ isFetchingHabit: true });
  
      // Pass searchTerm as query parameter
      const response = await axiosInstance.get(`/api/search?searchTerm=${searchTerm}`);
  
      // If response contains habits, store them in the state
      set({ Habits: response.data.habits || [] });
      console.log("Searched habits:", response.data);
  
    } catch (error) {
      console.error("Error in search:", error);
      toast.error("Failed to search");
    } finally {
      set({ isFetchingHabit: false });
    }
  },
  


  //?----------------------------------------------------------------------------------------

  //! @name: Recommend
  //! @desc: used to get the recommendation for specific habits using AI

  recommend: async (id) =>{
    try{
      set({isFetchingRecommendation: true});
            
      
      const response = await axiosInstance.get(`/api/recommend/${id}`);

      set({Recommendation: response.data.recommendation})
      console.log(`Recommendation for the habit is: ${response.data}`);
      toast.success("Recommendation Provided Successfully");

    }catch(error){
      console.error("Error in recommend:", error);
      toast.error("Failed to generate recommendation");
    }finally{
      set({isFetchingRecommendation: false});
    }
  },


}))
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Category Store
const useCategoryStore = create((set) => ({
  CategoryData: [],
  setCategoryData: (newData) => set({ CategoryData: newData }),
  addCategory: (item) =>
    set((state) => ({ CategoryData: [...state.CategoryData, item] })),
  removeCategory: (item) =>
    set((state) => ({
      CategoryData: state.CategoryData.filter(
        (category) => category.category_id !== item.category_id
      ),
    })),

  Get_Categories: async () => {
    try {
      const response = await fetch(process.env.SERVER_URL + "/Category/All");
      const data = await response.json();

      if (data.status === 200) {
        set({ CategoryData: data.data });
      } else {
        console.log("Failed to fetch categories");
      }
    } catch (error) {
      console.log("An error occurred while fetching categories");
    }
  },
}));

const useRecipes = create((set, get) => ({
  Recipes: [], // Initial empty state

  setRecipes: (newData) => set({ Recipes: newData }),

  SeparateDatabyId: (id) => {
    const data = get().Recipes; // Get current state
    return data.filter((item) => item.recipe_id === id);
  },

  SeparateDataByCategory: (category) => {
    const data = get().Recipes; // Get current state
    return data.filter((item) => item.category === category);
  },
  Get_Recipes: async () => {
    try {
      const response = await fetch(`${process.env.SERVER_URL}/Recipe/All`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      set({ Recipes: data.data });
    } catch (error) {
      console.error("Failed to fetch recipe data:", error);
    }
  },
}));

// Favorite Store
const useFavoriteStore = create((set) => ({
  Favorite: [],
  setFavorite: (newData) => set({ Favorite: newData }),
  addFavorite: (item) =>
    set((state) => {
      // Ensure item is valid and not already in favorites
      if (
        item &&
        item.recipe_id &&
        !state.Favorite.find((fav) => fav.recipe_id === item.recipe_id)
      ) {
        return { Favorite: [...state.Favorite, item] };
      }
      // Return the state as is if the item is invalid or already exists
      return { Favorite: state.Favorite };
    }),

  removeFavorite: (item) =>
    set((state) => ({
      // Filter out the item with the specified recipe_id
      Favorite: state.Favorite.filter(
        (fav) => fav.recipe_id !== item.recipe_id
      ),
    })),
  Get_Fav_Data: async (user_id) => {
    try {
      const res = await fetch(`${process.env.SERVER_URL}/Favourites/All`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id }),
      });

      const data = await res.json();

      if (data && data.data) {
        set(() => ({
          Favorite: data.data,
        }));
      } else {
        console.log("No favorites found");
      }
    } catch (error) {
      console.error("Error finding favorites:", error);
    }
  },
  // Add a favorite recipe
  Add_Fav_Function: async (userId, recipeId) => {
    try {
      const response = await fetch(`${process.env.SERVER_URL}/Favourites/Add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, recipe_id: recipeId }),
      });
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  },

  // Remove a favorite recipe
  Remove_Fav_Function: async (userId, recipeId) => {
    try {
      const response = await fetch(
        `${process.env.SERVER_URL}/Favourites/Remove`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId, recipe_id: recipeId }),
        }
      );
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  },
}));

// Switches Store
const useSwitchStore = create((set) => ({
  switches: { Easy: true, Medium: true, Difficult: true },

  toggleSwitch: (key) =>
    set((state) => ({
      switches: {
        ...state.switches,
        [key]: !state.switches[key], // Toggle the specific switch
      },
    })),

  // For Admin (not declared yet)
  setSwitch: (key, value) =>
    set((state) => ({
      switches: {
        ...state.switches,
        [key]: value, // Set a specific switch to a given value
      },
    })),

  resetSwitches: () =>
    set(() => ({
      switches: { Easy: true, Medium: true, Difficult: true }, // Reset to default state
    })),
}));

// User and Admin store
const useUserInfoStore = create((set) => ({
  User: "",
  IsUser: false,
  UserId: "",
  IsAdmin: false,
  setIsUser: (value) => set({ IsUser: value }),
  setIsAdmin: (value) => set({ IsAdmin: value }),
  setUser: (value) => set({ User: value }),
  setUserId: (value) => set({ UserId: value }),
  initializeUserInfo: async () => {
    const userJson = await AsyncStorage.getItem("user"); // Get the stored user data
    const user = userJson ? JSON.parse(userJson) : ''; // Parse it if it exists

    set({
      User: user,
      IsUser: user ? true : false,
      UserId: user ? user.uid : "",
      IsAdmin: user ? user.uid === "zZWsKq1WnVdS9qz8tHBnRc1uLM12" : false,
    });
  },
}));

const useUserRecipesStore = create((set) => ({
  UserRecipes: [],
  setUserRecipes: (newData) => set({ UserRecipes: newData }),

  AddtoUserRecipes: (item) =>
    set((state) => ({ UserRecipes: [...state.UserRecipes, item] })),

  RemovefromUserRecipes: (item) =>
    set((state) => ({
      UserRecipes: state.UserRecipes.filter(
        (recipe) => recipe.recipe_id !== item.recipe_id
      ),
    })),

  FetchUserRecipes: async (UserId) => {
    try {
      const response = await fetch(
        `${process.env.SERVER_URL}/Recipe/User_Recipes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: UserId }),
        }
      );

      const data = await response.json();
      if (data && data.data) {
        set(() => ({ UserRecipes: data.data }));
      } else {
        console.error("No data found");
      }
    } catch (error) {
      console.error("Failed to fetch user recipes", error);
    }
  },
}));

export {
  useCategoryStore,
  useRecipes,
  useFavoriteStore,
  useSwitchStore,
  useUserInfoStore,
  useUserRecipesStore,
};

import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { imageUpload } from "../../../utils";
import { TbFidgetSpinner } from "react-icons/tb";
import Container from "../../components/Shared/Container";

const AddFoodForm = () => {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { mutateAsync: addMeal, isPending } = useMutation({
    mutationFn: async (mealData) => {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/add-meal`,
        mealData
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Meal added successfully!");
      reset();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to add meal");
    },
  });

  const onSubmit = async (data) => {
    const {
      foodName,
      price,
      ingredients,
      estimatedDeliveryTime,
      chefExperience,
      chefId,
      foodImageFile,
    } = data;

    if (!foodImageFile || !foodImageFile[0]) {
      toast.error("Please upload a food image",);
      return;
    }

    let foodImage;
    try {
      foodImage = await imageUpload(foodImageFile[0]);
    } catch (err) {
      toast.error("Image upload failed",err.message);
      return;
    }

    const newMeal = {
      foodName: foodName.trim(),
      chefName: user?.displayName || "Unknown Chef",
      foodImage,
      price: Number(price),
      rating: 0,
      ingredients: ingredients
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== ""),
      estimatedDeliveryTime: estimatedDeliveryTime.trim(),
      chefExperience: chefExperience.trim(),
      chefId: chefId.trim(),
      userEmail: user?.email,
      createdAt: new Date().toISOString(),
    };

    await addMeal(newMeal);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16">
      {/* Green Circle Decorations */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-lime-500 rounded-full opacity-20 blur-3xl -z-10"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-lime-400 rounded-full opacity-30 blur-3xl -z-10"></div>

      <Container>
        <h1 className="text-4xl lg:text-5xl font-bold text-center mb-12">
          Add New Meal
        </h1>

        <div className="max-w-5xl mx-auto bg-slate-800/70 rounded-3xl shadow-2xl p-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Food Name */}
            <div className="space-y-3">
              <label className="block text-xl font-medium">
                Food Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Spicy Chicken Biriyani"
                className="w-full px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-lime-500 transition"
                {...register("foodName", { required: "Food name is required" })}
              />
              {errors.foodName && <p className="text-red-400 text-sm">{errors.foodName.message}</p>}
            </div>

            {/* Price */}
            <div className="space-y-3">
              <label className="block text-xl font-medium">
                Price (USD) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="15.99"
                className="w-full px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-lime-500"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0.01, message: "Price must be greater than 0" },
                })}
              />
              {errors.price && <p className="text-red-400 text-sm">{errors.price.message}</p>}
            </div>

            {/* Ingredients */}
            <div className="space-y-3 md:col-span-2">
              <label className="block text-xl font-medium">
                Ingredients (comma separated) <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Chicken, Rice, Onion, Spices, Yogurt, Ghee"
                className="w-full px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-lime-500"
                {...register("ingredients", { required: "Ingredients are required" })}
              />
              {errors.ingredients && <p className="text-red-400 text-sm">{errors.ingredients.message}</p>}
            </div>

            {/* Estimated Delivery Time */}
            <div className="space-y-3">
              <label className="block text-xl font-medium">
                Estimated Delivery Time <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="45 minutes"
                className="w-full px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-lime-500"
                {...register("estimatedDeliveryTime", { required: "Required" })}
              />
            </div>

            {/* Chef Experience */}
            <div className="space-y-3">
              <label className="block text-xl font-medium">
                Chef Experience <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="10 years specializing in South Asian cuisine"
                className="w-full px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-lime-500"
                {...register("chefExperience", { required: "Required" })}
              />
            </div>

            {/* Chef ID */}
            <div className="space-y-3">
              <label className="block text-xl font-medium">
                Chef ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="chef_123456"
                className="w-full px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-lime-500"
                {...register("chefId", { required: "Chef ID is required" })}
              />
              {errors.chefId && <p className="text-red-400 text-sm">{errors.chefId.message}</p>}
            </div>

            {/* Food Image Upload */}
            <div className="space-y-3 md:col-span-2">
              <label className="block text-xl font-medium">
                Food Image <span className="text-red-400">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full file:mr-6 file:py-4 file:px-8 file:rounded-xl file:border-0 file:bg-lime-500/20 file:text-lime-400 hover:file:bg-lime-500/30 file:cursor-pointer"
                {...register("foodImageFile", { required: "Food image is required" })}
              />
              {errors.foodImageFile && <p className="text-red-400 text-sm">{errors.foodImageFile.message}</p>}
              <p className="text-sm text-gray-400 mt-2">High-quality image recommended</p>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 text-center">
              <button
                type="submit"
                disabled={isPending}
                className="px-16 py-6 bg-lime-500 text-black font-bold text-2xl rounded-xl hover:bg-lime-400 transition shadow-xl disabled:opacity-70"
              >
                {isPending ? (
                  <span className="flex items-center gap-3">
                    <TbFidgetSpinner className="animate-spin" />
                    Adding Meal...
                  </span>
                ) : (
                  "Add Meal"
                )}
              </button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default AddFoodForm;
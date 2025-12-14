import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { imageUpload } from "../../../utils"; // আপনার Cloudinary/ImgBB upload ফাংশন
import { TbFidgetSpinner } from "react-icons/tb";
import Container from "../../components/Shared/Container";
import Heading from "../../components/Shared/Heading";

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
        mealData,
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`, // যদি JWT থাকে (Firebase ID token)
          },
        }
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

    // Image Upload (বাধ্যতামূলক)
    if (!foodImageFile || !foodImageFile[0]) {
      toast.error("Please upload a food image");
      return;
    }

    let foodImage;
    try {
      foodImage = await imageUpload(foodImageFile[0]);
    } catch (err) {
      toast.error("Image upload failed");
      return;
    }

    const newMeal = {
      foodName: foodName.trim(),
      chefName: user?.displayName || "Unknown Chef",
      foodImage,
      price: Number(price),
      rating: 0, // default
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
    <Container>
      <div className="max-w-4xl mx-auto py-12">
        <Heading title="Add New Meal" subtitle="Fill all the details to create a new meal" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-10 bg-white rounded-2xl shadow-xl border border-gray-200 p-8 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Food Name */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">
              Food Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Chicken Biriyani"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              {...register("foodName", { required: "Food name is required" })}
            />
            {errors.foodName && <p className="text-red-500 text-sm">{errors.foodName.message}</p>}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">
              Price (USD) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="12.99"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              {...register("price", { required: "Price is required", min: { value: 0.01, message: "Price must be greater than 0" } })}
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>

          {/* Ingredients */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-gray-700 font-medium">
              Ingredients (comma separated) <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Chicken, Rice, Onion, Spices, Yogurt"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              {...register("ingredients", { required: "Ingredients are required" })}
            />
            {errors.ingredients && <p className="text-red-500 text-sm">{errors.ingredients.message}</p>}
          </div>

          {/* Estimated Delivery Time */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">
              Estimated Delivery Time <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="30 minutes"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              {...register("estimatedDeliveryTime", { required: "Delivery time is required" })}
            />
            {errors.estimatedDeliveryTime && <p className="text-red-500 text-sm">This field is required</p>}
          </div>

          {/* Chef Experience */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">
              Chef Experience <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="5 years in South Asian cuisine"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              {...register("chefExperience", { required: "Chef experience is required" })}
            />
            {errors.chefExperience && <p className="text-red-500 text-sm">This field is required</p>}
          </div>

          {/* Chef ID */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">
              Chef ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="chef_123456"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              {...register("chefId", { required: "Chef ID is required" })}
            />
            {errors.chefId && <p className="text-red-500 text-sm">{errors.chefId.message}</p>}
          </div>

          {/* Food Image Upload (Mandatory) */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-gray-700 font-medium">
              Food Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              {...register("foodImageFile", { required: "Food image is required" })}
            />
            {errors.foodImageFile && <p className="text-red-500 text-sm">{errors.foodImageFile.message}</p>}
            <p className="text-sm text-gray-500 mt-2">Upload a high-quality image of the meal</p>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 text-center">
            <button
              type="submit"
              disabled={isPending}
              className="px-12 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
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
  );
};

export default AddFoodForm;
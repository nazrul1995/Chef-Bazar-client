import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import LoadingSpinner from "../Shared/LoadingSpinner";
import ErrorPage from "../../pages/ErrorPage";
import toast from "react-hot-toast";
import { imageUpload } from "../../../utils";
import { TbFidgetSpinner } from "react-icons/tb";

const AddFoodForm = () => {
  const { user } = useAuth();

  // Mutation
  const {
    isPending,
    isError,
    mutateAsync,
    reset: mutationReset,
  } = useMutation({
    mutationFn: async (payload) =>
      await axios.post(`${import.meta.env.VITE_API_URL}/add-meal`, payload),

    onSuccess: () => {
      toast.success("Food added successfully");
      mutationReset();
    },
  });

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    //reset,
  } = useForm();

  const onSubmit = async (data) => {
    const {
      foodName,
      chefName,
      price,
      ingredients,
      estimatedDeliveryTime,
      chefExperience,
      chefId,
      foodImageFile,
      foodImageUrl,
    } = data;

    let finalImage = foodImageUrl; // if user directly enters URL

    // If file uploaded → upload and replace
    if (foodImageFile?.[0]) {
      finalImage = await imageUpload(foodImageFile[0]);
    }

    const newFood = {
      foodName,
      chefName,
      foodImage: finalImage,
      price: Number(price),
      rating: 0, // default
      ingredients: ingredients.split(",").map((i) => i.trim()),
      estimatedDeliveryTime,
      chefExperience,
      chefId,
      userEmail: user?.email,
      createdAt: new Date().toISOString(),
    };

    await mutateAsync(newFood);
    //reset();
  };

  if (isPending) return <LoadingSpinner />;
  if (isError) return <ErrorPage />;

  return (
    <div className="w-full min-h-[calc(100vh-40px)] flex justify-center items-center bg-gray-50 text-gray-800">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Food Name */}
        <div className="space-y-2">
          <label>Food Name</label>
          <input
            className="w-full border px-3 py-2 rounded"
            {...register("foodName", { required: "Food name is required" })}
            placeholder="Grilled Chicken Salad"
          />
          {errors.foodName && <p className="text-red-500 text-xs">{errors.foodName.message}</p>}
        </div>

        {/* Chef Name */}
        <div className="space-y-2">
          <label>Chef Name</label>
          <input
            defaultValue={user?.displayName}
            className="w-full border px-3 py-2 rounded"
            {...register("chefName", { required: "Chef name is required" })}
          />
          {errors.chefName && <p className="text-red-500 text-xs">{errors.chefName.message}</p>}
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label>Price</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            {...register("price", { required: "Price is required" })}
          />
          {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
        </div>

        {/* Ingredients */}
        <div className="space-y-2">
          <label>Ingredients (comma separated)</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            {...register("ingredients", { required: "Ingredients are required" })}
            placeholder="Chicken, Lettuce, Tomatoes"
          ></textarea>
          {errors.ingredients && <p className="text-red-500 text-xs">{errors.ingredients.message}</p>}
        </div>

        {/* Estimated Delivery Time */}
        <div className="space-y-2">
          <label>Estimated Delivery Time</label>
          <input
            className="w-full border px-3 py-2 rounded"
            {...register("estimatedDeliveryTime", { required: true })}
            placeholder="30 minutes"
          />
        </div>

        {/* Chef Experience */}
        <div className="space-y-2">
          <label>Chef Experience</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            {...register("chefExperience", { required: true })}
            placeholder="5 years of experience..."
          ></textarea>
        </div>

        {/* Chef ID */}
        <div className="space-y-2">
          <label>Chef ID</label>
          <input
            className="w-full border px-3 py-2 rounded"
            {...register("chefId", { required: true })}
            placeholder="chef_123456"
          />
        </div>

        {/* Image Upload OR URL */}
        <div className="space-y-4 col-span-1 lg:col-span-2">

          <label>Food Image</label>

          {/* Image URL */}
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="https://example.com/image.jpg"
            {...register("foodImageUrl")}
          />

          <p className="text-center">OR</p>

          {/* File Upload */}
          <input
            type="file"
            accept="image/*"
            {...register("foodImageFile")}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-3 bg-lime-500 text-white rounded shadow-md"
        >
          {isPending ? <TbFidgetSpinner className="animate-spin m-auto" /> : "Save Food"}
        </button>
      </form>
    </div>
  );
};

export default AddFoodForm;

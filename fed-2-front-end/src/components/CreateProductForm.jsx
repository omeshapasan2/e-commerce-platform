import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useCreateProductMutation } from "../lib/api";
import ImageInput from "./ImageInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { toast } from "react-toastify";

const createProductFormSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  colorId: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().url("Image URL is invalid").min(1, "Image is required"),
  stock: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number({ required_error: "Stock is required" })
      .int("Stock must be an integer")
      .positive("Stock must be greater than 0")
  ),
  price: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number({ required_error: "Price is required" })
      .positive("Price must be greater than 0")
  ),
});

function CreateProductForm({ categories, colors }) {
  const form = useForm({
    resolver: zodResolver(createProductFormSchema),
    defaultValues: {
      categoryId: "",
      colorId: "",
      name: "",
      description: "",
      image: "",
      stock: "",
      price: "",
    },
    mode: "onBlur",
  });

  const [createProduct, { isLoading }] = useCreateProductMutation();

  const onSubmit = async (values) => {
    try {
      await createProduct(values).unwrap();
      toast.success("Product created successfully");
      form.reset({
        categoryId: "",
        colorId: "",
        name: "",
        description: "",
        image: "",
        stock: "",
        price: "",
      });
      console.log(values);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create product");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Information</h3>
        <p className="text-gray-600 text-sm">Fill in the details below to create a new product.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Category, Color and Name Row */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Category Selection */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Category *</FormLabel>
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Color Selection */}
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Color</FormLabel>
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors?.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />


            {/* Product Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Product Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Premium Denim Jacket" 
                      className="w-full"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Description *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your product features, materials, and benefits..." 
                    className="min-h-[100px] resize-none"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Product Image *</FormLabel>
                <FormControl>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
                    <ImageInput onChange={field.onChange} value={field.value} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stock and Price Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Stock Quantity *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 100"
                      className="w-full"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Price (USD) *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-8 w-full"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button 
                type="button" 
                variant="outline" 
                className="sm:w-auto w-full"
                onClick={() => form.reset()}
              >
                Reset Form
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="sm:w-auto w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Spinner variant="ellipsis" size={16} />
                    <span>Creating Product...</span>
                  </div>
                ) : (
                  "Create Product"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default CreateProductForm;
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

const createProductFormSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
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

function CreateProductForm({ categories }) {
  const form = useForm({
    resolver: zodResolver(createProductFormSchema),
    defaultValues: {
      categoryId: "",
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
      form.reset({
        categoryId: "",
        name: "",
        description: "",
        image: "",
        stock: "",
        price: "",
      });
      console.log(values);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 mt-4 w-1/4"
      >
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select  value={field.value ?? ""} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className={"w-full"}>
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Denim" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Write a description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <ImageInput onChange={field.onChange} value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter stock qunatity"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="This is the product price"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Button type="submit">Create Product</Button>
        </div>
      </form>
    </Form>
  );
}

export default CreateProductForm;

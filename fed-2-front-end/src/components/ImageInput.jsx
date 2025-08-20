import { useState } from "react";
import { Input } from "./ui/input";
import { putImage } from "../lib/product";

function ImageInput({ onChange, value }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    try {
      if (!e.target.files?.length) return;
        
      const file = e.target.files[0];

      setIsUploading(true);

      const publicUrl = await putImage({ file }); //! File will be uploaded to a bucket and the url will be returned
      //   const url = "https://via.placeholder.com/150";

      console.log(publicUrl);
      onChange(publicUrl);
    } catch (error) {
      console.error(error);
      onChange("");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Input type="file" onChange={handleFileChange} />
    </div>
  );
}

export default ImageInput;

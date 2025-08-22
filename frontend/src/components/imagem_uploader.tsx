import { useState, useEffect } from "react";

import Perfil from "../../public/images/perfil.png";
import Upload from "../../public/icons/upload.png";

interface ImageUploaderProps {
  imagemContato: string;
  onChange?: (novaImagem: string) => void;
}

export default function ImageUploader({
  imagemContato,
  onChange,
}: ImageUploaderProps) {
  const [image, setImage] = useState<string>(Perfil);

  useEffect(() => {
    if (imagemContato) {
      setImage(imagemContato);
    } else {
      setImage(Perfil);
    }
  }, [imagemContato]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImage(result);
        onChange?.(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const hasImage = image !== Perfil;

  return (
    <div className="flex flex-col items-center gap-4">
      <img
        src={image}
        alt="Preview"
        className="w-[4.5rem] h-[4.5rem] rounded-[1rem] object-cover"
      />

      <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-2xl font-medium transition-colors duration-200 border border-[var(--border-primary)] bg-transparent text-[var(--primary)] hover:bg-[var(--background-tertiary)]">
        {hasImage && <img src={Upload} alt="Upload" className="w-5 h-5" />}
        {hasImage ? "Substituir" : "+ Adicionar"}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
}

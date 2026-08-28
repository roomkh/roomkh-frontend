import React, { useState } from "react";
import { Upload, X, Star } from "lucide-react";

const ImageUploader = ({ images = [], onAddImage, onDeleteImage, onSetCover }) => {
  const [imageUrlInput, setImageUrlInput] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;
    onAddImage({
      url: imageUrlInput.trim(),
      is_cover: images.length === 0,
    });
    setImageUrlInput("");
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-slate-700">Property Images</label>

      {/* URL Input Form */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="url"
          placeholder="Paste public image URL (e.g. Unsplash URL)..."
          value={imageUrlInput}
          onChange={(e) => setImageUrlInput(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="w-4 h-4" /> Add
        </button>
      </form>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {images.map((img, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-slate-50">
              <img src={img.url} alt="Property preview" className="w-full h-24 object-cover" />
              
              <div className="absolute top-1 right-1 flex gap-1">
                <button
                  type="button"
                  onClick={() => onSetCover(index)}
                  title="Set Cover Image"
                  className={`p-1 rounded-full ${
                    img.is_cover ? "bg-amber-500 text-white" : "bg-black/50 text-white hover:bg-amber-500"
                  }`}
                >
                  <Star className="w-3 h-3 fill-current" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteImage(index)}
                  className="p-1 bg-black/50 hover:bg-red-600 text-white rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {img.is_cover && (
                <span className="absolute bottom-1 left-1 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
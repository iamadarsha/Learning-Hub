"use client";
import { useState, useRef } from "react";
import { THUMBNAIL_PALETTES } from "@/lib/thumbnail";

type ThumbnailData =
  | { type: "preset"; paletteIndex: number }
  | { type: "upload"; url: string };

type Props = {
  title: string;
  onSelect: (thumbnailData: ThumbnailData) => void;
};

export function ThumbnailPicker({ title, onSelect }: Props) {
  const [selected, setSelected] = useState<number>(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedSelected, setUploadedSelected] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePaletteSelect = (index: number) => {
    setSelected(index);
    setUploadedSelected(false);
    onSelect({ type: "preset", paletteIndex: index });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedUrl(url);
    setUploadedSelected(true);
    setSelected(-1);
    onSelect({ type: "upload", url });
  };

  const handleUploadedSelect = () => {
    if (!uploadedUrl) return;
    setUploadedSelected(true);
    setSelected(-1);
    onSelect({ type: "upload", url: uploadedUrl });
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-white mb-3">
        Thumbnail
        <span className="text-xs text-white/40 ml-2 font-normal">
          Choose a style or upload your own
        </span>
      </label>

      <div className="grid grid-cols-4 gap-3">
        {THUMBNAIL_PALETTES.map((palette, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handlePaletteSelect(index)}
            className="relative rounded-[10px] overflow-hidden focus:outline-none"
            style={{
              aspectRatio: "16/9",
              border:
                selected === index
                  ? "2px solid #009BFF"
                  : "2px solid transparent",
            }}
          >
            <div
              className="w-full h-full flex items-center justify-center p-2"
              style={{ backgroundColor: palette.bg }}
            >
              <span
                className="text-center font-bold leading-tight"
                style={{
                  color: palette.text,
                  fontSize: "11px",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {title || "Resource title"}
              </span>
            </div>
            {selected === index && (
              <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#009BFF] flex items-center justify-center">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}

        {uploadedUrl && (
          <button
            type="button"
            onClick={handleUploadedSelect}
            className="relative rounded-[10px] overflow-hidden focus:outline-none"
            style={{
              aspectRatio: "16/9",
              border: uploadedSelected
                ? "2px solid #009BFF"
                : "2px solid transparent",
            }}
          >
            <img
              src={uploadedUrl}
              alt="Uploaded thumbnail"
              className="w-full h-full object-cover"
            />
            {uploadedSelected && (
              <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#009BFF] flex items-center justify-center">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="mt-3 text-sm text-[#009BFF] hover:underline flex items-center gap-1.5"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M7 1v8M3.5 4.5L7 1l3.5 3.5"
            stroke="#009BFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1 10.5V12a1 1 0 001 1h10a1 1 0 001-1v-1.5"
            stroke="#009BFF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        Upload your own thumbnail
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  );
}

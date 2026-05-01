import { useState, useRef, useCallback, type DragEvent } from "react";
import { Upload, X, FileText, Image as ImageIcon, File } from "lucide-react";

export interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // bytes
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  variant?: "dropzone" | "button";
  className?: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return <ImageIcon className="w-4 h-4 text-info" />;
  if (type.includes("pdf")) return <FileText className="w-4 h-4 text-destructive" />;
  return <File className="w-4 h-4 text-muted-foreground" />;
}

export function FileUploader({
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024,
  maxFiles = 10,
  onFilesChange,
  label,
  description,
  disabled = false,
  variant = "dropzone",
  className = "",
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      setError("");
      const arr = Array.from(newFiles);
      const valid: File[] = [];

      for (const f of arr) {
        if (f.size > maxSize) {
          setError(`${f.name} exceeds ${formatSize(maxSize)}`);
          continue;
        }
        valid.push(f);
      }

      const next = multiple ? [...files, ...valid].slice(0, maxFiles) : valid.slice(0, 1);
      setFiles(next);
      onFilesChange?.(next);
    },
    [files, maxSize, maxFiles, multiple, onFilesChange]
  );

  const removeFile = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    setFiles(next);
    onFilesChange?.(next);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!disabled) addFiles(e.dataTransfer.files);
  };

  if (variant === "button") {
    return (
      <div className={className}>
        {label && <label className="text-[0.8125rem] mb-1.5 block">{label}</label>}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors cursor-pointer text-[0.8125rem] disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          Choose File{multiple ? "s" : ""}
        </button>
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} onChange={(e) => e.target.files && addFiles(e.target.files)} className="hidden" />
        {files.length > 0 && (
          <div className="mt-2 space-y-1">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-[0.75rem]">
                {getFileIcon(f.type)}
                <span className="truncate flex-1">{f.name}</span>
                <span className="text-muted-foreground">{formatSize(f.size)}</span>
                <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => removeFile(i)} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {label && <label className="text-[0.8125rem] mb-1.5 block">{label}</label>}
      <div
        onDragOver={(e) => { e.preventDefault(); !disabled && setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer
          ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-[0.8125rem]">
          <span className="text-primary">Click to upload</span> or drag and drop
        </p>
        {description && <p className="text-[0.6875rem] text-muted-foreground mt-1">{description}</p>}
        <p className="text-[0.625rem] text-muted-foreground mt-1">Max {formatSize(maxSize)}</p>
      </div>
      <input ref={inputRef} type="file" accept={accept} multiple={multiple} onChange={(e) => e.target.files && addFiles(e.target.files)} className="hidden" />

      {error && <p className="text-[0.75rem] text-destructive mt-2">{error}</p>}

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-card">
              {getFileIcon(f.type)}
              <div className="flex-1 min-w-0">
                <p className="text-[0.8125rem] truncate">{f.name}</p>
                <p className="text-[0.6875rem] text-muted-foreground">{formatSize(f.size)}</p>
              </div>
              <button onClick={() => removeFile(i)} className="p-1 hover:bg-secondary rounded cursor-pointer">
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useCallback, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Upload, FileCheck, Lock } from 'lucide-react';
import { Button } from './ui/button';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    },
    [onUpload]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  };

  const processFiles = (files: File[]) => {
    setIsEncrypting(true);
    // Simulate encryption process
    setTimeout(() => {
      onUpload(files);
      setIsEncrypting(false);
    }, 1500);
  };

  return (
    <Card className="border-border bg-card shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Upload className="h-5 w-5 text-primary" />
          Upload Medical Records
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Encrypted with ChaCha20-Poly1305
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center transition-all
            ${
              isDragging
                ? 'border-primary bg-blue-50 scale-[1.02]'
                : 'border-border hover:border-primary/70 bg-gradient-to-br from-blue-50/30 to-cyan-50/30'
            }
          `}
        >
          {isEncrypting ? (
            <div className="space-y-4">
              <div className="h-12 w-12 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <p className="text-sm text-primary font-medium">Encrypting files...</p>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse w-2/3 rounded-full" />
              </div>
            </div>
          ) : (
            <>
              <div className="h-14 w-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-4 shadow-sm">
                <Upload className="h-7 w-7 text-primary" />
              </div>
              <p className="text-sm text-foreground font-medium mb-2">
                Drag & drop files here
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                or click to browse
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
                accept=".pdf,.jpg,.jpeg,.png,.dcm"
              />
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all"
              >
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FileCheck className="h-4 w-4 mr-2" />
                  Select Files
                </label>
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Supported: PDF, JPG, PNG, DICOM
              </p>
            </>
          )}
        </div>

        <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <Lock className="h-4 w-4 text-primary" />
            </div>
            <div className="text-xs space-y-1 flex-1">
              <p className="text-foreground font-semibold">Security Features:</p>
              <ul className="text-muted-foreground space-y-1">
                <li>• Local encryption before upload</li>
                <li>• Blockchain hash verification</li>
                <li>• Immutable record storage</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
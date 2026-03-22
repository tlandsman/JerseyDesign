"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { useSubmitter } from "@/components/submitter-provider";
import { createDesignAction } from "@/actions/design-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, Check, AlertCircle, Loader2 } from "lucide-react";

interface DesignUploadProps {
  currentCount: number;
  maxDesigns?: number;
}

export function DesignUpload({ currentCount, maxDesigns = 2 }: DesignUploadProps) {
  const { token, name, setName, isLoaded } = useSubmitter();
  const [nameInput, setNameInput] = useState(name);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Sync name input with stored name when loaded
  const handleNameBlur = () => {
    if (nameInput.trim()) {
      setName(nameInput.trim());
    }
  };

  const isAtLimit = currentCount >= maxDesigns;
  const canUpload = isLoaded && token && nameInput.trim().length > 0;

  if (!isLoaded) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Submit a Design
        </CardTitle>
        <CardDescription>
          {/* D-03: Counter display for limit */}
          You have submitted {currentCount} of {maxDesigns} designs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* D-08: Name entry on upload */}
        <div>
          <label htmlFor="submitter-name" className="block text-sm font-medium mb-1">
            Your Name
          </label>
          <input
            id="submitter-name"
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={handleNameBlur}
            placeholder="Enter your name"
            className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
          />
        </div>

        {isAtLimit ? (
          <div className="py-8 text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
            <p className="text-muted-foreground">
              You've reached the {maxDesigns}-design limit.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Talk to the admin if you need to replace a design.
            </p>
          </div>
        ) : !canUpload ? (
          <div className="py-8 text-center border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">
              Enter your name above to enable uploads
            </p>
          </div>
        ) : uploadStatus === "uploading" ? (
          <div className="py-8 text-center border-2 border-dashed rounded-lg">
            <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-primary" />
            <p className="text-muted-foreground">Uploading...</p>
          </div>
        ) : (
          /* D-01: Drag-and-drop zone with click to browse fallback */
          <UploadDropzone
            endpoint="designUploader"
            config={{ mode: "auto" }}
            onClientUploadComplete={async (res) => {
              if (res && res[0]) {
                // Save name before creating design
                setName(nameInput.trim());
                // Create design record via Server Action
                // serverData.url contains the EXIF-stripped image URL
                const imageUrl = res[0].serverData?.url || res[0].ufsUrl;
                await createDesignAction(imageUrl, nameInput.trim(), token!);
                setUploadStatus("success");
                // Reset after delay
                setTimeout(() => setUploadStatus("idle"), 2000);
              }
            }}
            onUploadError={(error) => {
              setUploadStatus("error");
              setErrorMessage(error.message || "Upload failed");
            }}
            onUploadBegin={() => {
              setUploadStatus("uploading");
            }}
            appearance={{
              container: "border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-primary transition-colors",
              uploadIcon: "text-muted-foreground h-10 w-10",
              label: "text-foreground text-lg",
              allowedContent: "text-muted-foreground text-sm mt-2",
              button: "bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 text-base font-medium mt-4",
            }}
          />
        )}

        {/* Success feedback per D-04 */}
        {uploadStatus === "success" && (
          <div className="flex items-center gap-2 text-green-600 justify-center">
            <Check className="h-5 w-5" />
            <span>Design uploaded successfully!</span>
          </div>
        )}

        {uploadStatus === "error" && (
          <div className="flex items-center gap-2 text-red-600 justify-center">
            <AlertCircle className="h-5 w-5" />
            <span>{errorMessage}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

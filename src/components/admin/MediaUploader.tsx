import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Video, Link as LinkIcon, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type MediaType = 'image' | 'video' | 'both';

interface MediaUploaderProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  label?: string;
  mediaType?: MediaType;
  maxSizeMB?: number;
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];

export const MediaUploader = ({ 
  value, 
  onChange, 
  placeholder, 
  label,
  mediaType = 'both',
  maxSizeMB = 50
}: MediaUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getAcceptedTypes = () => {
    if (mediaType === 'image') return ACCEPTED_IMAGE_TYPES;
    if (mediaType === 'video') return ACCEPTED_VIDEO_TYPES;
    return [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES];
  };

  const getAcceptString = () => {
    if (mediaType === 'image') return 'image/*';
    if (mediaType === 'video') return 'video/mp4,video/webm,video/quicktime,video/x-msvideo';
    return 'image/*,video/mp4,video/webm,video/quicktime,video/x-msvideo';
  };

  const isVideoUrl = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const uploadFile = async (file: File) => {
    const acceptedTypes = getAcceptedTypes();
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    // Validate file type
    if (!acceptedTypes.includes(file.type) && !isImage && !isVideo) {
      toast({
        title: 'Invalid file type',
        description: `Please upload a valid ${mediaType === 'both' ? 'image or video' : mediaType} file`,
        variant: 'destructive',
      });
      return;
    }

    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: `Please upload a file smaller than ${maxSizeMB}MB`,
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadComplete(false);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const folder = isVideo ? 'videos' : 'images';
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cms-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      clearInterval(progressInterval);
      setUploadProgress(100);

      const { data: urlData } = supabase.storage
        .from('cms-uploads')
        .getPublicUrl(filePath);

      onChange(urlData.publicUrl);
      setUploadComplete(true);
      
      toast({ 
        title: 'Upload Complete', 
        description: `${isVideo ? 'Video' : 'Image'} uploaded successfully and ready to use.` 
      });

      // Reset complete state after 2 seconds
      setTimeout(() => setUploadComplete(false), 2000);
    } catch (error: any) {
      clearInterval(progressInterval);
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  }, [mediaType, maxSizeMB]);

  const handleRemove = () => {
    onChange('');
  };

  const renderPreview = () => {
    if (!value) return null;

    const isVideo = isVideoUrl(value);

    return (
      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border">
        {isVideo ? (
          <video
            src={value}
            className="w-full h-full object-cover"
            controls
            muted
            playsInline
          />
        ) : (
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🖼️</text></svg>';
            }}
          />
        )}
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 p-1.5 bg-background/80 hover:bg-destructive rounded-full transition-colors"
          title="Remove media"
        >
          <X size={14} />
        </button>
        {isVideo && (
          <span className="absolute bottom-2 left-2 px-2 py-1 bg-background/80 rounded text-xs flex items-center gap-1">
            <Video size={12} />
            Video
          </span>
        )}
        {uploadComplete && (
          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="text-green-500" size={48} />
          </div>
        )}
      </div>
    );
  };

  const getIcon = () => {
    if (mediaType === 'video') return <Video size={14} />;
    if (mediaType === 'image') return <ImageIcon size={14} />;
    return <ImageIcon size={14} />;
  };

  const getButtonLabel = () => {
    if (isUploading) return 'Uploading...';
    if (mediaType === 'video') return 'Upload Video';
    if (mediaType === 'image') return 'Upload Image';
    return 'Upload Media';
  };

  const getDropzoneLabel = () => {
    if (mediaType === 'video') return 'Drag & drop video here or click to browse';
    if (mediaType === 'image') return 'Drag & drop image here or click to browse';
    return 'Drag & drop media here or click to browse';
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {getIcon()}
          {label}
        </label>
      )}
      
      {/* Preview */}
      {value && renderPreview()}

      {/* Drag & Drop Zone */}
      {!value && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            transition-all duration-200 ease-in-out
            ${isDragOver 
              ? 'border-primary bg-primary/10' 
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
            }
            ${isUploading ? 'pointer-events-none opacity-70' : ''}
          `}
        >
          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <>
                <Loader2 size={32} className="animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Uploading... {uploadProgress}%</p>
              </>
            ) : (
              <>
                <Upload size={32} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{getDropzoneLabel()}</p>
                <p className="text-xs text-muted-foreground/70">
                  {mediaType === 'video' && 'MP4, WebM, MOV (max 50MB)'}
                  {mediaType === 'image' && 'JPG, PNG, GIF, WebP (max 5MB)'}
                  {mediaType === 'both' && 'Images or Videos (max 50MB)'}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="space-y-1">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            {uploadProgress < 100 ? 'Uploading to server...' : 'Processing...'}
          </p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptString()}
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Action Buttons */}
      {value && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex-1"
          >
            {isUploading ? (
              <>
                <Loader2 size={14} className="mr-2 animate-spin" />
                {uploadProgress}%
              </>
            ) : (
              <>
                <Upload size={14} className="mr-2" />
                Replace
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowUrlInput(!showUrlInput)}
          >
            <LinkIcon size={14} className="mr-1" />
            {showUrlInput ? 'Hide' : 'URL'}
          </Button>
        </div>
      )}

      {/* URL Input */}
      {showUrlInput && (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'https://example.com/media.mp4'}
          className="bg-background text-sm"
        />
      )}
    </div>
  );
};

export default MediaUploader;

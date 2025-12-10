import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Video, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getAcceptedTypes = () => {
    if (mediaType === 'image') return ACCEPTED_IMAGE_TYPES;
    if (mediaType === 'video') return ACCEPTED_VIDEO_TYPES;
    return [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES];
  };

  const getAcceptString = () => {
    if (mediaType === 'image') return 'image/*';
    if (mediaType === 'video') return 'video/mp4,video/webm,video/quicktime';
    return 'image/*,video/mp4,video/webm,video/quicktime';
  };

  const isVideoUrl = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

      const { data: urlData } = supabase.storage
        .from('cms-uploads')
        .getPublicUrl(filePath);

      onChange(urlData.publicUrl);
      toast({ 
        title: 'Success', 
        description: `${isVideo ? 'Video' : 'Image'} uploaded successfully.` 
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload file.',
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

  return (
    <div className="space-y-2">
      {label && (
        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {getIcon()}
          {label}
        </label>
      )}
      
      {/* Preview */}
      {renderPreview()}

      {/* Upload Controls */}
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptString()}
          onChange={handleFileUpload}
          className="hidden"
        />
        
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
              {uploadProgress > 0 ? `${uploadProgress}%` : 'Uploading...'}
            </>
          ) : (
            <>
              <Upload size={14} className="mr-2" />
              {getButtonLabel()}
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
          {showUrlInput ? 'Hide URL' : 'URL'}
        </Button>
      </div>

      {/* URL Input */}
      {showUrlInput && (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'https://example.com/media.mp4'}
          className="bg-background text-sm"
        />
      )}

      {/* Help text */}
      <p className="text-xs text-muted-foreground">
        {mediaType === 'video' && 'Supported: MP4, WebM (max 50MB)'}
        {mediaType === 'image' && 'Supported: JPG, PNG, GIF, WebP (max 5MB)'}
        {mediaType === 'both' && 'Supported: Images (JPG, PNG) or Videos (MP4, WebM)'}
      </p>
    </div>
  );
};

export default MediaUploader;

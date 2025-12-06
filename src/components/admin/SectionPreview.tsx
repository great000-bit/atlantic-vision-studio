import { Button } from '@/components/ui/button';

interface SectionContent {
  heading?: string;
  subheading?: string;
  body?: string;
  buttonText?: string;
  buttonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  videoUrl?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  overlayOpacity?: string;
  isPublished?: boolean;
  [key: string]: any;
}

interface SectionPreviewProps {
  sectionName: string;
  content: SectionContent;
}

export const SectionPreview = ({ sectionName, content }: SectionPreviewProps) => {
  const bgStyle: React.CSSProperties = {};
  
  if (content.backgroundColor) {
    bgStyle.backgroundColor = content.backgroundColor;
  }
  
  if (content.backgroundImage) {
    bgStyle.backgroundImage = `url(${content.backgroundImage})`;
    bgStyle.backgroundSize = 'cover';
    bgStyle.backgroundPosition = 'center';
  }

  const isHero = sectionName.toLowerCase().includes('hero');
  const isCta = sectionName.toLowerCase().includes('cta');

  return (
    <div 
      className="relative rounded-lg overflow-hidden border border-border"
      style={bgStyle}
    >
      {/* Overlay for background images */}
      {(content.backgroundImage || content.videoUrl) && (
        <div 
          className="absolute inset-0 bg-background/70"
          style={{ 
            opacity: content.overlayOpacity ? parseFloat(content.overlayOpacity) : 0.7 
          }}
        />
      )}

      {/* Video Background Preview */}
      {content.videoUrl && (
        <div className="absolute inset-0 -z-10">
          <video
            src={content.videoUrl}
            className="w-full h-full object-cover"
            muted
            loop
            autoPlay
            playsInline
          />
        </div>
      )}

      {/* Content */}
      <div className={`relative p-6 ${isHero || isCta ? 'text-center' : ''}`}>
        {/* Section Name Badge */}
        <div className="absolute top-2 right-2">
          <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full capitalize">
            {sectionName}
          </span>
        </div>

        {/* Image Preview (for non-background images) */}
        {content.imageUrl && !content.backgroundImage && (
          <div className="mb-4 aspect-video max-w-md mx-auto rounded-lg overflow-hidden bg-muted">
            <img
              src={content.imageUrl}
              alt={content.imageAlt || 'Section image'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🖼️</text></svg>';
              }}
            />
          </div>
        )}

        {/* Background Image Preview */}
        {content.backgroundImage && (
          <div className="mb-4 aspect-video max-w-md mx-auto rounded-lg overflow-hidden bg-muted">
            <img
              src={content.backgroundImage}
              alt="Background"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🖼️</text></svg>';
              }}
            />
          </div>
        )}

        {/* Text Content */}
        {content.heading && (
          <h2 className={`font-heading font-bold text-foreground mb-2 ${isHero ? 'text-2xl' : 'text-xl'}`}>
            {content.heading}
          </h2>
        )}
        
        {content.subheading && (
          <h3 className="text-lg text-primary mb-3">
            {content.subheading}
          </h3>
        )}
        
        {content.body && (
          <p className="text-muted-foreground mb-4 max-w-xl mx-auto text-sm">
            {content.body.length > 200 ? content.body.slice(0, 200) + '...' : content.body}
          </p>
        )}

        {/* Buttons */}
        <div className={`flex gap-3 ${isHero || isCta ? 'justify-center' : ''}`}>
          {content.buttonText && (
            <Button size="sm" className="btn-gold pointer-events-none">
              {content.buttonText}
            </Button>
          )}
          {content.secondaryButtonText && (
            <Button size="sm" variant="outline" className="pointer-events-none">
              {content.secondaryButtonText}
            </Button>
          )}
        </div>

        {/* Unpublished indicator */}
        {content.isPublished === false && (
          <div className="mt-4 text-xs text-muted-foreground italic">
            ⚠️ This section is unpublished (draft)
          </div>
        )}
      </div>
    </div>
  );
};

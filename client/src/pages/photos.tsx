import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, Download, X } from "lucide-react";
import PhotoUpload from "@/components/photo-upload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Photo {
  id: string;
  filename: string;
  imageUrl: string;
  description?: string;
  uploadedAt: any;
  size?: number;
  type?: string;
}

export default function Photos() {
  const { toast } = useToast();
  const [showUpload, setShowUpload] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [touchStart, setTouchStart] = useState<number>(0);

  const { data: photos, isLoading, refetch } = useQuery({
    queryKey: ["photos"],
    queryFn: async () => {
      const res = await fetch('/api/photos');
      if (!res.ok) throw new Error('Fotoğraflar alınamadı');
      const data = await res.json();
      return data as Photo[];
    },
  });

  const handlePhotoUploaded = () => {
    refetch();
    setShowUpload(false);
    toast({
      title: "Başarılı!",
      description: "Fotoğrafınız başarıyla yüklendi.",
    });
  };

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleTouchStart = () => {
    setTouchStart(Date.now());
  };

  const handleTouchEnd = (photo: Photo) => {
    const touchEnd = Date.now();
    const touchDuration = touchEnd - touchStart;
    
    // If touch duration is greater than 300ms, show preview
    if (touchDuration > 300) {
      setSelectedPhoto(photo);
    }
  };

  const downloadPhoto = async (photo: Photo) => {
    try {
      const imageUrl = (photo as any).imageUrl || (photo as any).imageData;
      
      // Try direct download first
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = photo.filename || `photo_${photo.id}.jpg`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Add to DOM, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "İndirildi!",
        description: "Fotoğraf başarıyla indirildi.",
      });
    } catch (error) {
      console.error('Download error:', error);
      
      // Fallback: open in new tab if direct download fails
      try {
        const imageUrl = (photo as any).imageUrl || (photo as any).imageData;
        window.open(imageUrl, '_blank');
        toast({
          title: "Yeni sekmede açıldı",
          description: "Fotoğrafı sağ tıklayıp 'Resmi farklı kaydet' seçeneğini kullanın.",
        });
      } catch (fallbackError) {
        toast({
          title: "Hata!",
          description: "Fotoğraf indirilemedi. Lütfen tekrar deneyin.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <section className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold text-gray-800 mb-4">
            Anılarımız
          </h2>
          
          {/* Upload Button */}
          <Button
            onClick={() => setShowUpload(!showUpload)}
            className="mb-8 bg-gray-800 text-white hover:bg-gray-700 px-8 py-2"
          >
            <Upload className="mr-2 h-4 w-4" />
            {showUpload ? 'Yüklemeyi Kapat' : 'Fotoğraf Yükle'}
          </Button>
          
          {/* Upload Form */}
          {showUpload && (
            <div className="mb-8">
              <PhotoUpload onPhotoUploaded={handlePhotoUploaded} />
            </div>
          )}
        </div>

        {/* Instagram-style Photo Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : photos && photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="aspect-square bg-gray-100 relative group cursor-pointer overflow-hidden"
                onClick={() => handlePhotoClick(photo)}
                onTouchStart={handleTouchStart}
                onTouchEnd={() => handleTouchEnd(photo)}
                data-testid={`photo-${photo.id}`}
              >
                {/* Actual photo */}
                <img 
                  src={(photo as any).imageUrl || (photo as any).imageData} 
                  alt={photo.description || `Yüklenen fotoğraf`}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Hover overlay with actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex flex-col items-center text-white space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-gray-200 hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadPhoto(photo);
                      }}
                      data-testid={`download-${photo.id}`}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {photo.description && (
                      <p className="text-xs text-center line-clamp-2 px-2">
                        {photo.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-lg text-gray-500 mb-2">
              Henüz fotoğraf yok
            </h3>
            <p className="text-sm text-gray-400">
              İlk anıyı paylaşın
            </p>
          </div>
        )}

        {/* Photo Preview Dialog */}
        <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
          <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0 bg-black border-none">
            <DialogHeader className="absolute top-4 left-4 z-10">
              <DialogTitle className="text-white bg-black/50 px-3 py-1 rounded text-sm">
                {selectedPhoto?.description || 'Fotoğraf'}
              </DialogTitle>
            </DialogHeader>
            
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-200 hover:bg-white/20"
              onClick={() => setSelectedPhoto(null)}
              data-testid="close-preview"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Download button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-16 z-10 text-white hover:text-gray-200 hover:bg-white/20"
              onClick={() => selectedPhoto && downloadPhoto(selectedPhoto)}
              data-testid="download-preview"
            >
              <Download className="h-6 w-6" />
            </Button>

            {selectedPhoto && (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={(selectedPhoto as any).imageUrl || (selectedPhoto as any).imageData}
                  alt={selectedPhoto.description || 'Fotoğraf'}
                  className="max-w-full max-h-[90vh] object-contain"
                  data-testid="preview-image"
                />
                
                {/* Photo info */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-3 rounded">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      {selectedPhoto.description && (
                        <p className="text-sm mb-1">{selectedPhoto.description}</p>
                      )}
                      <p className="text-xs text-gray-300">
                        {(() => {
                          try {
                            const date = new Date(selectedPhoto.uploadedAt as any);
                            return isNaN(date.getTime()) ? 'Yeni yüklendi' : date.toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            });
                          } catch { return 'Yeni yüklendi'; }
                        })()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={() => downloadPhoto(selectedPhoto)}
                      data-testid="download-button-preview"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      İndir
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2 } from "lucide-react";
import PhotoUpload from "@/components/photo-upload";

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

  const { data: photos, isLoading, refetch } = useQuery({
    queryKey: ["photos"],
    queryFn: async () => {
      const response = await fetch('/api/photos');
      if (!response.ok) {
        throw new Error('Failed to fetch photos');
      }
      return response.json() as Photo[];
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
          <div className="grid grid-cols-3 gap-1 md:gap-2">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="aspect-square bg-gray-100 relative group cursor-pointer overflow-hidden"
              >
                {/* Actual photo */}
                <img 
                  src={photo.imageUrl} 
                  alt={photo.description || `Yüklenen fotoğraf`}
                  className="w-full h-full object-cover"
                />
                
                {/* Hover overlay with info */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="text-white text-center p-2">
                    {photo.description && (
                      <p className="text-xs mt-1 line-clamp-2">
                        {photo.description}
                      </p>
                    )}
                    <p className="text-xs mt-1 text-gray-300">
                      {photo.uploadedAt?.toDate?.() ? 
                        photo.uploadedAt.toDate().toLocaleDateString('tr-TR') : 
                        'Yeni yüklendi'
                      }
                    </p>
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
      </div>
    </section>
  );
}

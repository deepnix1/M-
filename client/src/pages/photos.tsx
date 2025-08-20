import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPhotoSchema, type Photo } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2 } from "lucide-react";
import type { z } from "zod";

type PhotoFormData = z.infer<typeof insertPhotoSchema>;

export default function Photos() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PhotoFormData>({
    resolver: zodResolver(insertPhotoSchema),
    defaultValues: {
      filename: "",
      description: "",
      guestName: "",
    },
  });

  const { data: photos, isLoading } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
  });

  const createPhotoMutation = useMutation({
    mutationFn: async (data: PhotoFormData) => {
      const response = await apiRequest("POST", "/api/photos", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({
        title: "Başarılı!",
        description: "Fotoğrafınız başarıyla paylaşıldı.",
      });
      reset();
      setSelectedFile(null);
    },
    onError: () => {
      toast({
        title: "Hata!",
        description: "Fotoğraf paylaşılırken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PhotoFormData) => {
    if (selectedFile) {
      // In a real app, you'd upload the file to a storage service
      // For now, we'll just use the filename
      createPhotoMutation.mutate({
        ...data,
        filename: selectedFile.name,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
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
            onClick={() => document.getElementById('photo-upload')?.click()}
            className="mb-8 bg-gray-800 text-white hover:bg-gray-700 px-8 py-2"
            data-testid="button-upload-trigger"
          >
            <Upload className="mr-2 h-4 w-4" />
            Fotoğraf Paylaş
          </Button>
          
          {/* Hidden Upload Form */}
          <div className={`${selectedFile ? 'block' : 'hidden'} max-w-lg mx-auto bg-white p-6 rounded-lg shadow-sm border mb-8`}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  data-testid="input-photo-upload"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mb-3">
                    {selectedFile.name}
                  </p>
                )}
              </div>
              
              <div>
                <Input
                  type="text"
                  {...register("guestName")}
                  placeholder="İsminiz"
                  className="mb-3"
                  data-testid="input-guest-name"
                />
                {errors.guestName && (
                  <p className="text-red-500 text-sm">{errors.guestName.message}</p>
                )}
              </div>
              
              <div>
                <Textarea
                  {...register("description")}
                  rows={2}
                  placeholder="Açıklama (opsiyonel)"
                  className="resize-none mb-3"
                  data-testid="textarea-description"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={!selectedFile || createPhotoMutation.isPending}
                  className="flex-1 bg-gray-800 text-white hover:bg-gray-700"
                  data-testid="button-submit-photo"
                >
                  {createPhotoMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Paylaşılıyor...
                    </>
                  ) : (
                    'Paylaş'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedFile(null);
                    reset();
                  }}
                  className="px-4"
                >
                  İptal
                </Button>
              </div>
            </form>
          </div>
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
                data-testid={`photo-card-${photo.id}`}
              >
                {/* Photo placeholder */}
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <Upload className="h-8 w-8 text-gray-300" />
                </div>
                
                {/* Hover overlay with info */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="text-white text-center p-2">
                    <p className="text-xs font-medium" data-testid={`photo-author-${photo.id}`}>
                      {photo.guestName}
                    </p>
                    {photo.description && (
                      <p className="text-xs mt-1 line-clamp-2" data-testid={`photo-description-${photo.id}`}>
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
      </div>
    </section>
  );
}

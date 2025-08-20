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
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Fotoğraf Galerisi
          </h2>
          <p className="text-xl text-gray-600 mb-8">Sizinle paylaştığımız güzel anılar</p>
          
          {/* Photo Upload Form */}
          <div className="max-w-2xl mx-auto bg-wedding-gray p-8 rounded-lg shadow-sm">
            <h3 className="font-serif text-2xl font-semibold mb-6">Fotoğraf Paylaş</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="photo-upload" className="text-gray-700 font-semibold">
                  Fotoğrafınızı Seçin
                </Label>
                <div className="mt-2">
                  <Input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    data-testid="input-photo-upload"
                  />
                  {selectedFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Seçilen dosya: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="description" className="text-gray-700 font-semibold">
                  Açıklama
                </Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  rows={3}
                  placeholder="Bu fotoğraf hakkında birkaç kelime yazın..."
                  className="mt-2 resize-none"
                  data-testid="textarea-description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="guestName" className="text-gray-700 font-semibold">
                  İsminiz
                </Label>
                <Input
                  type="text"
                  id="guestName"
                  {...register("guestName")}
                  placeholder="Adınız ve soyadınız"
                  className="mt-2"
                  data-testid="input-guest-name"
                />
                {errors.guestName && (
                  <p className="text-red-500 text-sm mt-1">{errors.guestName.message}</p>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={!selectedFile || createPhotoMutation.isPending}
                className="w-full bg-gray-800 text-white hover:bg-gray-700"
                data-testid="button-submit-photo"
              >
                {createPhotoMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Paylaşılıyor...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Fotoğrafı Paylaş
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Photo Gallery Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <span className="ml-2 text-gray-600">Fotoğraflar yükleniyor...</span>
          </div>
        ) : photos && photos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <Card
                key={photo.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                data-testid={`photo-card-${photo.id}`}
              >
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  {/* Placeholder for actual image */}
                  <Upload className="h-12 w-12 text-gray-400" />
                  <div className="ml-2 text-gray-400 text-sm">
                    {photo.filename}
                  </div>
                </div>
                <CardContent className="p-4">
                  {photo.description && (
                    <p className="text-gray-600 text-sm mb-2" data-testid={`photo-description-${photo.id}`}>
                      {photo.description}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs" data-testid={`photo-author-${photo.id}`}>
                    - {photo.guestName}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Henüz fotoğraf paylaşılmamış
            </h3>
            <p className="text-gray-500">
              İlk fotoğrafı paylaşan siz olun!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

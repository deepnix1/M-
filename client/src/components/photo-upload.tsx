import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Image, Video, Loader2 } from 'lucide-react';

interface PhotoUploadProps {
  onPhotoUploaded?: () => void;
}

export default function PhotoUpload({ onPhotoUploaded }: PhotoUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/'))) {
      setFile(selectedFile);
    } else {
      alert('Lütfen geçerli bir resim veya video dosyası seçin.');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Lütfen bir dosya seçin.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('media', file);
      formData.append('mediaType', file.type.startsWith('image/') ? 'image' : 'video');
      if (description) formData.append('description', description);

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
        throw new Error(errorData.message || 'Yükleme başarısız');
      }

      await response.json();

      setUploadProgress(100);
      setFile(null);
      setDescription('');
      
      if (onPhotoUploaded) {
        onPhotoUploaded();
      }

      alert('Medya başarıyla yüklendi!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Medya yüklenirken bir hata oluştu.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Medya Yükle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="media">Fotoğraf veya Video Seçin</Label>
          <Input
            id="media"
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Açıklama (İsteğe bağlı)</Label>
          <Input
            id="description"
            type="text"
            placeholder="Medya açıklaması..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isUploading}
          />
        </div>

        {file && (
          <div className="text-sm text-gray-600">
            Seçilen dosya: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}

        {isUploading && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <div className="text-sm text-gray-600 text-center">
              Yükleniyor... {uploadProgress}%
            </div>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Yükleniyor...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Medya Yükle
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

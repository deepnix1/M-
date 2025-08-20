import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Image, Loader2 } from 'lucide-react';

interface PhotoUploadProps {
  onPhotoUploaded?: () => void;
}

export default function PhotoUpload({ onPhotoUploaded }: PhotoUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Lütfen geçerli bir resim dosyası seçin.');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Lütfen bir dosya seçin.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      console.log('Starting upload for file:', file.name, 'Size:', file.size);
      
      // FormData oluştur
      const formData = new FormData();
      formData.append('image', file);
      if (description) {
        formData.append('description', description);
      }

      console.log('FormData created, sending to API...');

      // Check if we're in development or production
      const isDevelopment = import.meta.env.DEV;
      const uploadUrl = isDevelopment ? '/api/photos/upload' : '/api/photos/upload';

      // API'ye yükle
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', errorText);
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      
      setUploadProgress(100);
      setFile(null);
      setDescription('');
      
      if (onPhotoUploaded) {
        onPhotoUploaded();
      }

      alert('Fotoğraf başarıyla yüklendi!');
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      setError(`Fotoğraf yüklenirken bir hata oluştu: ${errorMessage}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5" />
          Fotoğraf Yükle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="photo">Fotoğraf Seçin</Label>
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Açıklama (İsteğe bağlı)</Label>
          <Input
            id="description"
            type="text"
            placeholder="Fotoğraf açıklaması..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {file && (
          <div className="text-sm text-gray-600">
            Seçilen dosya: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
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
              Fotoğraf Yükle
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Trash2, Star, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface PortfolioImage {
  id: string;
  url: string;
  description: string | null;
  isMain: boolean;
  createdAt: string;
}

interface PortfolioGalleryProps {
  professionalId: string;
  isOwner?: boolean;
  maxImages?: number;
}

export function PortfolioGallery({ professionalId, isOwner = false, maxImages = 5 }: PortfolioGalleryProps) {
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageDescription, setNewImageDescription] = useState('');
  const [makeMain, setMakeMain] = useState(false);

  useEffect(() => {
    fetchImages();
  }, [professionalId]);

  async function fetchImages() {
    try {
      const response = await fetch(`/api/portfolio?professionalId=${professionalId}`);
      const data = await response.json();
      
      if (response.ok) {
        setImages(data.images);
      }
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!newImageUrl) return;

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          url: newImageUrl,
          description: newImageDescription,
          isMain: makeMain
        })
      });

      const data = await response.json();

      if (response.ok) {
        setImages([data.image, ...images]);
        setShowUploadModal(false);
        setNewImageUrl('');
        setNewImageDescription('');
        setMakeMain(false);
      } else {
        alert(data.error || 'Erro ao adicionar imagem');
      }
    } catch (error) {
      alert('Erro ao adicionar imagem');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(imageId: string) {
    if (!confirm('Tem certeza que deseja remover esta imagem?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/portfolio?id=${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setImages(images.filter(img => img.id !== imageId));
      }
    } catch (error) {
      alert('Erro ao remover imagem');
    }
  }

  async function handleSetMain(imageId: string) {
    try {
      const token = localStorage.getItem('token');
      
      // Atualizar localmente primeiro (otimista)
      setImages(images.map(img => ({
        ...img,
        isMain: img.id === imageId
      })));

      // Aqui você faria uma chamada PATCH se tivesse endpoint
      // Por agora, vamos recarregar
      fetchImages();
    } catch (error) {
      console.error('Erro ao definir imagem principal:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isOwner && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {images.length} / {maxImages} imagens
            {images.length >= maxImages && (
              <span className="text-amber-600 ml-2">Limite atingido</span>
            )}
          </div>
          <Button
            onClick={() => setShowUploadModal(true)}
            disabled={images.length >= maxImages}
            className="bg-amber-500 hover:bg-amber-600"
          >
            <Upload className="w-4 h-4 mr-2" />
            Adicionar Foto
          </Button>
        </div>
      )}

      {images.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Nenhuma foto no portfólio ainda</p>
          {isOwner && <p className="text-sm mt-2">Adicione fotos dos seus eventos!</p>}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <Card 
              key={image.id} 
              className={`overflow-hidden cursor-pointer group transition-all hover:shadow-lg ${
                image.isMain ? 'ring-2 ring-amber-500' : ''
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative aspect-square">
                <Image
                  src={image.url}
                  alt={image.description || 'Foto do portfólio'}
                  fill
                  className="object-cover"
                />
                
                {image.isMain && (
                  <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Principal
                  </div>
                )}
                
                {isOwner && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}>
                    {!image.isMain && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0"
                        onClick={() => handleSetMain(image.id)}
                        title="Definir como principal"
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                      onClick={() => handleDelete(image.id)}
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              {image.description && (
                <CardContent className="p-2">
                  <p className="text-sm text-gray-600 truncate">{image.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Modal de visualização */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <div className="space-y-4">
              <div className="relative aspect-video">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.description || 'Foto do portfólio'}
                  fill
                  className="object-contain"
                />
              </div>
              {selectedImage.description && (
                <p className="text-gray-700">{selectedImage.description}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de upload */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Foto ao Portfólio</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <Label htmlFor="url">URL da Imagem</Label>
              <Input
                id="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://..."
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={newImageDescription}
                onChange={(e) => setNewImageDescription(e.target.value)}
                placeholder="Descreva esta foto..."
                rows={3}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isMain"
                checked={makeMain}
                onChange={(e) => setMakeMain(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isMain" className="text-sm">
                Definir como foto principal
              </Label>
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowUploadModal(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={uploading || !newImageUrl}
                className="bg-amber-500 hover:bg-amber-600"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adicionando...
                  </>
                ) : (
                  'Adicionar Foto'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { StarRating } from '@/components/star-rating';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from '@/lib/utils';

interface Review {
  id: string;
  overall: number;
  foodQuality: number;
  serviceQuality: number;
  punctuality: number;
  communication: number;
  valueForMoney: number;
  comment: string;
  response: string | null;
  createdAt: string;
  reviewer: {
    name: string;
  };
}

interface ReviewListProps {
  professionalId?: string;
  clientId?: string;
  limit?: number;
}

export function ReviewList({ professionalId, clientId, limit }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchReviews() {
      try {
        const params = new URLSearchParams();
        if (professionalId) params.append('professionalId', professionalId);
        if (clientId) params.append('clientId', clientId);

        const response = await fetch(`/api/reviews?${params}`);
        const data = await response.json();

        if (response.ok) {
          setReviews(limit ? data.reviews.slice(0, limit) : data.reviews);
        } else {
          setError(data.error || 'Erro ao carregar avaliações');
        }
      } catch (err) {
        setError('Erro ao carregar avaliações');
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [professionalId, clientId, limit]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-gray-500">
        {error}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>Nenhuma avaliação ainda</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="border-gray-100">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-gray-900">{review.reviewer.name}</p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(review.createdAt))}
                </p>
              </div>
              <StarRating rating={review.overall} showValue />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Comida:</span>
                <StarRating rating={review.foodQuality} size="sm" />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Serviço:</span>
                <StarRating rating={review.serviceQuality} size="sm" />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Pontualidade:</span>
                <StarRating rating={review.punctuality} size="sm" />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Comunicação:</span>
                <StarRating rating={review.communication} size="sm" />
              </div>
            </div>

            {review.comment && (
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg mb-3">
                "{review.comment}"
              </p>
            )}

            {review.response && (
              <div className="bg-amber-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-amber-800 mb-1">Resposta:</p>
                <p className="text-amber-700">{review.response}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

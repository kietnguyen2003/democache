// app/prompts/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import type { Prompt, PromptsResponse, PromptFilters } from '@/types';
import { Search, Filter, Heart, Globe, Lock, ArrowLeft } from 'lucide-react';

function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PromptFilters>({
    query: '',
    offset: 0,
    limit: 20,
    category: 'all',
    isFavorite: false,
    isPublic: true,
  });
  const [hasNext, setHasNext] = useState(false);
  const [total, setTotal] = useState(0);
  const { user } = useAuth();

  const fetchPrompts = useCallback(async (newFilters: PromptFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (newFilters.query) params.append('query', newFilters.query);
      if (newFilters.offset !== undefined) params.append('offset', newFilters.offset.toString());
      if (newFilters.limit !== undefined) params.append('limit', newFilters.limit.toString());
      if (newFilters.category && newFilters.category !== 'all') params.append('category', newFilters.category);
      if (newFilters.isFavorite !== undefined) params.append('isFavorite', newFilters.isFavorite.toString());
      if (newFilters.isPublic !== undefined) params.append('isPublic', newFilters.isPublic.toString());
      console.log(`Fetching at prompts page`);
      const response = await fetch(`/api/prompts?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
        // force cache dùng để lưu trữ kết quả trả về trong cache của trình duyệt
        // prompts-business
        cache: 'force-cache',
        next: { tags: [`prompts-${params.toString()}`] },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prompts');
      }

      const data: PromptsResponse = await response.json();
      if (newFilters.offset === 0) {
        setPrompts(data.items);
      } else {
        setPrompts((prev) => [...prev, ...data.items]);
      }

      setHasNext(data.hasNext);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setLoading(false);
    }
  }, [user]); // user là dependency vì access_token được sử dụng

  useEffect(() => {
    fetchPrompts(filters);
  }, [fetchPrompts, filters]);

  const handleSearch = () => {
    const newFilters = { ...filters, offset: 0 };
    setFilters(newFilters);
    fetchPrompts(newFilters);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterChange = (key: keyof PromptFilters, value: any) => {
    const newFilters = { ...filters, [key]: value, offset: 0 };
    setFilters(newFilters);
    fetchPrompts(newFilters);
  };

  const loadMore = () => {
    const newFilters = { ...filters, offset: prompts.length };
    setFilters(newFilters);
    fetchPrompts(newFilters);
  };

  const categories = ['all', 'business', 'career', 'chatbot', 'coding', 'education', 'fun', 'marketing', 'productivity', 'seo', 'writing', 'other'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/chat">
                <Button variant="ghost" size="sm" className="mr-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Chat
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Prompt Library</h1>
            </div>
            <Badge variant="secondary">{total} prompts available</Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Search prompts..."
                  value={filters.query || ''}
                  onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <Select
                value={filters.category || 'all'}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.isFavorite ? 'true' : 'false'}
                onValueChange={(value) => handleFilterChange('isFavorite', value === 'true')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Favorites" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">All Prompts</SelectItem>
                  <SelectItem value="true">Favorites Only</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.isPublic ? 'true' : 'false'}
                onValueChange={(value) => handleFilterChange('isPublic', value === 'true')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Public</SelectItem>
                  <SelectItem value="false">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <Card key={prompt._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">{prompt.title}</CardTitle>
                  <div className="flex items-center space-x-1">
                    {prompt.isFavorite && <Heart className="h-4 w-4 text-red-500 fill-current" />}
                    {prompt.isPublic ? (
                      <Globe className="h-4 w-4 text-green-500" />
                    ) : (
                      <Lock className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </div>
                <CardDescription className="line-clamp-2">{prompt.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>By {prompt.userName}</span>
                    <Badge variant="outline">{prompt.category}</Badge>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm line-clamp-3">{prompt.content}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{prompt.language}</Badge>
                    <Button size="sm" variant="outline">
                      Use Prompt
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {hasNext && (
          <div className="text-center mt-8">
            <Button onClick={loadMore} disabled={loading}>
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}

        {prompts.length === 0 && !loading && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No prompts found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Prompts() {
  return (
    <ProtectedRoute>
      <PromptsPage />
    </ProtectedRoute>
  );
}
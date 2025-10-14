import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { nessies, getCategoryName, getCategoryColor, type NessieItem } from '@/data/nessies';
import { Search, Filter } from 'lucide-react';
import '@/styles/nessie.css';

export const NessieValue: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories
  const categories = Array.from(new Set(nessies.map(nessie => nessie.category)));

  // Filter nessies based on search and category
  const filteredNessies = nessies.filter(nessie => {
    const matchesSearch = nessie.mutation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nessie.value.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || nessie.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group nessies by category
  const groupedNessies = categories.reduce((acc, category) => {
    acc[category] = filteredNessies.filter(nessie => nessie.category === category);
    return acc;
  }, {} as Record<string, NessieItem[]>);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">🦕 Nessie Value Database</h2>
        <p className="text-muted-foreground">Complete reference for Nessie mutations and their values</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search mutations or values..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {getCategoryName(category)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredNessies.length} of {nessies.length} Nessies
      </div>

      {/* Nessie Categories */}
      <div className="space-y-6">
        {categories.map(category => {
          const categoryNessies = groupedNessies[category];
          if (categoryNessies.length === 0) return null;

          return (
            <Card key={category} className="p-6 nessie-category">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-primary mb-2">
                  {getCategoryName(category)}
                </h3>
                <Badge className={getCategoryColor(category)}>
                  {categoryNessies.length} items
                </Badge>
              </div>

              <div className="grid gap-3">
                {categoryNessies.map((nessie, index) => (
                  <div
                    key={`${category}-${index}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors nessie-item"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {nessie.mutation === "No Mutation" ? "Base Nessie" : nessie.mutation}
                        </span>
                        <Badge variant={nessie.appraised ? "default" : "secondary"}>
                          {nessie.appraised ? "Appraised" : "Unappraised"}
                        </Badge>
                      </div>
                      {nessie.weight !== "N/A" && (
                        <div className="text-sm text-muted-foreground">
                          Weight: {nessie.weight}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 sm:mt-0 sm:text-right">
                      <div className="text-lg font-bold text-accent nessie-value">
                        {nessie.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {filteredNessies.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            <Search className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No Nessies found</p>
            <p>Try adjusting your search terms or category filter</p>
          </div>
        </Card>
      )}
    </div>
  );
};
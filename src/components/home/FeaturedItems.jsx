import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Star, Clock, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

import { useQuery } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedItems() {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['featured-items'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/items`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  // Filter for high-rated items locally since API returns all
  // Accessing Drizzle camelCase properties
  const filteredItems = items
    .filter(item => item.isAvailable)
    .sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0))
    .slice(0, 8);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4"
        >
          <div>
            <span className="inline-block px-4 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-4">
              Popular Picks
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Featured Items
            </h2>
          </div>
          <Link to={createPageUrl('Items')}>
            <Button variant="outline" className="rounded-full group">
              View All
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`${createPageUrl('Items')}?item=${item.id}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-2xl mb-4">
                    <img
                      src={item.imageUrl || `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80`}
                      alt={item.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{Number(item.rating || 4.5).toFixed(1)}</span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-emerald-500 text-white rounded-full px-3 py-1 text-sm font-medium">
                      ${Number(item.price).toFixed(2)}
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors mb-1">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{item.restaurant || 'Local Store'}</span>
                    {item.prepTime && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.prepTime} min</span>
                        </div>
                      </>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-4 text-center py-12">
              <p className="text-gray-500">No items available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
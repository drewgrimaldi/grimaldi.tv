import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingBag, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Store() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list(),
  });

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="min-h-screen py-24 px-6 relative">
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10" style={{ backgroundImage: "url('https://media.base44.com/images/public/69b6b824807a75fd2d45c448/0f43c768b_IMG_4167.jpg')" }} />
      <div className="fixed inset-0 bg-background/60 backdrop-blur-md -z-10" />
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-3 mb-2"><ShoppingBag className="w-6 h-6 text-primary" /><h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground">Store</h1></div>
          <p className="text-muted-foreground text-lg">Official merchandise from Sticker Mule</p>
        </motion.div>
        {isLoading ? (
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-card rounded-2xl border border-border/50 animate-pulse">
                <div className="aspect-square bg-secondary" />
                <div className="p-5 space-y-3"><div className="h-3 w-20 bg-secondary rounded" /><div className="h-5 w-3/4 bg-secondary rounded" /></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 space-y-12">
            {categories.map(category => (
              <div key={category}>
                <h2 className="text-2xl font-semibold text-foreground mb-6">{category}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.filter(p => p.category === category).map((product, i) => (
                    <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="group bg-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-300">
                      <div className="aspect-square overflow-hidden bg-secondary"><img src={product.image_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /></div>
                      <div className="p-5">
                        <h3 className="font-semibold text-foreground line-clamp-2 mb-4">{product.title}</h3>
                        <a href={product.sticker_mule_url} target="_blank" rel="noopener noreferrer">
                          <Button className="w-full gap-2" variant="outline"><ExternalLink className="w-4 h-4" /> View on Sticker Mule</Button>
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

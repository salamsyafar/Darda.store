import React from 'react';
import { 
  Utensils, 
  Shirt, 
  Home, 
  Sprout, 
  Wrench, 
  Package, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5' }) => {
  const normalized = name.toLowerCase();

  if (normalized.includes('kulin') || normalized.includes('makan') || normalized.includes('utensil')) {
    return <Utensils className={className} />;
  }
  if (normalized.includes('fash') || normalized.includes('busana') || normalized.includes('shirt')) {
    return <Shirt className={className} />;
  }
  if (normalized.includes('rumah') || normalized.includes('tangga') || normalized.includes('home')) {
    return <Home className={className} />;
  }
  if (normalized.includes('tani') || normalized.includes('kebun') || normalized.includes('sprout')) {
    return <Sprout className={className} />;
  }
  if (normalized.includes('jasa') || normalized.includes('servis') || normalized.includes('wrench')) {
    return <Wrench className={className} />;
  }
  if (normalized.includes('pilihan') || normalized.includes('sparkle')) {
    return <Sparkles className={className} />;
  }
  if (normalized.includes('lain') || normalized.includes('package')) {
    return <Package className={className} />;
  }

  return <ShoppingBag className={className} />;
};

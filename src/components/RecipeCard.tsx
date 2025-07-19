
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Recipe } from '@/types/types';
import { toast } from '@/components/ui/sonner';

interface RecipeCardProps {
  recipe: Recipe;
  matchPercentage: number;
  showFavorite?: boolean;
  isSeasonal?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  matchPercentage, 
  showFavorite = true,
  isSeasonal = false 
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Check if this recipe is in favorites
    const storedFavorites = localStorage.getItem('favoriteRecipes');
    if (storedFavorites) {
      const favoriteIds = JSON.parse(storedFavorites);
      setIsFavorite(favoriteIds.includes(recipe.id));
    }
  }, [recipe.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const storedFavorites = localStorage.getItem('favoriteRecipes');
    let favoriteIds: number[] = storedFavorites ? JSON.parse(storedFavorites) : [];

    if (isFavorite) {
      // Remove from favorites
      favoriteIds = favoriteIds.filter(id => id !== recipe.id);
      toast.success('Recipe removed from favorites!');
    } else {
      // Add to favorites
      favoriteIds.push(recipe.id);
      toast.success('Recipe added to favorites!');
    }

    localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteIds));
    setIsFavorite(!isFavorite);
  };

  // Function to get a consistent fallback image based on recipe ID
  const getFallbackImage = () => {
    const fallbackImages = [
      "https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80",
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1165&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1167&q=80"
    ];
    
    // Use the recipe ID to pick a consistent fallback image
    return fallbackImages[recipe.id % fallbackImages.length];
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getRecipeImage = () => {
    // Special case handling for specific recipes with incorrect images
    if (recipe.id === 14) { // Palak Paneer - updated with the correct user-provided image
      return "/lovable-uploads/3ead302d-7d75-4423-9c5e-c30bb3809571.png";
    } else if (recipe.id === 4) { // Omelette with Vegetables - updated with the correct user-provided image
      return "/lovable-uploads/419dc5ac-e403-406d-9ee5-8e1e04a124f7.png";
    } else {
      return imageError ? getFallbackImage() : recipe.image;
    }
  };

  const cardClasses = `recipe-card animate-scale-in ${
    isSeasonal ? 'border-2 border-plateup-orange bg-plateup-cream' : 'bg-white'
  }`;

  return (
    <div className={cardClasses}>
      <div className="relative">
        <img 
          src={getRecipeImage()} 
          alt={recipe.name} 
          className="recipe-card-image w-full h-48 object-cover"
          onError={handleImageError}
        />
        <div className={`absolute top-2 right-2 ${isSeasonal ? 'bg-plateup-orange' : 'bg-plateup-blue'} text-white px-2 py-1 rounded-full text-xs font-medium`}>
          {isSeasonal ? 'Seasonal' : `${Math.round(matchPercentage)}% match`}
        </div>
        
        {showFavorite && (
          <button 
            onClick={toggleFavorite}
            className={`absolute top-2 left-2 p-2 rounded-full ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white bg-opacity-70 text-gray-600'
            } hover:bg-opacity-100 transition-all`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        )}
      </div>
      
      <div className={`p-4 ${isSeasonal ? 'bg-plateup-cream' : ''}`}>
        <h3 className="text-xl font-semibold mb-2">{recipe.name}</h3>
        <p className="text-gray-600 mb-4 text-sm">{recipe.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {recipe.ingredients.length} ingredients • {recipe.steps.length} steps
            {recipe.calories && ` • ${recipe.calories} cal`}
          </span>
          <Link to={`/recipe/${recipe.id}`}>
            <Button className={`${isSeasonal ? 'bg-plateup-orange hover:bg-orange-600' : 'bg-plateup-blue hover:bg-blue-600'}`}>
              Cook Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;

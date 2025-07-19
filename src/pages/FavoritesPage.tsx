
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import RecipeCard from '@/components/RecipeCard';
import { Recipe } from '@/types/types';
import recipesData from '@/data/recipes.json';

const FavoritesPage = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteRecipes');
    if (storedFavorites) {
      const favoriteIds = JSON.parse(storedFavorites);
      const recipes = recipesData as Recipe[];
      const favorites = recipes.filter(recipe => favoriteIds.includes(recipe.id));
      setFavoriteRecipes(favorites);
    }
  }, []);

  return (
    <div className="min-h-screen bg-plateup-cream">
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-plateup-orange">My Favorite Recipes</h1>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
        
        {favoriteRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteRecipes.map(recipe => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                matchPercentage={100}
                showFavorite={true} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">
              No favorite recipes yet!
            </h2>
            <p className="text-gray-600 mb-8">
              Start adding your favorite recipes by clicking the heart icon on recipe cards.
            </p>
            <Link to="/recipes">
              <Button>Explore Recipes</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;

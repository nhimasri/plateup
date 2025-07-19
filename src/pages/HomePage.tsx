
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import IngredientSelector from '@/components/IngredientSelector';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import SeasonalRecommendations from '@/components/SeasonalRecommendations';
import RecipeList from '@/components/RecipeList';

const HomePage = () => {
  const [showRecommendations, setShowRecommendations] = useState(false);

  return (
    <div className="min-h-screen bg-plateup-cream">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-plateup-orange">Welcome to PlateUp</h1>
          <Link to="/favorites">
            <Button variant="outline" className="rounded-full p-2 h-auto" title="My Favorite Recipes">
              <Heart className="h-6 w-6 text-plateup-orange hover:fill-plateup-orange" />
            </Button>
          </Link>
        </div>
        
        <p className="text-gray-600 italic text-center mb-8">"Let's turn your ingredients into delicious meals!"</p>
        
        <IngredientSelector onFindRecipes={() => setShowRecommendations(true)} />
        
        {showRecommendations && (
          <>
            <div className="my-12">
              <h2 className="text-2xl font-bold mb-6 text-center">Recipe Recommendations</h2>
              
              <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium">Understanding Our Recipe Categories</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3 p-3 border rounded-lg border-plateup-orange">
                    <div className="inline-flex items-center justify-center bg-plateup-orange h-8 w-8 rounded-full text-white text-xs font-medium">
                      <span>●</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Seasonal Recipes</h4>
                      <p className="text-sm text-gray-600">
                        These recipes feature ingredients that are at their peak during the current season.
                        Look for the orange border and seasonal tag!
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border rounded-lg border-plateup-blue">
                    <div className="inline-flex items-center justify-center bg-plateup-blue h-8 w-8 rounded-full text-white text-xs font-medium">
                      <span>●</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Ingredient Matches</h4>
                      <p className="text-sm text-gray-600">
                        These recipes match the ingredients you've selected.
                        The percentage shows how many of the recipe's ingredients you have!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Seasonal Recommendations Section */}
              <SeasonalRecommendations />
              
              {/* Ingredient-based Matches */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6 text-center">Your Ingredient Matches</h2>
                <RecipeList inHomePage={true} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;

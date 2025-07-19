
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import RecipeCard from './RecipeCard';
import { Recipe } from '@/types/types';
import recipesData from '@/data/recipes.json';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface RecipeListProps {
  inHomePage?: boolean;
}

const RecipeList: React.FC<RecipeListProps> = ({ inHomePage = false }) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [matchingRecipes, setMatchingRecipes] = useState<{ recipe: Recipe, matchPercentage: number }[]>([]);

  useEffect(() => {
    // Get selected ingredients from local storage
    const storedIngredients = localStorage.getItem('selectedIngredients');
    if (storedIngredients) {
      setSelectedIngredients(JSON.parse(storedIngredients));
    }
  }, []);

  useEffect(() => {
    if (selectedIngredients.length > 0) {
      findMatchingRecipes();
    }
  }, [selectedIngredients]);

  const findMatchingRecipes = () => {
    const recipes = recipesData as Recipe[];
    
    const recipesWithMatchPercentages = recipes.map(recipe => {
      const recipeIngredients = recipe.ingredients.map(ing => ing.item);
      const matchCount = selectedIngredients.filter(ing => recipeIngredients.includes(ing)).length;
      const totalRecipeIngredientsCount = recipeIngredients.length;
      
      // Calculate match percentage based on how many recipe ingredients the user has
      const matchPercentage = (matchCount / totalRecipeIngredientsCount) * 100;
      
      return { recipe, matchPercentage };
    });

    // Filter recipes with at least 50% match
    const filteredRecipes = recipesWithMatchPercentages
      .filter(item => item.matchPercentage >= 50)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    setMatchingRecipes(filteredRecipes);
  };

  // If this is embedded in the home page, show a simplified version
  if (inHomePage) {
    return (
      <Card className="border border-plateup-blue">
        <CardContent className="p-4">
          {matchingRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingRecipes.slice(0, 6).map(({ recipe, matchPercentage }) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  matchPercentage={matchPercentage} 
                  isSeasonal={false}  // Explicitly mark as non-seasonal
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-4">
                No matches found for your ingredients.
              </h2>
              <p className="text-gray-600 mb-4">
                Try selecting different ingredients or check out our seasonal recommendations above.
              </p>
            </div>
          )}
          
          {matchingRecipes.length > 6 && (
            <div className="text-center mt-6">
              <Link to="/recipes">
                <Button>See All Matches ({matchingRecipes.length})</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Full page version
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Recipes You Can Make</h1>
        <Link to="/">
          <Button variant="outline">Change Ingredients</Button>
        </Link>
      </div>
      
      <Card className="mb-8 border border-plateup-blue">
        <CardHeader className="bg-plateup-blue/10">
          <CardTitle className="text-xl">Your Ingredient Matches</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {matchingRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingRecipes.map(({ recipe, matchPercentage }) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  matchPercentage={matchPercentage} 
                  isSeasonal={false}  // Explicitly mark as non-seasonal
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">
                Oops! No perfect match.
              </h2>
              <p className="text-gray-600 mb-8">
                Maybe try selecting different ingredients?
              </p>
              <Link to="/">
                <Button>Select Different Ingredients</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipeList;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/sonner';
import { Recipe } from '@/types/types';
import CookingTimer from './CookingTimer';
import { Heart } from 'lucide-react';
import recipesData from '@/data/recipes.json';

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [servings, setServings] = useState(2);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [allStepsCompleted, setAllStepsCompleted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      const foundRecipe = (recipesData as Recipe[]).find(r => r.id === parseInt(id));
      if (foundRecipe) {
        setRecipe(foundRecipe);
      }
    }
  }, [id]);

  useEffect(() => {
    if (recipe && completedSteps.length === recipe.steps.length) {
      setAllStepsCompleted(true);
    }
  }, [completedSteps, recipe]);

  useEffect(() => {
    // Check if this recipe is in favorites
    if (id) {
      const storedFavorites = localStorage.getItem('favoriteRecipes');
      if (storedFavorites) {
        const favoriteIds = JSON.parse(storedFavorites);
        setIsFavorite(favoriteIds.includes(parseInt(id)));
      }
    }
  }, [id]);

  const toggleFavorite = () => {
    if (!recipe) return;

    const storedFavorites = localStorage.getItem('favoriteRecipes');
    let favoriteIds: number[] = storedFavorites ? JSON.parse(storedFavorites) : [];

    if (isFavorite) {
      // Remove from favorites
      favoriteIds = favoriteIds.filter(fid => fid !== recipe.id);
      toast.success('Recipe removed from favorites!');
    } else {
      // Add to favorites
      favoriteIds.push(recipe.id);
      toast.success('Recipe added to favorites!');
    }

    localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteIds));
    setIsFavorite(!isFavorite);
  };

  const handleStepComplete = (index: number) => {
    // Check if the previous step is completed first (except for the first step)
    if (index > 0 && !completedSteps.includes(index - 1)) {
      toast.error("Hey, why are you in a hurry? Complete the previous step first! 🍳");
      return;
    }
    
    setCompletedSteps(prev => {
      // If already completed, remove from completed steps
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      
      // Otherwise add to completed steps
      return [...prev, index];
    });
  };

  const calculateIngredientQuantity = (baseQuantity: number): number => {
    return (baseQuantity * servings) / 2;
  };

  const formatIngredientQuantity = (quantity: number, unit: string): string => {
    const adjustedQuantity = calculateIngredientQuantity(quantity);
    
    // Format based on unit type
    if (unit === 'pieces' || unit === 'medium' || unit === 'large' || unit === 'small') {
      // For countable items (fruits, vegetables), use whole numbers when possible
      return Number.isInteger(adjustedQuantity) ? 
        adjustedQuantity.toString() : 
        adjustedQuantity.toFixed(1).replace(/\.0$/, '');
    } else if (unit === 'tablespoon' || unit === 'tablespoons' || unit === 'teaspoon' || unit === 'teaspoons' || unit === 'cup' || unit === 'cups') {
      // For standard measurements, use fractions for common values
      if (adjustedQuantity === 0.25) return '¼';
      if (adjustedQuantity === 0.5) return '½';
      if (adjustedQuantity === 0.75) return '¾';
      if (adjustedQuantity === 0.33 || adjustedQuantity === 0.333) return '⅓';
      if (adjustedQuantity === 0.66 || adjustedQuantity === 0.667) return '⅔';
      
      // Otherwise format with one decimal place if needed
      return Number.isInteger(adjustedQuantity) ? 
        adjustedQuantity.toString() : 
        adjustedQuantity.toFixed(1).replace(/\.0$/, '');
    } else {
      // For other units, format with one decimal place if needed
      return Number.isInteger(adjustedQuantity) ? 
        adjustedQuantity.toString() : 
        adjustedQuantity.toFixed(1).replace(/\.0$/, '');
    }
  };

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading recipe...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Recipe Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">{recipe.name}</h1>
          <button
            onClick={toggleFavorite}
            className={`p-3 rounded-full ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-600'
            } hover:opacity-80 transition-all`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>
        <p className="text-gray-600 mb-6">{recipe.description}</p>
        <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden mb-6">
          <img 
            src={recipe.image} 
            alt={recipe.name} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Servings Selector */}
      <div className="mb-8 bg-plateup-lightGreen p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Servings</h2>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setServings(prev => Math.max(1, prev - 1))}
              className="w-8 h-8 rounded-full bg-white text-gray-700 flex items-center justify-center border"
              disabled={servings <= 1}
            >
              -
            </button>
            <span className="text-xl font-medium">{servings}</span>
            <button 
              onClick={() => setServings(prev => Math.min(8, prev + 1))}
              className="w-8 h-8 rounded-full bg-white text-gray-700 flex items-center justify-center border"
              disabled={servings >= 8}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Ingredients Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <ul className="divide-y">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="py-2 flex justify-between items-center">
                <span>{ingredient.item}</span>
                <span className="font-medium">
                  {formatIngredientQuantity(ingredient.quantity, ingredient.unit)} {ingredient.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cooking Steps */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Cooking Instructions</h2>
        <div className="bg-white rounded-lg shadow">
          {recipe.steps.map((step, index) => (
            <div 
              key={index} 
              className={`recipe-step ${completedSteps.includes(index) ? 'completed' : ''}`}
            >
              <div className="flex px-4">
                <Checkbox 
                  id={`step-${index}`} 
                  checked={completedSteps.includes(index)}
                  onCheckedChange={() => handleStepComplete(index)}
                  className="mt-1 mr-3"
                />
                <div className="flex-1">
                  <label 
                    htmlFor={`step-${index}`}
                    className={`text-lg ${completedSteps.includes(index) ? 'line-through text-gray-500' : ''}`}
                  >
                    <span className="font-medium mr-2">Step {index + 1}:</span>
                    {step.instruction}
                  </label>
                  
                  {/* Appliance Instructions */}
                  {step.appliance && (
                    <div className="mt-2 ml-6 p-2 bg-purple-50 border border-purple-100 rounded-md">
                      <p className="text-sm text-purple-800">
                        <span className="font-semibold">{step.appliance}: </span> 
                        {step.applianceSettings}
                        {step.temperature && (
                          <span className="ml-1">
                            ({step.temperature}°F / {Math.round((step.temperature - 32) * 5/9)}°C)
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  
                  {/* Timer section */}
                  {step.timer > 0 && (
                    <CookingTimer 
                      duration={step.timer} 
                      stepIndex={index}
                      onComplete={() => {
                        if (!completedSteps.includes(index)) {
                          handleStepComplete(index);
                        }
                      }}
                      disabled={completedSteps.includes(index)}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final step completion message */}
      {allStepsCompleted && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fade-in">
          <div className="bg-white p-8 rounded-lg text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Good Job! 🎉</h2>
            <p className="mb-6">You've finished cooking!</p>
            <Link to="/">
              <Button className="bg-plateup-green hover:bg-green-600">
                Hurray! Back to Home
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;

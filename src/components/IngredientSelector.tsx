
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import ingredientsData from '@/data/ingredients.json';
import { 
  Carrot, 
  Egg, 
  Apple, 
  Beef,
  Wheat,
  ChefHat
} from 'lucide-react';

const getIconForCategory = (category: string) => {
  switch (category) {
    case 'Vegetables':
      return <Carrot className="w-6 h-6" />;
    case 'Dairy':
      return <Egg className="w-6 h-6" />;
    case 'Fruits':
      return <Apple className="w-6 h-6" />;
    case 'Meats':
      return <Beef className="w-6 h-6" />;
    case 'Grains':
      return <Wheat className="w-6 h-6" />;
    case 'Spices':
      return <ChefHat className="w-6 h-6" />;
    default:
      return <ChefHat className="w-6 h-6" />;
  }
};

interface IngredientSelectorProps {
  onFindRecipes?: () => void;
}

const IngredientSelector = ({ onFindRecipes }: IngredientSelectorProps) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleIngredientClick = (ingredient: string) => {
    setSelectedIngredients(prev => {
      if (prev.includes(ingredient)) {
        return prev.filter(item => item !== ingredient);
      } else {
        return [...prev, ingredient];
      }
    });
  };

  const handleFindRecipes = () => {
    if (selectedIngredients.length === 0) {
      toast.error('Please select at least one ingredient!');
      return;
    }

    localStorage.setItem('selectedIngredients', JSON.stringify(selectedIngredients));
    
    if (onFindRecipes) {
      onFindRecipes();
    } else {
      navigate('/recipes');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-8">Select Your Ingredients</h1>
      
      <p className="text-center mb-6 text-gray-600">
        Check the ingredients you have, and we'll suggest recipes you can make!
      </p>
      
      <div className="flex justify-end mb-4">
        <div className="bg-plateup-lightOrange py-2 px-4 rounded-full text-sm">
          {selectedIngredients.length} ingredients selected
        </div>
      </div>

      {Object.entries(ingredientsData).map(([category, items]) => (
        <div key={category} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {getIconForCategory(category)}
            <h2 className="category-title">{category}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {items.map((ingredient) => (
              <div
                key={ingredient}
                className={`ingredient-card ${selectedIngredients.includes(ingredient) ? 'selected' : ''}`}
                onClick={() => handleIngredientClick(ingredient)}
              >
                <div className="mb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-lg font-bold text-plateup-orange">
                      {ingredient.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-center">{ingredient}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-8 flex justify-center">
        <Button 
          className="px-8 py-6 text-lg bg-plateup-orange hover:bg-orange-600 animate-pulse-once"
          onClick={handleFindRecipes}
        >
          Find Recipes
        </Button>
      </div>
    </div>
  );
};

export default IngredientSelector;

import React, { useEffect, useState } from 'react';
import RecipeCard from './RecipeCard';
import { Recipe, Season } from '@/types/types';
import { Sun, Snowflake, CloudSun, Umbrella } from 'lucide-react';
import recipesData from '@/data/recipes.json';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SeasonalRecommendations = () => {
  const [season, setSeason] = useState<Season>('spring');
  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);

  // Helper function to determine current season based on actual date
  const determineCurrentSeason = (): Season => {
    // Use the current date from the system
    const now = new Date();
    const month = now.getMonth();
    
    // Special case for rainy season - June only
    if (month === 5) { // June (0-indexed months)
      return 'rainy';
    }
    // Summer: May, July, August
    else if (month === 4 || month === 6 || month === 7) {
      return 'summer';
    }
    // Spring: March, April
    else if (month === 2 || month === 3) {
      return 'spring';
    }
    // Fall: September, October, November
    else if (month === 8 || month === 9 || month === 10) {
      return 'fall';
    }
    // Winter: December, January, February
    else {
      return 'winter';
    }
  };

  // Different food categories for different seasons
  const getSeasonalCategories = (currentSeason: Season): {
    suitable: string[];
    unsuitable: string[];
  } => {
    switch (currentSeason) {
      case 'spring':
        return {
          suitable: ['fresh', 'light', 'green', 'salad', 'vegetable'],
          unsuitable: ['heavy', 'stew', 'soup', 'hot chocolate']
        };
      case 'summer':
        return {
          suitable: ['cold', 'fresh', 'refreshing', 'chilled', 'salad', 'ice cream', 'frozen', 'grill', 'bbq'],
          unsuitable: ['stew', 'soup', 'hot', 'heavy', 'warming']
        };
      case 'rainy':
        return {
          suitable: ['soup', 'hot', 'tea', 'coffee', 'stew', 'pakora', 'bhajji', 'samosa', 'warm', 'ginger', 'comfort'],
          unsuitable: ['ice cream', 'frozen', 'cold', 'chilled']
        };
      case 'fall':
        return {
          suitable: ['warm', 'spiced', 'pumpkin', 'apple', 'cinnamon', 'hearty', 'comfort'],
          unsuitable: ['ice cream', 'frozen', 'very cold']
        };
      case 'winter':
        return {
          suitable: ['hot', 'warm', 'soup', 'stew', 'hearty', 'comfort', 'roasted', 'baked'],
          unsuitable: ['ice cream', 'frozen', 'chilled', 'very cold']
        };
    }
  };

  const getSeasonalKeywords = (season: Season): string[] => {
    switch (season) {
      case 'spring':
        return ['asparagus', 'peas', 'mint', 'strawberry', 'spring greens', 'fresh', 'light'];
      case 'summer':
        return ['watermelon', 'tomato', 'corn', 'zucchini', 'berries', 'mango', 'cucumber', 'cold', 'refreshing', 'grill', 'bbq', 'light'];
      case 'fall':
        return ['pumpkin', 'apple', 'cinnamon', 'squash', 'cranberry', 'warm', 'spiced'];
      case 'winter':
        return ['root vegetable', 'potato', 'citrus', 'kale', 'brussels sprouts', 'hearty', 'warm', 'stew'];
      case 'rainy':
        return ['soup', 'hot', 'tea', 'coffee', 'stew', 'pakora', 'bhajji', 'samosa', 'warm', 'ginger', 'comfort'];
    }
  };

  const getSeasonIcon = (season: Season) => {
    switch (season) {
      case 'spring':
        return <CloudSun className="w-8 h-8 text-green-500" />;
      case 'summer':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'fall':
        return <CloudSun className="w-8 h-8 text-orange-500" />;
      case 'winter':
        return <Snowflake className="w-8 h-8 text-blue-400" />;
      case 'rainy':
        return <Umbrella className="w-8 h-8 text-blue-600" />;
    }
  };

  const getSeasonalIngredients = (season: Season): string[] => {
    switch (season) {
      case 'spring':
        return ['Asparagus', 'Peas', 'Strawberries', 'Mint', 'Spring Greens'];
      case 'summer':
        return ['Watermelon', 'Tomatoes', 'Corn', 'Zucchini', 'Mangoes', 'Berries', 'Cucumber', 'Yogurt'];
      case 'fall':
        return ['Pumpkin', 'Apples', 'Squash', 'Sweet Potatoes', 'Cranberries'];
      case 'winter':
        return ['Citrus Fruits', 'Root Vegetables', 'Winter Squash', 'Kale', 'Brussels Sprouts'];
      case 'rainy':
        return ['Ginger', 'Lentils', 'Onions', 'Garlic', 'Tea Leaves', 'Spices'];
    }
  };

  const getSeasonTitle = (season: Season): string => {
    switch (season) {
      case 'spring':
        return 'Spring';
      case 'summer':
        return 'Summer';
      case 'fall':
        return 'Fall';
      case 'winter':
        return 'Winter';
      case 'rainy':
        return 'Rainy Season';
    }
  };

  // Return truly seasonal recipes for the current season
  const getTrulySeasonalRecipes = (currentSeason: Season): Recipe[] => {
    const recipes = recipesData as Recipe[];
    const seasonalIngredients = getSeasonalIngredients(currentSeason);
    const categories = getSeasonalCategories(currentSeason);
    
    // Filter recipes to find those that use seasonal ingredients
    const seasonalRecipes = recipes.filter(recipe => {
      // Check if recipe has the explicit seasonal tag for current season
      if (recipe.seasonal && recipe.seasonal.includes(currentSeason)) {
        return true;
      }
      
      // If the recipe is explicitly tagged for other seasons only, exclude it
      if (recipe.seasonal && recipe.seasonal.length > 0 && !recipe.seasonal.includes(currentSeason)) {
        return false;
      }
      
      // Check if recipe contains any unsuitable keywords for this season
      const hasUnsuitable = categories.unsuitable.some(keyword => 
        recipe.name.toLowerCase().includes(keyword) || 
        recipe.description.toLowerCase().includes(keyword)
      );
      
      if (hasUnsuitable) {
        return false;
      }
      
      // Check if recipe contains in-season ingredients (PRIMARY FOCUS)
      const recipeIngredients = recipe.ingredients.map(ing => ing.item.toLowerCase());
      const hasSeasonalIngredient = seasonalIngredients.some(seasonalIng => 
        recipeIngredients.some(recipeIng => recipeIng.toLowerCase().includes(seasonalIng.toLowerCase()))
      );
      
      // If recipe has seasonal ingredients, prioritize it
      if (hasSeasonalIngredient) {
        return true;
      }
      
      // If it doesn't have seasonal ingredients but has suitable keywords, also include it
      const hasSuitable = categories.suitable.some(keyword => 
        recipe.name.toLowerCase().includes(keyword) || 
        recipe.description.toLowerCase().includes(keyword)
      );
      
      return hasSuitable;
    });
    
    // Sort recipes to prioritize those with most seasonal ingredients
    const sortedRecipes = seasonalRecipes.sort((a, b) => {
      const aIngredients = a.ingredients.map(ing => ing.item.toLowerCase());
      const bIngredients = b.ingredients.map(ing => ing.item.toLowerCase());
      
      // Count how many seasonal ingredients each recipe has
      const aSeasonalCount = seasonalIngredients.filter(seasonalIng => 
        aIngredients.some(aIng => aIng.includes(seasonalIng.toLowerCase()))
      ).length;
      
      const bSeasonalCount = seasonalIngredients.filter(seasonalIng => 
        bIngredients.some(bIng => bIng.includes(seasonalIng.toLowerCase()))
      ).length;
      
      // Sort by seasonal ingredient count (descending)
      return bSeasonalCount - aSeasonalCount;
    });
    
    // If we have no seasonal recipes at all, we need to provide some fallbacks
    if (sortedRecipes.length === 0) {
      // Add special seasonal fallback based on current season
      switch (currentSeason) {
        case 'summer':
          return [
            {
              id: 101,
              name: "Summer Watermelon Salad",
              description: "A refreshing summer salad with watermelon, feta, and mint.",
              image: "https://images.unsplash.com/photo-1563114773-84221bd62daa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
              ingredients: [
                { item: "Watermelon", quantity: 4, unit: "cups", category: "Fruits" },
                { item: "Feta Cheese", quantity: 1, unit: "cup", category: "Dairy" },
                { item: "Mint", quantity: 0.25, unit: "cup", category: "Vegetables" },
                { item: "Lime", quantity: 1, unit: "piece", category: "Fruits" },
                { item: "Olive Oil", quantity: 2, unit: "tablespoons", category: "Others" }
              ],
              steps: [
                { instruction: "Cut watermelon into cubes", timer: 0 },
                { instruction: "Combine all ingredients in a bowl", timer: 0 },
                { instruction: "Drizzle with olive oil and lime juice", timer: 0 },
                { instruction: "Chill before serving", timer: 900 }
              ],
              seasonal: ["summer"]
            }
          ];
        case 'winter':
          return [
            {
              id: 103,
              name: "Hearty Vegetable Soup",
              description: "A warming soup perfect for cold winter days.",
              image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
              ingredients: [
                { item: "Carrot", quantity: 2, unit: "medium", category: "Vegetables" },
                { item: "Potato", quantity: 2, unit: "medium", category: "Vegetables" },
                { item: "Onion", quantity: 1, unit: "medium", category: "Vegetables" },
                { item: "Celery", quantity: 2, unit: "stalks", category: "Vegetables" },
                { item: "Vegetable Broth", quantity: 6, unit: "cups", category: "Others" },
                { item: "Thyme", quantity: 1, unit: "teaspoon", category: "Spices" },
                { item: "Bay Leaf", quantity: 1, unit: "piece", category: "Spices" }
              ],
              steps: [
                { instruction: "Chop all vegetables into bite-sized pieces", timer: 0 },
                { instruction: "Heat oil in a large pot and sauté onions until translucent", timer: 300 },
                { instruction: "Add remaining vegetables and cook for 5 minutes", timer: 300 },
                { instruction: "Add broth, thyme, and bay leaf, bring to a boil", timer: 600 },
                { instruction: "Reduce heat and simmer until vegetables are tender", timer: 1200 },
                { instruction: "Season with salt and pepper to taste", timer: 0 }
              ],
              seasonal: ["winter"]
            }
          ];
        case 'rainy':
          return [
            {
              id: 102,
              name: "Masala Chai",
              description: "Warm, spiced tea perfect for rainy days.",
              image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
              ingredients: [
                { item: "Tea Leaves", quantity: 2, unit: "tablespoons", category: "Others" },
                { item: "Water", quantity: 2, unit: "cups", category: "Others" },
                { item: "Milk", quantity: 1, unit: "cup", category: "Dairy" },
                { item: "Cardamom", quantity: 4, unit: "pods", category: "Spices" },
                { item: "Cinnamon", quantity: 1, unit: "stick", category: "Spices" },
                { item: "Ginger", quantity: 1, unit: "inch", category: "Spices" },
                { item: "Sugar", quantity: 2, unit: "tablespoons", category: "Others" }
              ],
              steps: [
                { instruction: "Boil water with spices", timer: 300 },
                { instruction: "Add tea leaves and simmer", timer: 180 },
                { instruction: "Add milk and sugar, bring to a boil", timer: 180 },
                { instruction: "Strain and serve hot", timer: 0 }
              ],
              seasonal: ["rainy"]
            }
          ];
        case 'spring':
          return [
            {
              id: 104,
              name: "Spring Pea Risotto",
              description: "A bright, fresh risotto celebrating spring vegetables.",
              image: "https://images.unsplash.com/photo-1633352615955-f0c99e8b7e5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
              ingredients: [
                { item: "Arborio Rice", quantity: 1.5, unit: "cups", category: "Grains" },
                { item: "Fresh Peas", quantity: 1, unit: "cup", category: "Vegetables" },
                { item: "Asparagus", quantity: 1, unit: "bunch", category: "Vegetables" },
                { item: "Onion", quantity: 1, unit: "small", category: "Vegetables" },
                { item: "Vegetable Broth", quantity: 4, unit: "cups", category: "Others" },
                { item: "White Wine", quantity: 0.5, unit: "cup", category: "Others" },
                { item: "Parmesan Cheese", quantity: 0.5, unit: "cup", category: "Dairy" }
              ],
              steps: [
                { instruction: "Heat broth in a separate pot and keep warm", timer: 300 },
                { instruction: "Sauté diced onion in butter and oil until translucent", timer: 300 },
                { instruction: "Add rice and toast for 2 minutes", timer: 120 },
                { instruction: "Add wine and stir until absorbed", timer: 180 },
                { instruction: "Add broth 1/2 cup at a time, stirring until absorbed before adding more", timer: 1200 },
                { instruction: "Add peas and chopped asparagus in the last 5 minutes", timer: 300 },
                { instruction: "Stir in grated Parmesan and season to taste", timer: 60 }
              ],
              seasonal: ["spring"]
            }
          ];
        case 'fall':
          return [
            {
              id: 105,
              name: "Roasted Pumpkin Soup",
              description: "A comforting autumn soup with spiced pumpkin flavors.",
              image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
              ingredients: [
                { item: "Pumpkin", quantity: 4, unit: "cups", category: "Vegetables" },
                { item: "Onion", quantity: 1, unit: "medium", category: "Vegetables" },
                { item: "Garlic", quantity: 3, unit: "cloves", category: "Vegetables" },
                { item: "Vegetable Broth", quantity: 4, unit: "cups", category: "Others" },
                { item: "Cinnamon", quantity: 0.5, unit: "teaspoon", category: "Spices" },
                { item: "Nutmeg", quantity: 0.25, unit: "teaspoon", category: "Spices" },
                { item: "Cream", quantity: 0.5, unit: "cup", category: "Dairy" }
              ],
              steps: [
                { instruction: "Roast pumpkin chunks with oil, salt, and pepper until tender", timer: 1800 },
                { instruction: "Sauté diced onion and garlic until soft", timer: 300 },
                { instruction: "Add roasted pumpkin, spices, and broth", timer: 0 },
                { instruction: "Simmer for 15 minutes", timer: 900 },
                { instruction: "Blend until smooth and stir in cream", timer: 120 },
                { instruction: "Serve with toasted pumpkin seeds", timer: 0 }
              ],
              seasonal: ["fall"]
            }
          ];
        default:
          return [];
      }
    }
    
    return sortedRecipes.slice(0, 6);
  };

  // Find seasonal recipes completely independently from user-selected ingredients
  useEffect(() => {
    // For current date detection
    const currentSeason = determineCurrentSeason();
    setSeason(currentSeason);
    
    // Get truly seasonal recipes for the current season
    const seasonalRecipes = getTrulySeasonalRecipes(currentSeason);
    
    setRecommendedRecipes(seasonalRecipes);
  }, []);

  return (
    <Card className="border-2 border-plateup-orange mb-12 animate-fade-in">
      <CardHeader className="bg-plateup-orange/10">
        <div className="flex items-center gap-3">
          {getSeasonIcon(season)}
          <CardTitle className="text-2xl">
            {getSeasonTitle(season)} Special Recipes
          </CardTitle>
        </div>
        <div className="mt-2 text-sm">
          <p className="font-medium">In-season ingredients:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {getSeasonalIngredients(season).map((ingredient, index) => (
              <span key={index} className="bg-plateup-orange/20 px-2 py-1 rounded-full text-xs">
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {recommendedRecipes.length > 0 ? (
          <ScrollArea className="h-[500px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedRecipes.map(recipe => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  matchPercentage={100}
                  isSeasonal={true}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8">
            <p>No seasonal recipes available right now. Check back later!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SeasonalRecommendations;

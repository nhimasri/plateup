
export interface Ingredient {
  item: string;
  quantity: number;
  unit: string;
  category: string;
}

export interface Step {
  instruction: string;
  timer: number;
  appliance?: string;
  applianceSettings?: string;
  temperature?: number;
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  image: string;
  ingredients: Ingredient[];
  steps: Step[];
  cuisine?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  prepTime?: number;
  cookTime?: number;
  totalTime?: number;
  servings?: number;
  seasonal?: Season[];
  calories?: number;
}

export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'rainy';

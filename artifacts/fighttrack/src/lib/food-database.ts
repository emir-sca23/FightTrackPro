export interface FoodItem {
  name: string;
  calories: number;
  serving: string;
}

export const FOOD_DATABASE: FoodItem[] = [
  { name: "Chicken breast", calories: 165, serving: "100g" },
  { name: "Chicken thigh", calories: 209, serving: "100g" },
  { name: "Salmon", calories: 208, serving: "100g" },
  { name: "Tuna (canned in water)", calories: 132, serving: "100g" },
  { name: "Lean beef", calories: 250, serving: "100g" },
  { name: "Steak (sirloin)", calories: 271, serving: "100g" },
  { name: "Pork loin", calories: 242, serving: "100g" },
  { name: "Turkey breast", calories: 135, serving: "100g" },
  { name: "Egg (large)", calories: 78, serving: "1 egg" },
  { name: "Egg whites", calories: 17, serving: "1 white" },
  { name: "White rice (cooked)", calories: 206, serving: "1 cup" },
  { name: "Brown rice (cooked)", calories: 216, serving: "1 cup" },
  { name: "Quinoa (cooked)", calories: 222, serving: "1 cup" },
  { name: "Pasta (cooked)", calories: 220, serving: "1 cup" },
  { name: "Sweet potato", calories: 112, serving: "1 medium" },
  { name: "Potato (baked)", calories: 161, serving: "1 medium" },
  { name: "Oatmeal (cooked)", calories: 154, serving: "1 cup" },
  { name: "Bread slice (whole wheat)", calories: 81, serving: "1 slice" },
  { name: "Bagel", calories: 245, serving: "1 medium" },
  { name: "Banana", calories: 105, serving: "1 medium" },
  { name: "Apple", calories: 95, serving: "1 medium" },
  { name: "Orange", calories: 62, serving: "1 medium" },
  { name: "Berries (mixed)", calories: 84, serving: "1 cup" },
  { name: "Avocado", calories: 240, serving: "1 medium" },
  { name: "Broccoli", calories: 55, serving: "1 cup" },
  { name: "Spinach", calories: 7, serving: "1 cup" },
  { name: "Mixed salad", calories: 30, serving: "1 cup" },
  { name: "Greek yogurt (plain)", calories: 130, serving: "1 cup" },
  { name: "Cottage cheese", calories: 220, serving: "1 cup" },
  { name: "Milk (2%)", calories: 122, serving: "1 cup" },
  { name: "Almond milk", calories: 39, serving: "1 cup" },
  { name: "Cheese (cheddar)", calories: 113, serving: "28g" },
  { name: "Almonds", calories: 164, serving: "28g" },
  { name: "Peanut butter", calories: 188, serving: "2 tbsp" },
  { name: "Olive oil", calories: 119, serving: "1 tbsp" },
  { name: "Whey protein shake", calories: 120, serving: "1 scoop" },
  { name: "Protein bar", calories: 200, serving: "1 bar" },
  { name: "Lentils (cooked)", calories: 230, serving: "1 cup" },
  { name: "Black beans (cooked)", calories: 227, serving: "1 cup" },
  { name: "Tofu", calories: 76, serving: "100g" },
  { name: "Pizza slice", calories: 285, serving: "1 slice" },
  { name: "Burger", calories: 354, serving: "1 burger" },
  { name: "Fries", calories: 365, serving: "medium" },
  { name: "Coffee (black)", calories: 2, serving: "1 cup" },
  { name: "Orange juice", calories: 112, serving: "1 cup" },
  { name: "Energy drink", calories: 110, serving: "1 can" },
  { name: "Beer", calories: 153, serving: "12 oz" },
];

export function searchFoods(query: string, limit = 8): FoodItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const starts: FoodItem[] = [];
  const includes: FoodItem[] = [];
  for (const food of FOOD_DATABASE) {
    const n = food.name.toLowerCase();
    if (n.startsWith(q)) starts.push(food);
    else if (n.includes(q)) includes.push(food);
    if (starts.length >= limit) break;
  }
  return [...starts, ...includes].slice(0, limit);
}

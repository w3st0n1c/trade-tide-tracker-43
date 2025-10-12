import { Item, items } from "@/data/items";

interface TradeItem {
  item: Item;
  quantity: number;
}

// Get recommendations based on tier, category, and trade value balance
export function getItemRecommendations(
  currentItems: TradeItem[],
  isYourOffer: boolean,
  otherSideItems: TradeItem[] = [],
  limit: number = 3
): Item[] {
  // If no items selected on either side, return empty array
  if (currentItems.length === 0 && isYourOffer) {
    return [];
  }
  
  // If no items in "their offer", don't show recommendations for "your offer"
  if (isYourOffer && otherSideItems.length === 0) {
    return [];
  }

  // Calculate current value of both sides
  const currentTotalValue = currentItems.reduce((sum, item) => sum + (item.item.value * item.quantity), 0);
  const otherTotalValue = otherSideItems.reduce((sum, item) => sum + (item.item.value * item.quantity), 0);
  
  // Calculate value difference
  const valueDifference = isYourOffer ? otherTotalValue - currentTotalValue : currentTotalValue - otherTotalValue;
  
  // Get the average tier and most common category from current items
  const tiers = currentItems.map(t => t.item.tier);
  const categories = currentItems.map(t => t.item.category);
  
  // Convert tiers to numeric values for calculation
  const tierValues: { [key: string]: number } = {
    "SS": 6, "S": 5, "A": 4, "B": 3, "C": 2, "D": 1, "F": 0
  };
  
  const avgTierValue = tiers.length > 0 
    ? tiers.reduce((sum, tier) => sum + tierValues[tier], 0) / tiers.length
    : 3; // Default to middle tier if no items
  
  // Find the most common category
  const categoryCounts: { [key: string]: number } = {};
  categories.forEach(cat => {
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  
  const mostCommonCategory = categories.length > 0
    ? Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0]
    : "boat"; // Default category if none exists
  
  // Convert average tier value back to tier letter
  const targetTierValues = Object.entries(tierValues)
    .sort((a, b) => Math.abs(Number(a[1]) - avgTierValue) - Math.abs(Number(b[1]) - avgTierValue))
    .slice(0, 3)
    .map(entry => entry[0]);
  
  // Filter recommendations based on trade balance
  const recommendations = items.filter(item => {
    // Don't recommend items already in the trade (either side)
    if (currentItems.some(t => t.item.name === item.name) || 
        otherSideItems.some(t => t.item.name === item.name)) {
      return false;
    }
    
    // Filter by similar tier and category
    const isSimilarTier = targetTierValues.includes(item.tier);
    const isSameCategory = item.category === mostCommonCategory;
    
    if (isYourOffer) {
      // For your offer, recommend items that would balance the trade
      // If their offer is worth more, suggest higher value items
      // If their offer is worth less, suggest lower value items
      if (valueDifference > 0) {
        // Their offer is worth less, suggest lower value items
        return (item.value <= valueDifference * 1.2) && 
               (isSimilarTier || tierValues[item.tier] <= avgTierValue) && 
               (isSameCategory || Math.random() > 0.6);
      } else {
        // Their offer is worth more, suggest higher value items
        return (item.value >= Math.abs(valueDifference) * 0.8) && 
               (isSimilarTier || tierValues[item.tier] >= avgTierValue) && 
               (isSameCategory || Math.random() > 0.6);
      }
    } else {
      // For their offer, recommend items that would balance the trade
      // If your offer is worth more, suggest higher value items
      // If your offer is worth less, suggest lower value items
      if (valueDifference > 0) {
        // Your offer is worth more, suggest higher value items
        return (item.value >= valueDifference * 0.8) && 
               (isSimilarTier || tierValues[item.tier] >= avgTierValue) && 
               (isSameCategory || Math.random() > 0.6);
      } else {
        // Your offer is worth less, suggest lower value items
        return (item.value <= Math.abs(valueDifference) * 1.2) && 
               (isSimilarTier || tierValues[item.tier] <= avgTierValue) && 
               (isSameCategory || Math.random() > 0.6);
      }
    }
  });
  
  // Sort by how well they balance the trade
  return recommendations
    .sort((a, b) => {
      if (isYourOffer) {
        if (valueDifference > 0) {
          // Their offer is worth less, sort by ascending value (smaller items first)
          return a.value - b.value;
        } else {
          // Their offer is worth more, sort by descending value (bigger items first)
          return b.value - a.value;
        }
      } else {
        if (valueDifference > 0) {
          // Your offer is worth more, sort by descending value (bigger items first)
          return b.value - a.value;
        } else {
          // Your offer is worth less, sort by ascending value (smaller items first)
          return a.value - b.value;
        }
      }
    })
    .slice(0, limit);
}
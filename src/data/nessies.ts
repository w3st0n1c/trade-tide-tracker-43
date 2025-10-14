export interface NessieItem {
  name: string;
  mutation: string;
  appraised: boolean;
  value: string;
  weight: string;
  category: string;
}

export const nessies: NessieItem[] = [
  // Basic Nessies
  { name: "Nessie", mutation: "No Mutation", appraised: false, value: "7 nessies", weight: "N/A", category: "basic" },
  { name: "Nessie", mutation: "No Mutation", appraised: true, value: "1 nessie", weight: "N/A", category: "basic" },
  { name: "Nessie", mutation: "No Mutation", appraised: true, value: "3 exalted relics", weight: "N/A", category: "basic" },
  { name: "Nessie", mutation: "Big", appraised: false, value: "14 nessies", weight: "4k+ kg", category: "basic" },
  { name: "Nessie", mutation: "Giant", appraised: false, value: "200 nessies", weight: "8k+ kg", category: "basic" },
  { name: "Nessie", mutation: "Giant", appraised: false, value: "250 nessies", weight: "8.5k+ kg", category: "basic" },
  { name: "Nessie", mutation: "Giant", appraised: false, value: "300 nessies", weight: "9k+ kg", category: "basic" },

  // Limited Mutations
  { name: "Nessie", mutation: "Jolly", appraised: true, value: "15 nessies", weight: "N/A", category: "limited" },
  { name: "Nessie", mutation: "Festive", appraised: true, value: "20 nessies", weight: "N/A", category: "limited" },
  { name: "Nessie", mutation: "Minty", appraised: true, value: "50 nessies", weight: "N/A", category: "limited" },
  { name: "Nessie", mutation: "Sinister", appraised: true, value: "50 nessies", weight: "N/A", category: "limited" },
  { name: "Nessie", mutation: "Ghastly", appraised: true, value: "50 nessies", weight: "N/A", category: "limited" },
  { name: "Nessie", mutation: "Awesome", appraised: true, value: "50 nessies", weight: "N/A", category: "limited" },
  { name: "Nessie", mutation: "Beachy", appraised: true, value: "20 nessies", weight: "N/A", category: "limited" },
  { name: "Nessie", mutation: "Summer", appraised: true, value: "15 nessies", weight: "N/A", category: "limited" },
  { name: "Nessie", mutation: "Popsicle", appraised: true, value: "20 nessies", weight: "N/A", category: "limited" },
  { name: "Nessie", mutation: "Patriotic", appraised: true, value: "40 nessies", weight: "N/A", category: "limited" },
  { name: "Nessie", mutation: "Sinister", appraised: false, value: "65 nessies", weight: "2k kg", category: "limited" },
  { name: "Nessie", mutation: "Ghastly", appraised: false, value: "65 nessies", weight: "2k kg", category: "limited" },
  { name: "Nessie", mutation: "Sinister", appraised: false, value: "110 nessies", weight: "2k+ kg", category: "limited" },
  { name: "Nessie", mutation: "Ghastly", appraised: false, value: "110 nessies", weight: "2k+ kg", category: "limited" },

  // Big Limited Mutations
  { name: "Nessie", mutation: "Jolly + Big", appraised: true, value: "20 nessies", weight: "N/A", category: "big_limited" },
  { name: "Nessie", mutation: "Festive + Big", appraised: true, value: "30 nessies", weight: "N/A", category: "big_limited" },
  { name: "Nessie", mutation: "Minty + Big", appraised: true, value: "60 nessies", weight: "N/A", category: "big_limited" },
  { name: "Nessie", mutation: "Sinister + Big", appraised: true, value: "60 nessies", weight: "N/A", category: "big_limited" },
  { name: "Nessie", mutation: "Ghastly + Big", appraised: true, value: "60 nessies", weight: "N/A", category: "big_limited" },
  { name: "Nessie", mutation: "Awesome + Big", appraised: true, value: "60 nessies", weight: "N/A", category: "big_limited" },
  { name: "Nessie", mutation: "Beachy + Big", appraised: true, value: "30 nessies", weight: "N/A", category: "big_limited" },
  { name: "Nessie", mutation: "Summer + Big", appraised: true, value: "25 nessies", weight: "N/A", category: "big_limited" },
  { name: "Nessie", mutation: "Popsicle + Big", appraised: true, value: "30 nessies", weight: "N/A", category: "big_limited" },
  { name: "Nessie", mutation: "Sinister + Big", appraised: false, value: "250 nessies", weight: "N/A", category: "big_limited" },
  { name: "Nessie", mutation: "Ghastly + Big", appraised: false, value: "250 nessies", weight: "N/A", category: "big_limited" },

  // Giant Limited Mutations
  { name: "Nessie", mutation: "Jolly + Giant", appraised: true, value: "200 nessies", weight: "N/A", category: "giant_limited" },
  { name: "Nessie", mutation: "Festive + Giant", appraised: true, value: "350 nessies", weight: "N/A", category: "giant_limited" },
  { name: "Nessie", mutation: "Minty + Giant", appraised: true, value: "1000 nessies", weight: "N/A", category: "giant_limited" },
  { name: "Nessie", mutation: "Sinister + Giant", appraised: true, value: "1200 nessies", weight: "N/A", category: "giant_limited" },
  { name: "Nessie", mutation: "Ghastly + Giant", appraised: true, value: "1200 nessies", weight: "N/A", category: "giant_limited" },
  { name: "Nessie", mutation: "Awesome + Giant", appraised: true, value: "O/C (owner's choice)", weight: "N/A", category: "giant_limited" },
  { name: "Nessie", mutation: "Beachy + Giant", appraised: true, value: "O/C (owner's choice)", weight: "N/A", category: "giant_limited" },
  { name: "Nessie", mutation: "Summer + Giant", appraised: true, value: "250 nessies", weight: "N/A", category: "giant_limited" },
  { name: "Nessie", mutation: "Popsicle + Giant", appraised: true, value: "O/C (owner's choice)", weight: "N/A", category: "giant_limited" },
  { name: "Nessie", mutation: "Sinister + Giant", appraised: false, value: "O/C (owner's choice)", weight: "N/A", category: "giant_limited" },
  { name: "Nessie", mutation: "Ghastly + Giant", appraised: false, value: "O/C (owner's choice)", weight: "N/A", category: "giant_limited" },

  // S/S Attributes
  { name: "Nessie", mutation: "Sparkling", appraised: true, value: "1 nessie", weight: "N/A", category: "ss_attributes" },
  { name: "Nessie", mutation: "Shiny", appraised: true, value: "1 nessie", weight: "N/A", category: "ss_attributes" },
  { name: "Nessie", mutation: "Shiny + Sparkling", appraised: true, value: "1 nessie", weight: "N/A", category: "ss_attributes" },
  { name: "Nessie", mutation: "Sparkling", appraised: false, value: "90 nessies", weight: "N/A", category: "ss_attributes" },
  { name: "Nessie", mutation: "Shiny", appraised: false, value: "90 nessies", weight: "N/A", category: "ss_attributes" },
  { name: "Nessie", mutation: "Shiny + Sparkling", appraised: false, value: "O/C (est. 700+ nessies)", weight: "N/A", category: "ss_attributes" },

  // Unappraised Mutations
  { name: "Nessie", mutation: "Atlantean", appraised: false, value: "15 nessies", weight: "2k+ kg", category: "unappraised" },
  { name: "Nessie", mutation: "Translucent", appraised: false, value: "20 nessies", weight: "2k kg", category: "unappraised" },
  { name: "Nessie", mutation: "Translucent", appraised: false, value: "30 nessies", weight: "2k+ kg", category: "unappraised" },
  { name: "Nessie", mutation: "Negative", appraised: false, value: "20 nessies", weight: "2k kg", category: "unappraised" },
  { name: "Nessie", mutation: "Negative", appraised: false, value: "40 nessies", weight: "2k+ kg", category: "unappraised" },
  { name: "Nessie", mutation: "Albino", appraised: false, value: "20 nessies", weight: "2k kg", category: "unappraised" },
  { name: "Nessie", mutation: "Albino", appraised: false, value: "40 nessies", weight: "2k+ kg", category: "unappraised" },
  { name: "Nessie", mutation: "Darkened", appraised: false, value: "20 nessies", weight: "2k kg", category: "unappraised" },
  { name: "Nessie", mutation: "Darkened", appraised: false, value: "40 nessies", weight: "2k+ kg", category: "unappraised" },
  { name: "Nessie", mutation: "Glossy", appraised: false, value: "25 nessies", weight: "2k kg", category: "unappraised" },
  { name: "Nessie", mutation: "Glossy", appraised: false, value: "45 nessies", weight: "2k+ kg", category: "unappraised" },
  { name: "Nessie", mutation: "Silver", appraised: false, value: "25 nessies", weight: "2k kg", category: "unappraised" },
  { name: "Nessie", mutation: "Silver", appraised: false, value: "45 nessies", weight: "2k+ kg", category: "unappraised" },
  { name: "Nessie", mutation: "Electric", appraised: false, value: "30 nessies", weight: "2k kg", category: "unappraised" },
  { name: "Nessie", mutation: "Electric", appraised: false, value: "50 nessies", weight: "2k+ kg", category: "unappraised" },
  { name: "Nessie", mutation: "Frozen", appraised: false, value: "30 nessies", weight: "2k kg", category: "unappraised" },
  { name: "Nessie", mutation: "Frozen", appraised: false, value: "50 nessies", weight: "2k+ kg", category: "unappraised" },
  { name: "Nessie", mutation: "Mythical", appraised: false, value: "6 nessies", weight: "2k kg", category: "unappraised" },
  { name: "Nessie", mutation: "Mythical", appraised: false, value: "50 nessies", weight: "2k+ kg", category: "unappraised" },
  { name: "Nessie", mutation: "Midas", appraised: false, value: "75 nessies", weight: "2k kg", category: "unappraised" },
  { name: "Nessie", mutation: "Midas", appraised: false, value: "200 nessies", weight: "2k+ kg", category: "unappraised" },

  // Unappraised Big Mutations
  { name: "Nessie", mutation: "Atlantean + Big", appraised: false, value: "40 nessies", weight: "<6k kg", category: "unappraised_big" },
  { name: "Nessie", mutation: "Atlantean + Big", appraised: false, value: "O/C (owner's choice)", weight: "6k+ kg", category: "unappraised_big" },
  { name: "Nessie", mutation: "Translucent + Big", appraised: false, value: "50 nessies", weight: "N/A", category: "unappraised_big" },
  { name: "Nessie", mutation: "Negative + Big", appraised: false, value: "80 nessies", weight: "N/A", category: "unappraised_big" },
  { name: "Nessie", mutation: "Albino + Big", appraised: false, value: "80 nessies", weight: "N/A", category: "unappraised_big" },
  { name: "Nessie", mutation: "Darkened + Big", appraised: false, value: "80 nessies", weight: "N/A", category: "unappraised_big" },
  { name: "Nessie", mutation: "Glossy + Big", appraised: false, value: "85 nessies", weight: "N/A", category: "unappraised_big" },
  { name: "Nessie", mutation: "Silver + Big", appraised: false, value: "85 nessies", weight: "N/A", category: "unappraised_big" },
  { name: "Nessie", mutation: "Electric + Big", appraised: false, value: "100 nessies", weight: "N/A", category: "unappraised_big" },
  { name: "Nessie", mutation: "Frozen + Big", appraised: false, value: "100 nessies", weight: "N/A", category: "unappraised_big" },
  { name: "Nessie", mutation: "Mythical + Big", appraised: false, value: "200 nessies", weight: "N/A", category: "unappraised_big" },
  { name: "Nessie", mutation: "Midas + Big", appraised: false, value: "600 nessies", weight: "N/A", category: "unappraised_big" },

  // Unappraised Giant Mutations
  { name: "Nessie", mutation: "Atlantean + Giant", appraised: false, value: "O/C (owner's choice)", weight: "N/A", category: "unappraised_giant" },
  { name: "Nessie", mutation: "Translucent + Giant", appraised: false, value: "O/C (owner's choice)", weight: "N/A", category: "unappraised_giant" },
  { name: "Nessie", mutation: "Negative + Giant", appraised: false, value: "4000 nessies", weight: "N/A", category: "unappraised_giant" },
  { name: "Nessie", mutation: "Albino + Giant", appraised: false, value: "O/C (owner's choice)", weight: "N/A", category: "unappraised_giant" },
  { name: "Nessie", mutation: "Darkened + Giant", appraised: false, value: "O/C (owner's choice)", weight: "N/A", category: "unappraised_giant" },
  { name: "Nessie", mutation: "Glossy + Giant", appraised: false, value: "4000 nessies", weight: "N/A", category: "unappraised_giant" },
  { name: "Nessie", mutation: "Silver + Giant", appraised: false, value: "O/C (owner's choice)", weight: "N/A", category: "unappraised_giant" },
  { name: "Nessie", mutation: "Electric + Giant", appraised: false, value: "5000 nessies", weight: "N/A", category: "unappraised_giant" },
  { name: "Nessie", mutation: "Frozen + Giant", appraised: false, value: "5000 nessies", weight: "N/A", category: "unappraised_giant" },
  { name: "Nessie", mutation: "Mythical + Giant", appraised: false, value: "O/C (owner's choice)", weight: "N/A", category: "unappraised_giant" },
  { name: "Nessie", mutation: "Midas + Giant", appraised: false, value: "O/C (owner's choice)", weight: "N/A", category: "unappraised_giant" },

  // Unappraised S/S Mutations
  { name: "Nessie", mutation: "Atlantean + Sparkling", appraised: false, value: "600 nessies", weight: "N/A", category: "unappraised_ss" },
  { name: "Nessie", mutation: "Atlantean + Shiny", appraised: false, value: "600 nessies", weight: "N/A", category: "unappraised_ss" },
  { name: "Nessie", mutation: "Translucent + Sparkling", appraised: false, value: "600 nessies", weight: "N/A", category: "unappraised_ss" },
  { name: "Nessie", mutation: "Translucent + Shiny", appraised: false, value: "600 nessies", weight: "N/A", category: "unappraised_ss" },
  { name: "Nessie", mutation: "Negative + Sparkling", appraised: false, value: "900 nessies", weight: "N/A", category: "unappraised_ss" },
  { name: "Nessie", mutation: "Negative + Shiny", appraised: false, value: "900 nessies", weight: "N/A", category: "unappraised_ss" },
  { name: "Nessie", mutation: "Albino + Sparkling", appraised: false, value: "900 nessies", weight: "N/A", category: "unappraised_ss" },
  { name: "Nessie", mutation: "Albino + Shiny", appraised: false, value: "900 nessies", weight: "N/A", category: "unappraised_ss" },
  { name: "Nessie", mutation: "Darkened + Sparkling", appraised: false, value: "900 nessies", weight: "N/A", category: "unappraised_ss" },
];

export const getCategoryName = (category: string): string => {
  const categoryNames: { [key: string]: string } = {
    basic: "🦕 Basic Nessies",
    limited: "✨ Limited Mutations",
    big_limited: "🔥 Big Limited Mutations",
    giant_limited: "💎 Giant Limited Mutations",
    ss_attributes: "⭐ S/S Attributes",
    unappraised: "❓ Unappraised Mutations",
    unappraised_big: "❓🔥 Unappraised Big Mutations",
    unappraised_giant: "❓💎 Unappraised Giant Mutations",
    unappraised_ss: "❓⭐ Unappraised S/S Mutations",
  };
  return categoryNames[category] || category;
};

export const getCategoryColor = (category: string): string => {
  const categoryColors: { [key: string]: string } = {
    basic: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    limited: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    big_limited: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    giant_limited: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    ss_attributes: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    unappraised: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    unappraised_big: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    unappraised_giant: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    unappraised_ss: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  };
  return categoryColors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
};
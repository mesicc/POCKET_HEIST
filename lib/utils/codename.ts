const ADJECTIVES = [
  "Swift",
  "Silent",
  "Bold",
  "Quick",
  "Clever",
  "Sly",
  "Phantom",
  "Shadow",
  "Daring",
  "Lucky",
  "Fierce",
  "Nimble",
  "Rogue",
  "Masked",
  "Stealthy",
  "Crafty",
  "Sneaky",
  "Bright",
  "Wild",
  "Mighty",
];

const COLORS = [
  "Crimson",
  "Azure",
  "Violet",
  "Golden",
  "Silver",
  "Obsidian",
  "Scarlet",
  "Emerald",
  "Amber",
  "Ivory",
  "Cobalt",
  "Jade",
  "Ruby",
  "Onyx",
  "Copper",
  "Indigo",
  "Coral",
  "Pearl",
  "Bronze",
  "Teal",
];

const NOUNS = [
  "Falcon",
  "Fox",
  "Wolf",
  "Raven",
  "Tiger",
  "Viper",
  "Panther",
  "Hawk",
  "Lynx",
  "Otter",
  "Badger",
  "Cobra",
  "Eagle",
  "Jaguar",
  "Owl",
  "Ferret",
  "Puma",
  "Heron",
  "Wren",
  "Mink",
];

function pick(words: readonly string[]): string {
  return words[Math.floor(Math.random() * words.length)];
}

export function generateCodename(): string {
  return `${pick(ADJECTIVES)}${pick(COLORS)}${pick(NOUNS)}`;
}

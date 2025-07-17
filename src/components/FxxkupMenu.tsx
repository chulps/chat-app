import React, { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import fxxkupLogo from "../images/fxxkup_logo.svg";
import TranslationWrapper from "./TranslationWrapper";
import { useLanguage } from "../contexts/LanguageContext";
import Tabs, { Tab } from "./Tabs";
import { translateText } from "../utils/translate";

/* ------------------------------------------------------------------ *
 * Styles
 * ------------------------------------------------------------------ */

const FxxkupMenuWrapper = styled.div`
  width: calc(100vw - var(--space-3));
  max-width: 1200px;
  margin: 0 auto;
`;

/* Horizontal scroll JUST for the tab row */
const MenuTabsHeader = styled.div`
  margin-block: var(--space-4) var(--space-2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  overflow-x: auto;
  padding-bottom: var(--space-1); /* room for scrollbar */
`;

/* Vertical content region (panels) */
const MenuContentWrapper = styled.div`
  width: 100%;
  overflow-x: hidden;
`;

const MasonryContainer = styled.div`
  column-count: 1;
  column-gap: var(--space-3);

  @media (min-width: 576px) {
    column-count: 2;
  }

  @media (min-width: 992px) {
    column-count: 3;
  }
`;

const MasonryItem = styled.div`
  display: inline-block;
  width: 100%;
  margin-bottom: var(--space-3);
  break-inside: avoid;
  background-color: var(--neutral-800);
  padding: var(--space-2);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const CategoryTitle = styled.h3`
  margin-bottom: var(--space-2);
  border-bottom: 1px solid var(--neutral-500);
  padding-bottom: var(--space-1);
`;

const SubCategoryTitle = styled.label`
  color: var(--danger-500);
  margin-top: var(--space-3);
  border-bottom: 1px solid var(--neutral-500);
`;

const MenuItem = styled.div`
  margin-bottom: var(--space-2);
  display: flex;
  justify-content: space-between;
  height: fit-content;
`;

const MenuItemName = styled.p`
  font-weight: bold;
`;

const MenuItemPrice = styled.data`
  font-weight: bold;
`;

const MenuItemDescription = styled.div`
  font-style: italic;
  font-family: "Roboto Serif", serif;
  font-size: var(--font-size-small);
`;

const MenuTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  gap: var(--space-2);
  margin-block: var(--space-4);
`;

const MenuLogo = styled.img`
  width: 100%;
  max-width: var(--space-6);
  filter: drop-shadow(0 0 0.75rem rgba(255, 255, 255, 0.5));
`;

const Subhead = styled.h3`
  background: var(--danger-500);
  color: white;
  border-radius: var(--space-1);
  padding: var(--space-1);
  text-align: center;
`;

const English = styled.small`
  color: var(--neutral-300);
  font-weight: normal;
  display: block;
`;

const CategoryDescription = styled.p`
  margin-bottom: var(--space-1);
`;

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

interface MenuItemData {
  name: string;
  price: number | string;
  description?: string;
}

interface MenuSubcategory {
  subCategory: string;
  items: MenuItemData[];
}

interface MenuCategory {
  category: string;
  items?: MenuItemData[];
  subcategories?: MenuSubcategory[];
  categoryDescription?: string;
}

/* ------------------------------------------------------------------ *
 * Updated Menu Data
 * ------------------------------------------------------------------ */

const menuData: MenuCategory[] = [
  /* -------------------------------------------------------------- */
  /* Popular in Japan                                               */
  /* -------------------------------------------------------------- */
  {
    category: "Popular in Japan",
    items: [
      {
        name: "Oolong-hai",
        description:
          "Oolong tea and Japanese shochu served over ice in a highball glass.",
        price: 600,
      },
      {
        name: "Jasmine-hai",
        description:
          "Jasmine tea and Japanese shochu served over ice in a highball glass.",
        price: 600,
      },
      {
        name: "Green Tea-hai",
        description:
          "Refreshing green tea and Japanese shochu served over ice in a highball glass.",
        price: 600,
      },
      { name: "Lemon Sour", description: "A tangy lemon drink with bubbles.", price: 700 },
      { name: "Otoko Ume Sour", price: 700 },
      {
        name: "Kaku Highball",
        description:
          "Japan's most popular highball with Suntory Whisky and soda over ice.",
        price: 700,
      },
      { name: "Plum Wine", description: "Sweet and fruity plum wine.", price: 700 },
      { name: "Cassis Soda", description: "Sweet cassis, fizzy soda.", price: 700 },
      { name: "Cassis Oolong", description: "Cassis + oolong tea.", price: 700 },
      { name: "Peach Soda", price: 700 },
      { name: "Peach Oolong", price: 700 },
      { name: "Cassis Ginger Ale", price: 700 },
      { name: "Peach Ginger Ale", price: 700 },
      {
        name: "Gin & Tonic",
        description:
          "Classic mix of gin and tonic water over ice with citrus garnish.",
        price: 800,
      },
      { name: "Peach Orange", price: 800 },
      {
        name: "Fuzzy Navel",
        description: "A sweet blend of peach liqueur and orange juice.",
        price: 800,
      },
      {
        name: "Cassis Orange",
        description: "Cassis liqueur and orange juice.",
        price: 800,
      },
      {
        name: "Rum & Coke",
        description: "White rum and Coca-cola.",
        price: 800,
      },
      {
        name: "Jack & Coke",
        description: "Jack Daniel's and Coca-cola.",
        price: 800,
      },
      {
        name: "Moscow Mule",
        description: "Vodka and ginger ale with fresh lime wedge.",
        price: 800,
      },
      {
        name: "Jagerbomb",
        description: "Energy drink + Jägermeister.",
        price: 1000,
      },
      { name: "Cocabomb", 
        description: "Cocarelo and Redbull",
        price: 1200 },
    ],
  },

  /* -------------------------------------------------------------- */
  /* Softdrinks                                                     */
  /* -------------------------------------------------------------- */
  {
    category: "Softdrinks",
    items: [
      { name: "Green Tea", price: 600 },
      { name: "Jasmine Tea", price: 600 },
      { name: "Oolong Tea", price: 600 },
      { name: "Ginger Ale", price: 600 },
      { name: "Orange Juice", price: 600 },
      { name: "Pineapple Juice", price: 600 },
      { name: "Coca-cola", price: 600 },
      { name: "Red Bull", price: 700 },
    ],
  },

  /* -------------------------------------------------------------- */
  /* Beer                                                           */
  /* -------------------------------------------------------------- */
  {
    category: "Beer",
    items: [
      {
        name: "Asahi (330mL bottle)",
        description: "Japan's most popular beer.",
        price: 700,
      },
      { name: "Suntory (330mL can)", price: 700 },
      { name: "Orion (330mL can)", description: "From Okinawa.", price: 800 },
      {
        name: "Corona Extra (330mL bottle)",
        description: "Served with a lime wedge.",
        price: 900,
      },
      { name: "Heineken (330mL bottle)", description: "From Holland.", price: 900 },
      {
        name: "Sapporo Classic Pint (500mL bottle)",
        description: "The Local Champion.",
        price: 1000,
      },
    ],
  },

  /* -------------------------------------------------------------- */
  /* Japanese Whiskey (subcategories)                               */
  /* -------------------------------------------------------------- */
  {
    category: "Japanese Whiskey",
    subcategories: [
      {
        subCategory: "Nikka",
        items: [
          { name: "Nikka Frontier", price: 800 },
          { name: "Nikka Session", price: 900 },
          { name: "Nikka Days", price: 1000 },
          { name: "Caffey Grain", price: 1100 },
          { name: "Nikka From the Barrel", price: 1100 },
          { name: "Pure Malt Black Distillery Limited", price: 1300 },
          { name: "Pure Malt Red Distillery Limited", price: 1300 },
          { name: "The Nikka Tailored", price: 1400 },
        ],
      },
      {
        subCategory: "Miyagikyo",
        items: [{ name: "Miyagikyo", price: 1200 }],
      },
      {
        subCategory: "Taketsuru",
        items: [
          { name: "Taketsuru", price: 1300 },
          { name: "Taketsuru Black Label", price: 1500 },
          { name: "Taketsuru 17 Year", price: 5000 },
        ],
      },
      {
        subCategory: "Yoichi",
        items: [
          { name: "Yoichi", price: 1200 },
          { name: "Yoichi Distillery Limited Blended Whiskey", price: 1300 },
          { name: "Yoichi 10 Year", price: 2800 },
          { name: "Yoichi 12 Year", price: 6000 },
        ],
      },
      {
        subCategory: "Suntory",
        items: [
          { name: "Special Reserve", price: 800 },
          { name: "Chita", price: 1100 },
          { name: "Hibiki Japanese Harmony", price: 1500 },
          { name: "Hibiki Blender’s Choice", price: 2300 },
          { name: "Hibiki blossom Harmony 2025", price: 2500 },
          { name: "Hibiki 12 Year", price: 5000 },
          { name: "Hibiki 17 Year", price: 6000 },
          { name: "Hibiki 21 Year", price: 8000 },
        ],
      },
      {
        subCategory: "Hakushu",
        items: [
          { name: "Hakushu", price: 1500 },
          { name: "Hakushu SOD 2024 (Limited Edition)", price: 2800 },
          { name: "Hakushu SOD 2025 (Limited Edition)", price: 2800 },
          { name: "Hakushu Japanese Forest Bittersweet", price: 3300 },
          { name: "Hakushu 12 Year", price: 2800 },
          { name: "Hakushu 18 Year", price: 8000 },
        ],
      },
      {
        subCategory: "Yamazaki",
        items: [
          { name: "Yamazaki", price: 1500 },
          { name: "Yamazaki SOD 2024 (Limited Edition)", price: 2800 },
          { name: "Yamazaki 12 Year", price: 2800 },
          { name: "Yamazaki 18 Year", price: 10000 },
        ],
      },
      {
        subCategory: "Other",
        items: [
          { name: "Ichiro’s Malt White Label", price: 1000 },
          { name: "Ichiro’s Malt Classical Edition", price: 1200 },
          { name: "Ichiro’s Malt Mizunara Wood Reserve", price: 1500 },
          { name: "Sakurao", price: 1200 },
          { name: "Fuji Single Malt", price: 1200 },
          { name: "Yamazakura Asaka", price: 1800 },
          { name: "Akkeshi Rikka", price: 3300 },
        ],
      },
    ],
  },

  /* -------------------------------------------------------------- */
  /* Bourbon                                                         */
  /* -------------------------------------------------------------- */
  {
    category: "Bourbon",
    items: [
      {
        name: "Jim Beam",
        description:
          "A classic bourbon known for its smoothness and hints of vanilla.",
        price: 700,
      },
      {
        name: "Four Roses",
        description:
          "A unique blend of 10 distinct bourbon recipes; rich & fruity.",
        price: 700,
      },
      {
        name: "Maker’s Mark",
        description:
          "Premium bourbon with a sweet profile; iconic red wax seal.",
        price: 900,
      },
      {
        name: "Bulleit",
        description: "High-rye bourbon with a bold, spicy character.",
        price: 900,
      },
      {
        name: "Woodford Reserve",
        description:
          "Small-batch bourbon with dried fruit & vanilla notes.",
        price: 1000,
      },
      { name: "I.W. Harper 12 Year", price: 1300 },
    ],
  },

  /* -------------------------------------------------------------- */
  /* Irish Whiskey                                                   */
  /* -------------------------------------------------------------- */
  {
    category: "Irish Whiskey",
    items: [
      {
        name: "Jameson",
        description: "Smooth and versatile; great for sipping or mixing.",
        price: 800,
      },
      { name: "Bushmills Black Bush", price: 800 },
      { name: "Busker", price: 800 },
      { name: "Pogues Triple Distilled & Matured", price: 800 },
      { name: "Pogues Single Malt", price: 800 },
      { name: "Connemara", price: 1000 },
      { name: "Green Spot", price: 1100 },
    ],
  },

  /* -------------------------------------------------------------- */
  /* Scotch (subcategories)                                          */
  /* -------------------------------------------------------------- */
  {
    category: "Scotch",
    subcategories: [
      {
        subCategory: "Speyside",
        items: [
          { name: "Singleton 12 year", price: 900 },
          { name: "Ballantine 12 Year", price: 1000 },
          { name: "GlenGrant 10 Year", price: 1000 },
          { name: "Glenlivet 12 Year", price: 1000 },
          {
            name: "Glenlivet 12 Year Old 200th Anniversary Limited Edition",
            price: 1200,
          },
          { name: "Glenfiddich 12 Year", price: 1100 },
          { name: "Speyburn 10 Year", price: 1000 },
          { name: "Speyburn 15 Year", price: 1400 },
          { name: "Speyburn 16 Year", price: 1500 },
          { name: "Speyburn 18 Year", price: 2400 },
          { name: "Macallan 12 Year (Double Cask)", price: 1500 },
          { name: "Macallan 12 Year (Sherry Oak)", price: 1800 },
          { name: "AD Rattray Glenburgie 12 Year", price: 3000 },
          { name: "Octomore 15.1", price: 3500 },
          { name: "SMWS Kiss Me Pedro! 17 Year", price: 4600 },
        ],
      },
      {
        subCategory: "Highland",
        items: [
          { name: "Ardmore Legacy", price: 900 },
          { name: "Glen Turner 12 year", price: 900 },
          { name: "Talisker 10 Year", price: 1100 },
          { name: "Arran Barrel Reserve", price: 1000 },
          { name: "Glenmorangie 12 Year", price: 1100 },
          { name: "Highland Park 12 Year", price: 1200 },
          { name: "Clynelish 14 Year", price: 1400 },
          { name: "Glengoyne Legacy Series Chapter 3", price: 1400 },
          { name: "Glengoyne Legacy Series Chapter 2", price: 1800 },
          { name: "Ledaig Hebridean Moon", price: 3000 },
          { name: "Ledaig 2008 Amarone Cask Finish", price: 3500 },
        ],
      },
      {
        subCategory: "Islay",
        items: [
          { name: "Ardbeg 10 Year", price: 1200 },
          { name: "Bruichladdich Classic Laddie", price: 1200 },
          { name: "Bowmore 12 Year", price: 1100 },
          { name: "Caol Ila 12 Year", price: 1200 },
          { name: "Laphroig 10 Year", price: 1200 },
          { name: "Port Charlotte 10 Year", price: 1300 },
          { name: "Lagavulin 8 Year", price: 1400 },
          { name: "Lagavulin 16 Year", price: 1800 },
        ],
      },
      {
        subCategory: "Blended",
        items: [
          { name: "Johnnie Walker Red Label", price: 700 },
          { name: "Johnnie Walker Black Label 12 Year", price: 900 },
          { name: "Johnnie Walker Green Label 15 Year", price: 1100 },
          { name: "Johnnie Walker Blue Label", price: 3000 },
          { name: "The Deacon", price: 900 },
          { name: "Chivas Regal 12 Year", price: 900 },
          { name: "Chivas Regal Japanese Oak 12 Year", price: 1000 },
          { name: "Old Parr 12 Year", price: 1000 },
          { name: "Monkey Shoulder", price: 1000 },
        ],
      },
      {
        subCategory: "Campbeltown",
        items: [
          { name: "Kilkerran 12 Year", price: 1800 },
          { name: "Springbank 10 Year", price: 2200 },
          { name: "Springbank 12 Year Cask Strength", price: 6500 },
        ],
      },
    ],
  },

  /* -------------------------------------------------------------- */
  /* Tennessee Whiskey                                               */
  /* -------------------------------------------------------------- */
  {
    category: "Tennessee Whiskey",
    items: [
      {
        name: "Jack Daniels",
        description:
          "Classic Tennessee whiskey known for its smoothness and distinct flavor.",
        price: 800,
      },
      {
        name: "Gentleman Jack",
        description: "Double charcoal mellowed for extra smoothness.",
        price: 900,
      },
    ],
  },

  /* -------------------------------------------------------------- */
  /* Iowa Whiskey                                                     */
  /* -------------------------------------------------------------- */
  {
    category: "Iowa Whiskey",
    items: [{ name: "Slipknot No. 9", price: 1200 }],
  },

  /* -------------------------------------------------------------- */
  /* Canadian Whiskey                                                 */
  /* -------------------------------------------------------------- */
  {
    category: "Canadian Whiskey",
    items: [{ name: "Canadian Club 12 Year", price: 800 }],
  },

  /* -------------------------------------------------------------- */
  /* Swedish Whiskey                                                  */
  /* -------------------------------------------------------------- */
  {
    category: "Swedish Whiskey",
    items: [{ name: "Motörhead", price: 1600 }],
  },

  /* -------------------------------------------------------------- */
  /* Rye Whiskey                                                      */
  /* -------------------------------------------------------------- */
  {
    category: "Rye Whiskey",
    items: [{ name: "Wild Turkey 101", price: 1000 }],
  },

  /* -------------------------------------------------------------- */
  /* Tequila / Mezcal                                                 */
  /* -------------------------------------------------------------- */
  {
    category: "Tequila/Mezcal",
    items: [
      { name: "Olmeca Reposado", price: 700 },
      { name: "Jose Cuervo Tradicional Silver", price: 800 },
      { name: "Kirkland Añejo", price: 900 },
      { name: "Scorpion (contains scorpion)", price: 1100 },
      { name: "1800 Añejo", price: 1200 },
      { name: "Montelobos Tobalá", price: 2200 },
    ],
  },

  /* -------------------------------------------------------------- */
  /* Wine                                                             */
  /* -------------------------------------------------------------- */
  {
    category: "Wine (Red/White)",
    items: [
      { name: "Small Bottle (375 mL)", price: 1700 },
      { name: "Regular Bottle (750 mL)", price: 3000 },
    ],
  },

  /* -------------------------------------------------------------- */
  /* Sparkling Wine                                                   */
  /* -------------------------------------------------------------- */
  {
    category: "Sparkling Wine (Bottle)",
    items: [
      { name: "Stassen Citrus Cider", price: 6000 },
      { name: "Filipetti Brut", price: 7000 },
      { name: "Fontanafredda Asti", price: 8000 },
      { name: "Segura Viudas Cava (Magnum)", price: 15000 },
    ],
  },

  /* -------------------------------------------------------------- */
  /* Champagne                                                        */
  /* -------------------------------------------------------------- */
  {
    category: "Champagne (Bottle)",
    items: [
      { name: "Piper Heidsieck Brut", price: 18000 },
      { name: "Veuve Clicquot", price: 23000 },
    ],
  },

  /* -------------------------------------------------------------- */
  /* Rum                                                              */
  /* -------------------------------------------------------------- */
  {
    category: "Rum",
    items: [
      {
        name: "Bacardi White Rum",
        description: "Light & crisp; cocktail friendly.",
        price: 700,
      },
      { name: "Bacardi Superior Gold Rum", price: 700 },
      {
        name: "Malibu Coconut Rum",
        description: "Sweet coconut-flavored rum.",
        price: 700,
      },
      { name: "Bacardi Superior Black Rum", price: 800 },
    ],
  },

  /* -------------------------------------------------------------- */
  /* Gin                                                              */
  /* -------------------------------------------------------------- */
  {
    category: "Gin",
    items: [
      { name: "Kirkland London Dry Gin", price: 700 },
      { name: "Bombay Sapphire", price: 800 },
      {
        name: "The Botanist 22",
        description: "Islay gin distilled with 22 foraged botanicals.",
        price: 900,
      },
      { name: "Roku", price: 900 },
      { name: "Engine", price: 1000 },
    ],
  },

  /* -------------------------------------------------------------- */
  /* Vodka                                                            */
  /* -------------------------------------------------------------- */
  {
    category: "Vodka",
    items: [
      { name: "Absolut Vanilla", price: 700 },
      { name: "Kirkland Premium French", price: 800 },
      { name: "Stolichnaya", price: 800 },
    ],
  },

  /* -------------------------------------------------------------- */
  /* Other Stuff                                                      */
  /* -------------------------------------------------------------- */
  {
    category: "Other Stuff",
    items: [
      {
        name: "Jägermeister",
        description: "56 herbs & spices herbal liqueur.",
        price: 700,
      },
      { name: "Fireball", description: "Cinnamon whisky liqueur.", price: 700 },
      { name: "Kleiner Mini Shots", price: 700 },
      { name: "Små Shots", price: 700 },
      { name: "Motorhead Bomber Smokey Shot", price: 1100 },
      { name: "Yellow Chartreuse", price: 1500 },
      { name: "Green Chartreuse", price: 1500 },
    ],
  },
];


/* ------------------------------------------------------------------ *
 * Count helpers
 * ------------------------------------------------------------------ */
function countItemsInCategory(cat: MenuCategory): number {
  if (cat.subcategories?.length) {
    return cat.subcategories.reduce(
      (sum, sc) => sum + (sc.items?.length ?? 0),
      0
    );
  }
  return cat.items?.length ?? 0;
}
function countAll(cats: MenuCategory[]): number {
  return cats.reduce((sum, c) => sum + countItemsInCategory(c), 0);
}

/* ------------------------------------------------------------------ *
 * Collect unique strings to translate (once)
 * ------------------------------------------------------------------ */
function collectMenuStrings(): string[] {
  const set = new Set<string>();
  for (const cat of menuData) {
    set.add(cat.category);
    if (cat.categoryDescription) set.add(cat.categoryDescription);
    if (cat.subcategories?.length) {
      for (const sc of cat.subcategories) {
        set.add(sc.subCategory);
        for (const it of sc.items) {
          set.add(it.name);
          if (it.description) set.add(it.description);
        }
      }
    } else if (cat.items?.length) {
      for (const it of cat.items) {
        set.add(it.name);
        if (it.description) set.add(it.description);
      }
    }
  }
  return Array.from(set);
}
const menuStrings = collectMenuStrings();

/* Cache across component mounts */
const menuTranslationsCache: Record<string, Record<string, string>> = {};

/* ------------------------------------------------------------------ *
 * Hook: batch-translate all menu strings once per language
 * ------------------------------------------------------------------ */
function useMenuTranslations(targetLanguage: string) {
  const [map, setMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const lang = targetLanguage.split("-")[0];
    if (lang === "en") {
      setMap({});
      return;
    }
    if (menuTranslationsCache[lang]) {
      setMap(menuTranslationsCache[lang]);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        // send JSON array payload
        const payload = JSON.stringify(menuStrings);
        const translatedJson = await translateText(payload, lang);

        let parsed: unknown;
        try {
          parsed = JSON.parse(translatedJson);
        } catch {
          parsed = null;
        }

        let out: Record<string, string> = {};
        if (Array.isArray(parsed) && parsed.length === menuStrings.length) {
          menuStrings.forEach((s, i) => {
            out[s] = (parsed as string[])[i] ?? s;
          });
        } else {
          // Fallback: translate one by one (happens if service translated the JSON punctuation)
          for (const s of menuStrings) {
            try {
              const tr = await translateText(s, lang);
              out[s] = tr;
            } catch {
              out[s] = s;
            }
          }
        }

        if (!cancelled) {
          menuTranslationsCache[lang] = out;
          setMap(out);
        }
      } catch (err) {
        console.error("[FxxkupMenu] batch translate error:", err);
        if (!cancelled) setMap({});
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [targetLanguage]);

  /* translation fn */
  const t = (s: string): string => {
    const lang = targetLanguage.split("-")[0];
    if (lang === "en") return s;
    return map[s] ?? s;
  };

  return t;
}

/* ------------------------------------------------------------------ *
 * Render helpers (use t() results; English original shown faint)
 * ------------------------------------------------------------------ */

function CategoryBlock({
  category,
  language,
  t,
}: {
  category: MenuCategory;
  language: string;
  t: (s: string) => string;
}) {
  const isEnglish = language.split("-")[0] === "en";

  const catLabel = isEnglish ? category.category : t(category.category);
  const catDesc =
    category.categoryDescription &&
    (isEnglish ? category.categoryDescription : t(category.categoryDescription));

  return (
    <MasonryItem>
      <CategoryTitle>{catLabel}</CategoryTitle>

      {catDesc && <CategoryDescription>{catDesc}</CategoryDescription>}

      {category.subcategories?.length
        ? category.subcategories.map((subCat, subCatIndex) => {
            const scLabel = isEnglish ? subCat.subCategory : t(subCat.subCategory);
            return (
              <div key={subCatIndex}>
                <SubCategoryTitle>{scLabel}</SubCategoryTitle>
                {subCat.items.map((item, itemIndex) => {
                  const nm = isEnglish ? item.name : t(item.name);
                  const desc =
                    item.description && !isEnglish ? t(item.description) : item.description;
                  return (
                    <MenuItem key={itemIndex}>
                      <MenuItemName>
                        {nm}
                        <English>{item.name}</English>
                        {desc && (
                          <MenuItemDescription>{desc}</MenuItemDescription>
                        )}
                      </MenuItemName>
                      <MenuItemPrice>¥{item.price}</MenuItemPrice>
                    </MenuItem>
                  );
                })}
              </div>
            );
          })
        : category.items?.map((item, itemIndex) => {
            const nm = isEnglish ? item.name : t(item.name);
            const desc =
              item.description && !isEnglish ? t(item.description) : item.description;
            return (
              <MenuItem key={itemIndex}>
                <MenuItemName>
                  {nm}
                  <English>{item.name}</English>
                  {desc && <MenuItemDescription>{desc}</MenuItemDescription>}
                </MenuItemName>
                <MenuItemPrice>¥{item.price}</MenuItemPrice>
              </MenuItem>
            );
          })}
    </MasonryItem>
  );
}

function CategoryMasonryAll({
  cats,
  language,
  t,
}: {
  cats: MenuCategory[];
  language: string;
  t: (s: string) => string;
}) {
  return (
    <MasonryContainer>
      {cats.map((category, i) => (
        <CategoryBlock key={i} category={category} language={language} t={t} />
      ))}
    </MasonryContainer>
  );
}

function CategoryMasonrySingle({
  cat,
  language,
  t,
}: {
  cat: MenuCategory;
  language: string;
  t: (s: string) => string;
}) {
  return (
    <MasonryContainer>
      <CategoryBlock category={cat} language={language} t={t} />
    </MasonryContainer>
  );
}

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

const FxxkupMenu: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);

  /* translation fn for menu strings */
  const t = useMenuTranslations(language);

  /* tab base labels + counts */
  const baseLabels = useMemo(
    () => ["All", ...menuData.map((c) => c.category)],
    []
  );
  const counts = useMemo(() => {
    const perCat = menuData.map(countItemsInCategory);
    return [countAll(menuData), ...perCat];
  }, []);

  /* content memoization */
  const allContent = useMemo(
    () => <CategoryMasonryAll cats={menuData} language={language} t={t} />,
    [language, t]
  );
  const perCatContent = useMemo(
    () =>
      menuData.map((c) => (
        <CategoryMasonrySingle
          key={c.category}
          cat={c}
          language={language}
          t={t}
        />
      )),
    [language, t]
  );
  const activeContent =
    activeTab === 0 ? allContent : perCatContent[activeTab - 1];

  const isEnglish = language.split("-")[0] === "en";

  return (
    <FxxkupMenuWrapper>
      {/* Top header */}
      <MenuTop>
        <MenuLogo src={fxxkupLogo} alt="Fxxkup Logo" />
        <h1>
          {/* keep wrapper so header always translates even if batch fails */}
          <TranslationWrapper
            targetLanguage={language}
            originalLanguage="en"
          >
            Drink Menu
          </TranslationWrapper>
        </h1>
        <Subhead>
          <TranslationWrapper
            targetLanguage={language}
            originalLanguage="en"
          >
            ¥500 cover charge per-person
          </TranslationWrapper>
        </Subhead>
      </MenuTop>

      {/* Tabs (horizontal scroll) */}
      <MenuTabsHeader>
        <Tabs activeTab={activeTab} onTabClick={setActiveTab}>
          <Tab icon={null} label={`${isEnglish ? baseLabels[0] : t(baseLabels[0])} (${counts[0]})`}>
            <></>
          </Tab>
          {menuData.map((cat, idx) => (
            <Tab
              key={cat.category}
              icon={null}
              label={`${isEnglish ? cat.category : t(cat.category)} (${counts[idx + 1]})`}
            >
              <></>
            </Tab>
          ))}
        </Tabs>
      </MenuTabsHeader>

      {/* Vertical scroll content */}
      <MenuContentWrapper>{activeContent}</MenuContentWrapper>
    </FxxkupMenuWrapper>
  );
};

export default FxxkupMenu;

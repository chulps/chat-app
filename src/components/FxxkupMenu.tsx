import React from "react";
import TranslationWrapper from "./TranslationWrapper";
import styled from "styled-components";
import fxxkupLogo from "../images/fxxkup_logo.svg";
import { useLanguage } from "../contexts/LanguageContext";

const FxxkupMenuWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
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
`;

const English = styled.small`
  color: var(--neutral-300);
  font-weight: normal;
`;

const CategoryDescription = styled.p`
  margin-bottom: var(--space-1);
`;

const menuData = [
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
      {
        name: "Lemon Sour",
        description:
          "A tangy lemon drink with a hint of sweetness and bubbles.",
        price: 600,
      },
      {
        name: "Black Tea-hai",
        description:
          "Rich black tea and Japanese shochu served over ice in a highball glass.",
        price: 600,
      },
      {
        name: "Kaku Highball",
        description:
          "Japan's most popular highball with Suntory Whisky and soda over ice.",
        price: 700,
      },
      {
        name: "Plum Wine",
        description: "Sweet and fruity plum wine served chilled.",
        price: 700,
      },
      {
        name: "Cassis Soda",
        description: "A fizzy drink with a sweet cassis flavor.",
        price: 700,
      },
      {
        name: "Cassis Oolong",
        description: "A blend of cassis and oolong tea for a unique taste.",
        price: 700,
      },
      {
        name: "Cassis Peach",
        description: "A refreshing mix of cassis and peach flavors.",
        price: 700,
      },
      {
        name: "Peach Orange",
        description: "A fruity blend of peach liqueur and orange juice.",
        price: 700,
      },
      {
        name: "Peach Oolong",
        description: "A delightful combination of peach and oolong tea.",
        price: 700,
      },
      {
        name: "Gin & Tonic",
        description:
          "Classic mix of gin and tonic water over ice with citrus garnish.",
        price: 700,
      },
      {
        name: "Fuzzy Navel",
        description: "A sweet blend of peach liqueur and orange juice.",
        price: 800,
      },
      {
        name: "Cassis Orange",
        description:
          "Cassis liqueur and orange juice for a refreshing, fruity cocktail.",
        price: 800,
      },
      {
        name: "Rum & Coke",
        price: 800,
        description: "White rum and Coca-cola",
      },
      {
        name: "Jack & Coke",
        price: 800,
        description: "With Coca-cola",
      },
      {
        name: "Moscow Mule",
        price: 800,
        description: "Vodka and ginger ale with fresh lime wedge",
      },
      {
        name: "Jägerbomb",
        price: 1000,
        description: "Red Bull and Jägermeister",
      },
    ],
  },
  {
    category: "Soft Drinks",
    items: [
      { name: "Apple Juice", price: 600 },
      { name: "Coca-Cola", price: 600 },
      { name: "Ginger Ale", price: 600 },
      { name: "Jasmine Tea", price: 600 },
      { name: "Oolong Tea", price: 600 },
      { name: "Orange Juice", price: 600 },
      { name: "Pineapple Juice", price: 600 },
      { name: "A&W Root Beer", price: 600 },
      { name: "Red Bull", price: 700 },
    ],
  },
  {
    category: "Beer",
    items: [
      {
        name: "Asahi",
        description: "Japan's most popular beer - 330mL glass bottle",
        price: 700,
      },
      {
        name: "Orion Beer",
        description: "Chuck's favorite beer from Okinawa - 330mL aluminum can",
        price: 800,
      },
      {
        name: "Corona. Extra",
        description:
          "The default Mexican beer served with a lime wedge - 330mL glass bottle",
        price: 900,
      },
      {
        name: "Heineken",
        description: "From Holland - 330mL glass bottle",
        price: 900,
      },
      {
        name: "Sapporo Classic Pint",
        description: "The Local Champion - 500mL glass bottle",
        price: 1000,
      },
    ],
  },
  {
    category: "Japanese Whiskey",
    subcategories: [
      {
        subCategory: "Nikka",
        items: [
          { name: "Nikka Frontier", price: 900, description: "" },
          { name: "Nikka Session", price: 1000, description: "" },
          { name: "Nikka From the Barrel", price: 1200, description: "" },
        ],
      },
      {
        subCategory: "Miyagikyo",
        items: [
          { name: "Miyagikyo", price: 1200, description: "" },
        ],
      },
      {
        subCategory: "Taketsuru",
        items: [
          { name: "Taketsuru", price: 1400, description: "" },
          { name: "Taketsuru 17 Year", price: 5000, description: "" },
        ],
      },
      {
        subCategory: "Yoichi",
        items: [
          { name: "Yoichi", price: 1200, description: "" },
          {
            name: "Yoichi Distillery Limited Blended Whiskey",
            price: 1200,
            description: "",
          },
          { name: "Yoichi 12 Year", price: 5200, description: "" },
        ],
      },
      {
        subCategory: "Suntory",
        items: [
          { name: "Chita", price: 1100, description: "" },
          { name: "Hibiki Japanese Harmony", price: 1700, description: "" },
          { name: "Hibiki Blender’s Choice", price: 2400, description: "" },
          { name: "Hibiki 12 Year", price: 5200, description: "" },
          { name: "Hibiki 17 Year", price: 6800, description: "" },
          { name: "Hibiki 21 Year", price: 8800, description: "" },
        ],
      },
      {
        subCategory: "Hakushu",
        items: [
          { name: "Hakushu", price: 1700, description: "" },
          {
            name: "Hakushu SOD 2024 (Limited Edition)",
            price: 2800,
            description: "",
          },
          { name: "Hakushu 12 Year", price: 3300, description: "" },
          { name: "Hakushu 18 Year", price: 8800, description: "" },
        ],
      },
      {
        subCategory: "Yamazaki",
        items: [
          { name: "Yamazaki", price: 1800, description: "" },
          {
            name: "Yamazaki SOD 2024 (Limited Edition)",
            price: 3000,
            description: "",
          },
          { name: "Yamazaki 12 Year", price: 3300, description: "" },
          { name: "Yamazaki 18 Year", price: 10000, description: "" },
        ],
      },
      {
        subCategory: "Other",
        items: [
          { name: "Ichiro's Malt White Label", price: 1000, description: "" },
          { name: "Ichiro's Malt Classical Edition", price: 1300, description: "" },
          {
            name: "Ichiro's Malt Mizunara Wood Reserve",
            price: 1600,
            description: "",
          },
          { name: "Yamazakura Asaka", price: 1800, description: "" },
        ],
      },
    ],
  },

  /*
   * SCOTCH: Updated EXACTLY to match the screenshot’s subcategories, names, and prices,
   * while retaining any existing descriptions you previously had.
   */
  {
    category: "Scotch",
    subcategories: [
      {
        subCategory: "Speyside",
        items: [
          {
            name: "Chivas Regal Mizunara 12 Year",
            price: 1000,
            description:
              "A blend that incorporates Japanese Mizunara oak, offering a unique floral and spicy character.",
          },
          {
            name: "Ballantine 12 Year",
            price: 1000,
            description: "",
          },
          {
            name: "Speyburn 10 Year",
            price: 1000,
            description:
              "Chuck's favorite Scotch! A Speyside single malt with a fresh and fruity flavor, featuring notes of apple and honey.",
          },
          {
            name: "Speyburn 15 Year",
            price: 1400,
            description:
              "Aged in a mix of American and European oak, offering a rich and complex flavor with hints of spice.",
          },
          {
            name: "Macallan 12 Year (Double Cask)",
            price: 1400,
            description:
              "A rich and smooth single malt aged in both American and European oak, with notes of vanilla and dried fruits.",
          },
          {
            name: "Macallan 12 Year (Sherry Oak)",
            price: 1800,
            description:
              "A classic sherried whisky with rich flavors of dried fruits, spice, and chocolate.",
          },
          {
            name: "Glenburgie 2007 First Edition",
            price: 3500,
            description: "",
          },
          {
            name: "Octomore 15.1",
            price: 3500,
            description: "",
          },
        ],
      },
      {
        subCategory: "Isle of Skye",
        items: [
          {
            name: "Talisker 10 Year",
            price: 1000,
            description:
              "A single malt from the Isle of Skye, known for its maritime character and peaty, smoky flavors.",
          },
        ],
      },
      {
        subCategory: "Highland",
        items: [
          {
            name: "Clynelish 14 Year",
            price: 1400,
            description:
              "A Highland single malt with a waxy texture and flavors of citrus and coastal brine.",
          },
        ],
      },
      {
        subCategory: "Lowland",
        items: [
          {
            name: "Johnnie Walker Black Label 12 Year",
            price: 900,
            description:
              "A blended Scotch whisky from various regions, known for its rich and smoky flavor profile.",
          },
          {
            name: "Johnnie Walker Green Label 15 Year",
            price: 1100,
            description: "",
          },
          {
            name: "Johnnie Walker Blue Label",
            price: 2900,
            description:
              "A premium blended Scotch with a velvety smoothness and complex flavors of smoke, spice, and sweetness.",
          },
        ],
      },
      {
        subCategory: "Islay",
        items: [
          {
            name: "Ardbeg 10 Year",
            price: 1100,
            description:
              "A heavily peated Islay whisky, famous for its bold, smoky flavor and medicinal notes.",
          },
          {
            name: "Bruichladdich Classic Laddie",
            price: 1100,
            description: "",
          },
          {
            name: "Laphroig 10 Year",
            price: 1100,
            description:
            "A heavily peated Islay whisky, famous for its bold, smoky flavor and medicinal notes.",
          },
          {
            name: "Caol Ila 12 Year",
            price: 1200,
            description:
              "An Islay single malt with a balance of smoke and sweetness, featuring citrus and floral notes.",
          },
        ],
      },
    ],
  },

  {
    category: "Wine (Red/White)",
    items: [
      {
        name: "Glass",
        description:
          "Sorry, we don't serve wine by the glass. Please order a bottle.",
        price: "×",
      },
      {
        name: "Small Bottle (375 mL)",
        description:
          "A small bottle of wine perfect for 1 or 2 people. 3-4 glasses of wine per bottle.",
        price: 1700,
      },
      {
        name: "Regular Bottle (750 mL)",
        description: "6-8 glasses per bottle, perfect for 3 or 4 people.",
        price: 3000,
      },
    ],
  },
  {
    category: "Sparkling Wine (Bottle)",
    items: [
      { name: "Stassen Citrus Cider", price: 6000 },
      { name: "Filipetti Brut", price: 7000 },
      { name: "Fontanafredda Asti", price: 8000 },
      { name: "Segura Viudas Cava (Magnum)", price: 15000 },
    ],
  },
  {
    category: "Champagne (Bottle)",
    items: [
      { name: "Piper Heidsieck Brut", price: 18000 },
      { name: "Veuve Clicquot", price: 23000 },
      { name: "Yellow Label Brut N.V.", price: 23000 },
      { name: "Moët & Chandon Nectar Impérial", price: 25000 },
    ],
  },
  {
    category: "Rum",
    items: [
      {
        name: "Bacardi White Rum",
        price: 700,
        description: "A light and crisp rum, perfect for cocktails.",
      },
      {
        name: "Bacardi Superior",
        price: 700,
        description: "A premium white rum with a smooth finish.",
      },
      {
        name: "Gold Rum",
        price: 700,
        description: "A rich and flavorful rum with hints of caramel.",
      },
      {
        name: "Malibu Coconut Rum",
        price: 700,
        description: "A sweet coconut-flavored rum, ideal for tropical drinks.",
      },
      {
        name: "Bacardi Superior Black Rum",
        price: 800,
        description: "A dark rum with a robust flavor and notes of molasses.",
      },
    ],
  },
  {
    category: "Vodka",
    items: [
      {
        name: "Absolut Vanilla",
        price: 700,
        description: "A smooth vodka infused with natural vanilla flavor.",
      },
      {
        name: "Kirkland Vodka",
        price: 700,
        description:
          "A high-quality vodka known for its purity and smoothness.",
      },
      {
        name: "Stolichnaya",
        price: 800,
        description: "",
      },
    ],
  },
  {
    category: "Gin",
    items: [
      {
        name: "Kirkland",
        price: 700,
        description: "A smooth and versatile gin, perfect for cocktails.",
      },
      {
        name: "Bombay Sapphire",
        price: 700,
        description: "",
      },
      {
        name: "The Botanist 22",
        price: 1100,
        description:
          "An artisanal gin with 22 hand-foraged botanicals, offering a complex flavor profile.",
      },
    ],
  },
  {
    category: "Other Stuff",
    items: [
      {
        name: "Jägermeister",
        price: 700,
        description:
          "A herbal liqueur with a unique blend of 56 herbs and spices.",
      },
      {
        name: "Fireball",
        price: 700,
        description: "A cinnamon whiskey with a sweet and spicy kick.",
      },
      {
        name: "Kleiner Mini Shots",
        price: 700,
        description: "Small shots of assorted flavored liqueurs.",
      },
      {
        name: "Sma* Shots",
        price: 700,
        description: "Fun-sized shots with a variety of flavors.",
      },
    ],
  },
  {
    category: "Bourbon",
    items: [
      {
        name: "Jim Beam",
        price: 700,
        description:
          "A classic bourbon known for its smoothness and hints of vanilla.",
      },
      {
        name: "Four Roses",
        price: 700,
        description:
          "A unique blend of 10 distinct bourbon recipes, offering a rich and fruity flavor.",
      },
      {
        name: "Maker's Mark",
        price: 900,
        description:
          "A premium bourbon with a sweet and smooth profile, known for its red wax seal.",
      },
      {
        name: "Bulleit",
        price: 900,
        description:
          "A high-rye bourbon with a bold, spicy character and a clean finish.",
      },
      {
        name: "Woodford Reserve",
        price: 1000,
        description:
          "A small-batch bourbon with a rich flavor profile, featuring notes of dried fruit and vanilla.",
      },
    ],
  },
  {
    category: "Irish Whiskey",
    items: [
      {
        name: "Jameson",
        price: 800,
        description:
          "A smooth and versatile Irish whiskey, perfect for sipping or mixing.",
      },
      {
        name: "Connemara",
        price: 1000,
        description:
          "A peated single malt Irish whiskey, known for its unique smoky flavor.",
      },
    ],
  },
  {
    category: "Canadian Whiskey",
    items: [
      {
        name: "Canadian Club 12 Year",
        price: 900,
        description:
          "A classic Canadian whiskey known for its light and smooth flavor.",
      },
      {
        name: "Sortilege",
        price: 1300,
        description: "A unique blend of Canadian whisky and maple syrup.",
      },
    ],
  },
  {
    category: "Swedish Whiskey",
    items: [
      {
        name: "Mötorhead",
        price: 1600,
        description: "The Ace of Spades!",
      },
    ],
  },
  {
    category: "Rye Whiskey",
    items: [
      {
        name: "Wild Turkey 101",
        price: 1000,
        description: "The wildest turkey in the woods!",
      },
    ],
  },
  {
    category: "Tennessee Whiskey",
    items: [
      {
        name: "Jack Daniels",
        price: 800,
        description:
          "A classic Tennessee whiskey known for its smoothness and distinct flavor.",
      },
      {
        name: "Gentleman Jack",
        price: 900,
        description:
          "A premium Tennessee whiskey that undergoes a double charcoal filtering process for extra smoothness.",
      },
    ],
  },
  {
    category: "Tequila/Mezcal",
    items: [
      {
        name: "Olmeca Reposado",
        price: 700,
        description:
          "Aged in oak barrels for a smooth flavor with hints of vanilla.",
      },
      {
        name: "Kirkland Añejo",
        price: 900,
        description:
          "Aged for at least a year, offering rich flavors of caramel and oak.",
      },
      {
        name: "Jose Cuervo Tradicional Silver",
        price: 800,
        description: "",
      },
      {
        name: "1800 Añejo",
        price: 1300,
        description:
          "Aged for over a year in French and American oak barrels, providing a complex flavor profile.",
      },
      {
        name: "Montelobos Tobala",
        price: 2200,
        description: "A premium mezcal made from Tobalá agave with a spicy and smoky flavor.",
      },
    ],
  },
  {
    category: "Premium Cocktails",
    categoryDescription:
      "These items are only available when Chuck is in the bar. Thank you for understanding.",
    items: [
      {
        name: "Old Fashioned",
        price: 1100,
        description:
          "Bulleit bourbon, grenadine syrup, angostura bitters, orange peel",
      },
      {
        name: "Margarita",
        price: 1100,
        description: "Tequila, Cointreau, fresh lime juice and lime wedge with a salted rim",
      },
      {
        name: "Negroni",
        price: 1100,
        description:
          "Equal parts Campari, vermouth rosso, and gin, served with a fresh orange peel",
      },
      {
        name: "Pomegranate Cosmopolitan",
        price: 1100,
        description:
          "Pomegranate juice, Cointreau, vodka, and fresh lime garnish",
      },
      {
        name: "Strawberry Daiquiri",
        price: 1100,
        description:
          "White rum, strawberry liqueur, lime juice",
      },
      {
        name: "Piña Colada (contains dairy)",
        price: 1100,
        description:
          "Malibu rum, pineapple juice, cream of coconut",
      },
      {
        name: "Coco-Paloma",
        price: 1100,
        description:
          "Grapefruit juice, coconut cream, lime juice, tequila, cointreau, and lime wedge with a salted rim",
      },
    ],
  },
  {
    category: "Secret Menu & Custom Cocktails",
    categoryDescription: "Chuck is always developing new cocktails, so if he is behind the bar ask him about what he is working on!",
    items: [
      {
        name: "Custom Cocktails",
        price: "???",
        description:
          "• Prices may vary. Availability depends on what ingredients are in stock, as well as the moods and creativity of our staff. We often add new products to our inventory before we update the menu so please ask the staff if there are any new items.",
      },
    ],
  },
];

const FxxkupMenu: React.FC = () => {
  const { language } = useLanguage();

  return (
    <FxxkupMenuWrapper>
      <MenuTop>
        <MenuLogo src={fxxkupLogo} alt="Fxxkup Logo" />
        <h1>
          <TranslationWrapper targetLanguage={language} originalLanguage="en">
            Drink Menu
          </TranslationWrapper>
        </h1>
        <Subhead>
          <TranslationWrapper targetLanguage={language} originalLanguage="en">
            ¥500 cover charge per-person
          </TranslationWrapper>
        </Subhead>
      </MenuTop>

      <MasonryContainer>
        {menuData.map((category, categoryIndex) => (
          <MasonryItem key={categoryIndex}>
            <CategoryTitle>
              <TranslationWrapper
                targetLanguage={language}
                originalLanguage="en"
              >
                {category.category}
              </TranslationWrapper>
            </CategoryTitle>

            {/* Add the category description if it exists */}
            {category.categoryDescription && (
              <CategoryDescription>
                <TranslationWrapper
                  targetLanguage={language}
                  originalLanguage="en"
                >
                  {category.categoryDescription}
                </TranslationWrapper>
              </CategoryDescription>
            )}

            {category.subcategories
              ? category.subcategories.map((subCat, subCatIndex) => (
                  <div key={subCatIndex}>
                    <SubCategoryTitle>
                      <TranslationWrapper
                        targetLanguage={language}
                        originalLanguage="en"
                      >
                        {subCat.subCategory}
                      </TranslationWrapper>
                    </SubCategoryTitle>

                    {subCat.items.map((item, itemIndex) => (
                      <MenuItem key={itemIndex}>
                        <MenuItemName>
                          <TranslationWrapper
                            targetLanguage={language}
                            originalLanguage="en"
                          >
                            {item.name}
                          </TranslationWrapper>
                          <English>{item.name}</English>
                          {"description" in item && (
                            <MenuItemDescription>
                              <TranslationWrapper
                                targetLanguage={language}
                                originalLanguage="en"
                              >
                                {item.description}
                              </TranslationWrapper>
                            </MenuItemDescription>
                          )}
                        </MenuItemName>
                        <MenuItemPrice>¥{item.price}</MenuItemPrice>
                      </MenuItem>
                    ))}
                  </div>
                ))
              : // If no subcategories, just map items normally
                category.items?.map((item, itemIndex) => (
                  <MenuItem key={itemIndex}>
                    <MenuItemName>
                      <TranslationWrapper
                        targetLanguage={language}
                        originalLanguage="en"
                      >
                        {item.name}
                      </TranslationWrapper>
                      <English>{item.name}</English>
                      {"description" in item && (
                        <MenuItemDescription>
                          <TranslationWrapper
                            targetLanguage={language}
                            originalLanguage="en"
                          >
                            {item.description}
                          </TranslationWrapper>
                        </MenuItemDescription>
                      )}
                    </MenuItemName>
                    <MenuItemPrice>¥{item.price}</MenuItemPrice>
                  </MenuItem>
                ))}
          </MasonryItem>
        ))}
      </MasonryContainer>
    </FxxkupMenuWrapper>
  );
};

export default FxxkupMenu;

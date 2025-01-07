import React from "react";
import TranslationWrapper from "./TranslationWrapper";
import styled from "styled-components";
import fxxkupLogo from "../images/fxxkup_logo.svg";
import { useLanguage } from "../contexts/LanguageContext";

// Define the array of objects for the menu
const menuData = [
  {
    category: "Popular in Japan",
    items: [
      { name: "Oolong-hai", description: "Oolong tea and Japanese shochu served over ice in a highball glass.", price: 600 },
      { name: "Jasmine-hai", description: "Jasmine tea and Japanese shochu served over ice in a highball glass.", price: 600 },
      { name: "Green Tea-hai", description: "Refreshing green tea and Japanese shochu served over ice in a highball glass.", price: 600 },
      { name: "Lemon Sour", description: "A tangy lemon drink with a hint of sweetness and bubbles.", price: 600 },
      { name: "Black Tea-hai", description: "Rich black tea and Japanese shochu served over ice in a highball glass.", price: 700 },
      { name: "Kaku Highball", description: "Japan's most popular highball with Suntory Whisky and soda over ice.", price: 700 },
      { name: "Plum Wine", description: "Sweet and fruity plum wine served chilled.", price: 700 },
      { name: "Cassis Soda", description: "A fizzy drink with a sweet cassis flavor.", price: 700 },
      { name: "Cassis Oolong", description: "A blend of cassis and oolong tea for a unique taste.", price: 700 },
      { name: "Cassis Peach", description: "A refreshing mix of cassis and peach flavors.", price: 700 },
      { name: "Peach Orange", description: "A fruity blend of peach liqueur and orange juice.", price: 700 },
      { name: "Peach Oolong", description: "A delightful combination of peach and oolong tea.", price: 700 },
      { name: "Kahlua Milk", description: "A creamy drink with coffee liqueur and Hokkaido milk.", price: 800 },
      { name: "Matcha Kahlua Milk", description: "A unique blend of Matcha flavored Kahlua with Hokkaido milk.", price: 800 },
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
      { name: "Red Bull", price: 600 },
    ],
  },
  {
    category: "Beer",
    items: [
      { name: "Asahi",description: "Japan's most popular beer - 330mL glass bottle", price: 700 },
      { name: "Budweiser", description: "An American classic - 330mL glass bottle", price: 700 },
      { name: "Orion Beer", description: "Chuck's favorite beer from Okinawa - 330mL aluminum can",price: 800 },
      { name: "Corona Extra", description: "The default mexican beer served with a lime wedge - 330mL glass bottle",price: 900 },
      { name: "Heineken", description: "From Holland - 330mL glass bottle", price: 900 },
      { name: "Sapporo Classic Pint", description: "The Local Champion - 500mL glass bottle", price: 1000 },
    ],
  },
  {
    category: "Wine (Red/White)",
    items: [
        {name: "Glass", description: "Sorry, we don't serve wine by the glass. Please order a bottle.", price: "×"},
      { name: "Small Bottle (375 mL)", description: "A small bottle of wine perfect for 1 or 2 people. 3-4 glasses of wine per bottle.", price: 1700 },
      { name: "Regular Bottle (750 mL)", description: "6-8 glasses per bottle, perfect for 3 or 4 people.", price: 3000 },
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
    category: "Sparkling Wine (Bottle)",
    items: [
      { name: "Stassen Citrus Cider", price: 6000 },
      { name: "Filipetti Brut", price: 7000 },
      { name: "Fontanafredda Asti", price: 8000 },
      { name: "Segura Viudas Cava (Magnum)", price: 15000 },
    ],
  },
  {
    category: "Japanese Whiskey",
    items: [
      { name: "Yoichi", price: 1200, description: "A rich and peaty single malt from the Yoichi distillery." },
      { name: "Nikka from the Barrel", price: 1300, description: "A blended whiskey with a bold and complex flavor profile." },
      { name: "Taketsuru", price: 1500, description: "A smooth and well-balanced whiskey, named after the founder of Nikka." },
      { name: "Hakushu", price: 1800, description: "A fresh and herbal single malt from the Japanese Alps." },
      { name: "Yamazaki", price: 2000, description: "Japan's oldest malt whiskey, known for its fruity and floral notes." },
      {
        name: "Yamazaki Story of the Distillery 2024",
        price: 3000,
        description: "Limited Edition flavor from the Yamazaki Distillery, showcasing the craftsmanship and heritage of Japanese whiskey.",
      },
    ],
  },  {
    category: "Scotch",
    items: [
      { name: "Johnnie Walker Black Label 12 Year", price: 900, description: "A blended Scotch whisky from various regions, known for its rich and smoky flavor profile." },
      { name: "Chivas Regal Mizunara 12 Year", price: 1000, description: "A blend that incorporates Japanese Mizunara oak, offering a unique floral and spicy character." },
      { name: "Speyburn 10 Year", price: 1000, description: "Chuck's favorite Scotch! A Speyside single malt with a fresh and fruity flavor, featuring notes of apple and honey." },
      { name: "Talisker 10 Year", price: 1000, description: "A single malt from the Isle of Skye, known for its maritime character and peaty, smoky flavors." },
      { name: "Laphroig 10 Year", price: 1200, description: "A heavily peated Islay whisky, famous for its bold, smoky flavor and medicinal notes." },
      { name: "Caol Ila 12 Year", price: 1300, description: "An Islay single malt with a balance of smoke and sweetness, featuring citrus and floral notes." },
      { name: "Speyburn 15 Year", price: 1400, description: "Aged in a mix of American and European oak, offering a rich and complex flavor with hints of spice." },
      { name: "Clynelish 14 Year", price: 1400, description: "A Highland single malt with a waxy texture and flavors of citrus and coastal brine." },
      { name: "Macallan 12 Year (Double Cask)", price: 1400, description: "A rich and smooth single malt aged in both American and European oak, with notes of vanilla and dried fruits." },
      { name: "Macallan 12 Year (Sherry Oak)", price: 1800, description: "A classic sherried whisky with rich flavors of dried fruits, spice, and chocolate." },
      { name: "Johnnie Walker Blue Label", price: 3000, description: "A premium blended Scotch with a velvety smoothness and complex flavors of smoke, spice, and sweetness." },
    ],
  },  {
    category: "Bourbon",
    items: [
      { name: "Jim Beam", price: 700, description: "A classic bourbon known for its smoothness and hints of vanilla." },
      { name: "Four Roses", price: 700, description: "A unique blend of 10 distinct bourbon recipes, offering a rich and fruity flavor." },
      { name: "Maker's Mark", price: 900, description: "A premium bourbon with a sweet and smooth profile, known for its red wax seal." },
      { name: "Bulleit", price: 900, description: "A high-rye bourbon with a bold, spicy character and a clean finish." },
      { name: "Woodford Reserve", price: 1000, description: "A small-batch bourbon with a rich flavor profile, featuring notes of dried fruit and vanilla." },
    ],
  },
  {
    category: "Tennessee Whiskey",
    items: [
      { name: "Jack Daniels", price: 800, description: "A classic Tennessee whiskey known for its smoothness and distinct flavor." },
      { name: "Gentleman Jack", price: 900, description: "A premium Tennessee whiskey that undergoes a double charcoal filtering process for extra smoothness." },    ],
  },
  {
    category: "Irish Whiskey",
    items: [
      { name: "Jameson", price: 800, description: "A smooth and versatile Irish whiskey, perfect for sipping or mixing." },
      { name: "Connemara", price: 1000, description: "A peated single malt Irish whiskey, known for its unique smoky flavor." },
    ],
  },  {
    category: "Tequila",
    items: [
      { name: "Olmeca Reposado", price: 700, description: "Aged in oak barrels for a smooth flavor with hints of vanilla." },
      { name: "Olmeca Silver", description: "Best for cocktails, known for its crisp and clean taste.", price: 700 },
      { name: "Kirkland Añejo", price: 900, description: "Aged for at least a year, offering rich flavors of caramel and oak." },
      { name: "1800 Añejo", price: 1300, description: "Aged for over a year in French and American oak barrels, providing a complex flavor profile." },
    ],
  },  {
    category: "Gin",
    items: [
      { name: "Kirkland", price: 700, description: "A smooth and versatile gin, perfect for cocktails." },
      { name: "The Botanist 22", price: 1100, description: "An artisanal gin with 22 hand-foraged botanicals, offering a complex flavor profile." },
    ],
  },  {
    category: "Vodka",
    items: [
      { name: "Absolut Vanilla", price: 700, description: "A smooth vodka infused with natural vanilla flavor." },
      { name: "Kirkland Vodka", price: 700, description: "A high-quality vodka known for its purity and smoothness." },
    ],
  },
  {
    category: "Rum",
    items: [
      { name: "Bacardi White Rum", price: 700, description: "A light and crisp rum, perfect for cocktails." },
      { name: "Bacardi Superior", price: 700, description: "A premium white rum with a smooth finish." },
      { name: "Gold Rum", price: 700, description: "A rich and flavorful rum with hints of caramel." },
      { name: "Malibu Coconut Rum", price: 700, description: "A sweet coconut-flavored rum, ideal for tropical drinks." },
      { name: "Black Rum", price: 700, description: "A dark rum with a robust flavor and notes of molasses." },
    ],
  },
  {
    category: "Other Stuff",
    items: [
      { name: "Jägermeister", price: 700, description: "A herbal liqueur with a unique blend of 56 herbs and spices." },
      { name: "Fireball", price: 700, description: "A cinnamon whiskey with a sweet and spicy kick." },
      { name: "Kleiner Mini Shots", price: 700, description: "Small shots of assorted flavored liqueurs." },
      { name: "Sma* Shots", price: 700, description: "Fun-sized shots with a variety of flavors." },
    ],
  },  {
    category: "Classic Cocktails",
    items: [
      {
        name: "Rum & Coke",
        price: 800,
        description: "White rum and Coca-cola",
      },
      { name: "Jack & Coke", price: 800, description: "With Coca-cola" },
      {
        name: "Moscow Mule",
        price: 1000,
        description: "Vodka and ginger ale with fresh lime wedge",
      },
      {
        name: "Old Fashioned",
        price: 1100,
        description:
          "Bulleit bourbon, grenadine syrup, angostura bitters, orange peel",
      },
      {
        name: "Margarita",
        price: 1100,
        description: "Tequila, Cointreau, fresh lime juice and lime wedge",
      },
      {
        name: "Negroni",
        price: 1100,
        description:
          "Equal parts Campari, vermouth rosso, and gin, served with a fresh orange peel",
      },
    ],
  },
  {
    category: "Secret Menu & Custom Cocktails",
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

const FxxkupMenuWrapper = styled.div`
  // Add styles here
`;

const CategoryTitle = styled.h2`
  margin-bottom: var(--space-2);
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
  color: var(--danger-500);
`;

const English = styled.small`
    color: var(--neutral-300);
    font-weight: normal;
`

const FxxkupMenu: React.FC = () => {
  const { language } = useLanguage(); // Pull language and content dynamically

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
      <div className="auto-grid-medium">
        {menuData.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <CategoryTitle>
              <TranslationWrapper
                targetLanguage={language}
                originalLanguage="en"
              >
                {category.category}
              </TranslationWrapper>
            </CategoryTitle>
            {category.items.map((item, itemIndex) => (
              <MenuItem key={itemIndex}>
                <MenuItemName>
                  <TranslationWrapper
                    targetLanguage={language}
                    originalLanguage="en"
                  >
                    {item.name}
                  </TranslationWrapper>
                  <English>{item.name}</English>
                  {'description' in item && (
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
            ))}          </div>
        ))}
      </div>
    </FxxkupMenuWrapper>
  );
};

export default FxxkupMenu;

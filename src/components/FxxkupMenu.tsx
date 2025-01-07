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
      { name: "Oolong-hai", price: 600 },
      { name: "Jasmine-hai", price: 600 },
      { name: "Green Tea-hai", price: 600 },
      { name: "Lemon Sour", price: 600 },
      { name: "Black Tea-hai", price: 700 },
      { name: "Kaku Highball", price: 700 },
      { name: "Plum Wine", price: 700 },
      { name: "Cassis Soda", price: 700 },
      { name: "Cassis Oolong", price: 700 },
      { name: "Cassis Peach", price: 700 },
      { name: "Peach Orange", price: 700 },
      { name: "Peach Oolong", price: 700 },
      { name: "Kahlua Milk", price: 800, description: "Contains dairy" },
      { name: "Matcha Kahlua Milk", price: 800, description: "Contains dairy" },
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
      { name: "Asahi (bottle)", price: 700 },
      { name: "Budweiser (can)", price: 700 },
      { name: "Orion (can)", price: 800 },
      { name: "Corona Extra (bottle)", price: 900 },
      { name: "Heineken (bottle)", price: 900 },
      { name: "Sapporo Classic Pint (bottle)", price: 1000 },
    ],
  },
  {
    category: "Wine (Red/White)",
    items: [
      { name: "Small Bottle (375 mL)", price: 1700 },
      { name: "Regular Bottle (750 mL)", price: 3000 },
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
      { name: "Yoichi", price: 1200 },
      { name: "Nikka from the Barrel", price: 1300 },
      { name: "Taketsuru", price: 1500 },
      { name: "Hakushu", price: 1800 },
      { name: "Yamazaki", price: 2000 },
      {
        name: "Yamazaki Story of the Distillery 2024",
        price: 3000,
        description: "Limited Edition",
      },
    ],
  },
  {
    category: "Scotch",
    items: [
      { name: "Johnnie Walker Black Label 12 Year", price: 900 },
      { name: "Chivas Regal", price: 1000 },
      { name: "Mizunara 12 Year", price: 1000 },
      { name: "Speyburn 10 Year", price: 1000 },
      { name: "Talisker 10 Year", price: 1000 },
      { name: "Laphroig 10 Year", price: 1200 },
      { name: "Caol Ila 12 Year", price: 1200 },
      { name: "Clynelish 14 Year", price: 1400 },
      { name: "Macallan 15 Year (Sherry Oak)", price: 1800 },
      { name: "Macallan 12 Year (Double Cask)", price: 1400 },
      { name: "Johnnie Walker Blue Label", price: 3000 },
    ],
  },
  {
    category: "Bourbon",
    items: [
      { name: "Jim Beam", price: 700 },
      { name: "Four Roses", price: 700 },
      { name: "Maker's Mark", price: 900 },
      { name: "Bulleit", price: 900 },
      { name: "Woodford Reserve", price: 1000 },
    ],
  },
  {
    category: "Tennessee Whiskey",
    items: [
      { name: "Jack Daniels", price: 800 },
      { name: "Gentleman Jack", price: 900 },
    ],
  },
  {
    category: "Irish Whiskey",
    items: [
      { name: "Jameson", price: 800 },
      { name: "Connemara", price: 1000 },
    ],
  },
  {
    category: "Tequila",
    items: [
      { name: "Olmeca Reposado", price: 900 },
      { name: "Olmeca Silver", price: 900 },
      { name: "Kirkland Añejo", price: 900 },
      { name: "1800 Añejo", price: 1300 },
    ],
  },
  {
    category: "Gin",
    items: [
      { name: "Kirkland", price: 700 },
      { name: "The Botanist 22", price: 1100 },
    ],
  },
  {
    category: "Vodka",
    items: [
      { name: "Absolut Vanilla", price: 700 },
      { name: "Kirkland's Vodka", price: 700 },
    ],
  },
  {
    category: "Rum",
    items: [
      { name: "Bacardi White Rum", price: 700 },
      { name: "Bacardi Superior", price: 700 },
      { name: "Gold Rum", price: 700 },
      { name: "Malibu Coconut Rum", price: 700 },
      { name: "Black Rum", price: 700 },
    ],
  },
  {
    category: "Other Stuff",
    items: [
      { name: "Jägermeister", price: 700 },
      { name: "Fireball", price: 700 },
      { name: "Kleiner Mini Shots", price: 700 },
      { name: "Sma* Shots", price: 700 },
    ],
  },
  {
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
        price: "Varies",
        description: "• Prices may vary • Availability depends on what ingredients are in stock, as well as the moods and creativity of our staff. • We often add new products to our inventory before we update the menu so please ask the staff if there are any new items.",
      },
    ],
  },
];

const FxxkupMenuWrapper = styled.div`
  // Add styles here
`;

const CategoryTitle = styled.h2`
  // Add styles here
`;

const MenuItem = styled.div`
  margin-bottom: 10px;
  // Add styles here
`;

const MenuItemName = styled.span`
  font-weight: bold;
  // Add styles here
`;

const MenuItemPrice = styled.span`
  float: right;
  // Add styles here
`;

const MenuItemDescription = styled.div`
  font-style: italic;
  // Add styles here
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
`

const Subhead = styled.h3`
    color: var(--danger-500);
`;

const FxxkupMenu: React.FC = () => {
  const { language, content } = useLanguage(); // Pull language and content dynamically

  return (
    <FxxkupMenuWrapper>
      <MenuTop>
        <MenuLogo src={fxxkupLogo} alt="Fxxkup Logo" />
        <h1>Drink Menu</h1>
        <Subhead>¥500 cover charge per-person</Subhead>
      </MenuTop>
      <div className="auto-grid-medium">
        {menuData.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <CategoryTitle>
              <TranslationWrapper
                targetLanguage={language}
                originalLanguage="en"
              >
                {content[category.category] || category.category}
              </TranslationWrapper>
            </CategoryTitle>
            {category.items.map((item, itemIndex) => (
              <MenuItem key={itemIndex}>
                <MenuItemName>
                  <TranslationWrapper
                    targetLanguage={language}
                    originalLanguage="en"
                  >
                    {content[item.name] || item.name}
                  </TranslationWrapper>
                </MenuItemName>
                <MenuItemPrice>¥{item.price}</MenuItemPrice>
                {item.description && (
                  <MenuItemDescription>
                    <TranslationWrapper
                      targetLanguage={language}
                      originalLanguage="en"
                    >
                      {content[item.description] || item.description}
                    </TranslationWrapper>
                  </MenuItemDescription>
                )}
              </MenuItem>
            ))}
          </div>
        ))}
      </div>
    </FxxkupMenuWrapper>
  );
};

export default FxxkupMenu;

import React, { ReactNode } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TabButton = styled.button<{ $isActive: boolean; $hasLabel: boolean }>`
  background: ${(props) => (props.$isActive ? "var(--dark)" : "transparent")};
  cursor: pointer;
  color: ${(props) => (props.$isActive ? "var(--white) !important" : "var(--secondary) !important")};
  display: flex;
  border-radius: 0;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex-grow: ${(props) => (props.$isActive ? 1.5 : 1)};
  gap: ${(props) => (props.$hasLabel ? "var(--space-1)" : 0)};
  position: relative;
  padding: 1em;
  &:hover {
    background: var(--dark);
    color: var(--white);
    transform-origin: bottom;
  }

  @media (min-width: 576px) {
    flex-grow: unset;
    padding: var(--space-2);
    flex-direction: row;
  }

  &:first-of-type {
    border-radius: var(--space-1) 0 0 var(--space-1);
  }

  &:last-of-type {
    border-radius: 0 var(--space-1) var(--space-1) 0;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  background: var(--primary);
  text-shadow: 0 0 3px white;
  color: white;
  border-radius: 50% 50% 50% 0;
  box-shadow: 0 0 6px var(--primary);
  padding: 0.2rem 0.6rem;
  font-size: var(--font-size-small);
  min-width: 2rem;
  height: 2rem;
  font-family: var(--font-family-data);
`;

const TabsContainer = styled.div`
  display: flex;
  border-radius: var(--space-1);
  border: 1px solid var(--dark);
  
`;

const TabContent = styled.div`
  margin-top: var(--space-2);
`;

const Label = styled.span`
  display: none;
  font-size: var(--font-size-small);
  
  @media (min-width: 420px) {
    display: flex;
    }
    
    @media (min-width: 576px) {
      margin-left: var(--space-1);
    font-size: var(--font-size-default);
    margin: 0;
  }
`;

interface TabProps {
  label?: string;
  icon: any;
  children?: ReactNode;
  badge?: number | null;
}

interface TabsProps {
  children: ReactNode;
  activeTab: number;
  onTabClick: (index: number) => void;
}

const Tabs: React.FC<TabsProps> = ({ children, activeTab, onTabClick }) => {
  return (
    <>
      <TabsContainer>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null;
          const { label, icon, badge } = child.props as TabProps;
          return (
            <TabButton
              key={index}
              $isActive={index === activeTab}
              $hasLabel={!!label}
              onClick={() => onTabClick(index)}
            >
              <FontAwesomeIcon icon={icon} />
              <Label>{label}</Label>
              {badge && <Badge>{badge}</Badge>}
            </TabButton>
          );
        })}
      </TabsContainer>
      <TabContent>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null;
          return index === activeTab ? child.props.children : null;
        })}
      </TabContent>
    </>
  );
};

export const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>;
};

export default Tabs;

import React, { useState, ReactNode } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface TabProps {
  label: string;
  icon: any; // Add the icon prop
  children: ReactNode;
}

interface TabsProps {
  children: ReactNode;
}

const TabButton = styled.button<{ isActive: boolean }>`
  background: ${(props) => (props.isActive ? "var(--dark)" : "transparent")};
  cursor: pointer;
  color: ${(props) => (props.isActive ? "var(--white) !important" : "var(--secondary) !important")};
  border-radius: var(--space-1) var(--space-1) 0 0;
  display: flex;
  align-items: center;
  padding: var(--space-2) 0;
  flex-direction: column;
  flex-grow: ${(props) => (props.isActive ? 2 : 1)};
  gap: 0;

  &:hover {
    background: var(--dark);
    color: var(--white);
  }

  @media (min-width: 576px) {
    flex-grow: unset;
    padding: var(--space-2) var(--space-3);
    flex-direction: row;
    gap: var(--space-1);
  }
`;

const TabContent = styled.div`
  margin-top: var(--space-3);
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid var(--secondary);
`;

const Label = styled.span`
  display: none;
  font-size: var(--font-size-small);

  @media (min-width: 420px) {
    display: flex;
    margin-left: 0;
    margin-top: var(--space-1);
  }

  @media (min-width: 576px) {
    font-size: var(--font-size-default);
    margin: 0;
  }
`;

const Tabs: React.FC<TabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div>
      <TabsContainer>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null;
          const { label, icon } = child.props as TabProps;
          return (
            <TabButton
              key={index}
              isActive={index === activeTab}
              onClick={() => handleTabClick(index)}
            >
              <FontAwesomeIcon icon={icon} />
              <Label>{label}</Label>
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
    </div>
  );
};

export const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>;
};

export default Tabs;

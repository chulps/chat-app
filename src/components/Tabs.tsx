import React, { ReactNode } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TabButton = styled.button<{ $isActive: boolean; $hasLabel: boolean }>`
  background: ${(props) => (props.$isActive ? "var(--dark)" : "transparent")};
  cursor: pointer;
  color: ${(props) => (props.$isActive ? "var(--white) !important" : "var(--secondary) !important")};
  border-radius: var(--space-1);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2) 0;
  flex-direction: column;
  flex-grow: ${(props) => (props.$isActive ? 1.5 : 1)};
  gap: ${(props) => (props.$hasLabel ? "var(--space-1)" : 0)};
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
`;

const TabsContainer = styled.div`
  display: flex;
`;

const TabContent = styled.div`
  margin-top: var(--space-2);
`;

const Label = styled.span`
  display: none;
  font-size: var(--font-size-small);
  margin-left: var(--space-1);

  @media (min-width: 420px) {
    display: flex;
    margin-top: var(--space-1);
  }

  @media (min-width: 576px) {
    font-size: var(--font-size-default);
    margin: 0;
  }
`;

interface TabProps {
  label?: string;
  icon: any;
  children?: ReactNode;
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
          const { label, icon } = child.props as TabProps;
          return (
            <TabButton
              key={index}
              $isActive={index === activeTab}
              $hasLabel={!!label}
              onClick={() => onTabClick(index)}
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
    </>
  );
};

export const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>;
};

export default Tabs;

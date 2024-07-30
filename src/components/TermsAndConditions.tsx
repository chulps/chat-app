import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: var(--space-7);
`;

const Title = styled.h1`
  text-align: left;
`;

const Section = styled.section`
  margin-bottom: var(--space-4);
`;

const TermsAndConditions: React.FC = () => {
  return (
    <Container>
      <Title>Terms and Conditions</Title>
      <Section>
        <h2>Introduction</h2>
        <p>Welcome to our application. By accessing or using our service, you agree to be bound by these terms and conditions.</p>
      </Section>
      <Section>
        <h2>Use of the Service</h2>
        <p>You agree to use the service only for lawful purposes and in accordance with these terms. You agree not to use the service:</p>
        <ul>
          <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
          <li>To exploit, harm, or attempt to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.</li>
          <li>To send, knowingly receive, upload, download, use, or re-use any material which does not comply with these terms.</li>
        </ul>
      </Section>
      <Section>
        <h2>Intellectual Property</h2>
        <p>The service and its original content, features, and functionality are and will remain the exclusive property of the company and its licensors.</p>
      </Section>
      <Section>
        <h2>Termination</h2>
        <p>We may terminate or suspend your access to the service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the terms.</p>
      </Section>
      <Section>
        <h2>Changes to the Terms</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these terms at any time. What constitutes a material change will be determined at our sole discretion.</p>
      </Section>
      <Section>
        <h2>Contact Us</h2>
        <p>If you have any questions about these terms, please contact us at support@example.com.</p>
      </Section>
    </Container>
  );
};

export default TermsAndConditions;

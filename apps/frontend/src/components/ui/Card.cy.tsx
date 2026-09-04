import React from 'react';
import { mount } from '@cypress/react18';
import { Card, CardHeader, CardBody, CardFooter } from './Card';
import '../../styles/tokens.css';
import '../../styles/globals.css';

describe('Card Component', () => {
  it('renders card with all sections', () => {
    mount(
      <Card>
        <CardHeader>Header Content</CardHeader>
        <CardBody>Main Body</CardBody>
        <CardFooter>Footer Content</CardFooter>
      </Card>
    );
    
    cy.get('.card').should('exist');
    cy.get('.card-header').should('contain.text', 'Header Content');
    cy.get('.card-body').should('contain.text', 'Main Body');
    cy.get('.card-footer').should('contain.text', 'Footer Content');
  });
});

import React from 'react';
import { mount } from '@cypress/react18';
import { Button } from './Button';
import '../../styles/tokens.css';
import '../../styles/globals.css';

describe('Button Component', () => {
  it('renders with children', () => {
    mount(<Button>Click Me</Button>);
    cy.get('button').should('contain.text', 'Click Me');
  });

  it('handles click events', () => {
    const onClickSpy = cy.spy().as('onClickSpy');
    mount(<Button onClick={onClickSpy}>Clickable</Button>);
    cy.get('button').click();
    cy.get('@onClickSpy').should('have.been.calledOnce');
  });

  it('renders loading state and disables button', () => {
    mount(<Button isLoading>Loading</Button>);
    cy.get('button').should('be.disabled');
    cy.get('.spinner').should('exist');
  });
});

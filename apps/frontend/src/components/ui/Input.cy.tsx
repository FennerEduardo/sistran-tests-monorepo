import React from 'react';
import { mount } from '@cypress/react18';
import { Input } from './Input';
import '../../styles/tokens.css';
import '../../styles/globals.css';

describe('Input Component', () => {
  it('renders correctly with label', () => {
    mount(<Input label="Username" placeholder="Enter username" />);
    cy.get('label').should('contain.text', 'Username');
    cy.get('input').should('have.attr', 'placeholder', 'Enter username');
  });

  it('displays error state', () => {
    mount(<Input label="Email" error="Invalid email address" />);
    cy.get('.input-error-msg').should('contain.text', 'Invalid email address');
    cy.get('input').should('have.class', 'input-error');
  });

  it('handles input events', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy');
    mount(<Input onChange={onChangeSpy} />);
    cy.get('input').type('hello');
    cy.get('@onChangeSpy').should('have.been.called');
  });
});

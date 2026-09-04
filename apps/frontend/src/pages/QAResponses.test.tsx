import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import QAResponses from './QAResponses';

describe('QAResponses Component', () => {
    it('renders the title correctly', () => {
        render(<QAResponses />);
        expect(screen.getByText('Respuestas a Preguntas Teóricas')).toBeInTheDocument();
    });

    it('renders accordion items for both tests', () => {
        render(<QAResponses />);
        expect(screen.getByText('Prueba React')).toBeInTheDocument();
        expect(screen.getByText('Prueba .NET & SQL')).toBeInTheDocument();
    });
});

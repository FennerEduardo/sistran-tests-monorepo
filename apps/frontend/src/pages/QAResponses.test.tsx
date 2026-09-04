import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import QAResponses from './QAResponses';

describe('QAResponses Component', () => {
    it('renders the title correctly', () => {
        render(<QAResponses />);
        expect(screen.getByText('Theoretical Questions & Answers')).toBeInTheDocument();
    });

    it('renders both accordion sections', () => {
        render(<QAResponses />);
        expect(screen.getByText('React Test')).toBeInTheDocument();
        expect(screen.getByText('.NET & SQL Test')).toBeInTheDocument();
    });
});

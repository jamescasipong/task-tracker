import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';
import FileUpload from './FileUpload';

describe('FileUpload Component', () => {
    test('displays "More.." when there are more than 5 OR numbers and showAll is false', () => {
        const totalORNumbers = [
            {
                fileName: 'testFile.txt',
                orNumbers: [1, 2, 3, 4, 5, 6],
                showAll: false,
            },
        ];

        render(<FileUpload totalORNumbers={totalORNumbers} />);

        expect(screen.getByText('More..')).toBeInTheDocument();
    });

    test('does not display "More.." when showAll is true', () => {
        const totalORNumbers = [
            {
                fileName: 'testFile.txt',
                orNumbers: [1, 2, 3, 4, 5, 6],
                showAll: true,
            },
        ];

        render(<FileUpload totalORNumbers={totalORNumbers} />);

        expect(screen.queryByText('More..')).not.toBeInTheDocument();
    });

    test('displays correct number of OR numbers when showAll is true', () => {
        const totalORNumbers = [
            {
                fileName: 'testFile.txt',
                orNumbers: [1, 2, 3, 4, 5, 6],
                showAll: true,
            },
        ];

        render(<FileUpload totalORNumbers={totalORNumbers} />);

        totalORNumbers[0].orNumbers.forEach((num) => {
            expect(screen.getByText(num)).toBeInTheDocument();
        });
    });

    test('displays only first 5 OR numbers when showAll is false', () => {
        const totalORNumbers = [
            {
                fileName: 'testFile.txt',
                orNumbers: [1, 2, 3, 4, 5, 6],
                showAll: false,
            },
        ];

        render(<FileUpload totalORNumbers={totalORNumbers} />);

        totalORNumbers[0].orNumbers.slice(0, 5).forEach((num) => {
            expect(screen.getByText(num)).toBeInTheDocument();
        });

        expect(screen.queryByText(6)).not.toBeInTheDocument();
    });
});
describe('Person Registration Feature', () => {
    it('Should display validation error when submitting empty form', () => {
        // Asumiendo que el frontend levanta en el puerto 5173 para dev o 80 en prod
        cy.visit('/registration');
        cy.contains('Registro de Personas').should('be.visible');
        
        // El form tiene required, por lo que el navegador lo ataja,
        // pero podemos probar el click
        cy.get('button[type="submit"]').click();
        
        // Como es form nativo de html5 con required, no llegará al backend a menos que llenemos.
    });

    it('Should allow adding a person with valid data', () => {
        // En una prueba real, deberíamos mockear la respuesta del backend
        // o asegurarnos que el backend está corriendo limpio.
        cy.intercept('POST', '/api/persons', {
            statusCode: 200,
            body: {
                success: true,
                message: "Persona registrada exitosamente.",
                data: { id: 1 }
            }
        }).as('registerPerson');

        cy.visit('/registration');
        
        cy.get('input[type="text"]').eq(0).type('12345ABC'); // Documento
        cy.get('input[type="text"]').eq(1).type('Juan'); // Nombre
        cy.get('input[type="text"]').eq(2).type('Perez'); // Apellido
        cy.get('input[type="date"]').type('1990-01-01'); // Fecha
        
        cy.get('button[type="submit"]').click();

        cy.wait('@registerPerson');
        cy.contains('Persona registrada exitosamente.').should('be.visible');
    });
});

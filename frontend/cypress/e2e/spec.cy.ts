describe('Primera prueba', () => {
  it('Esto es mas que una prueba de como tendria que actuar en el frontend', () => {
    cy.visit('/') //abre la pagina

    cy.contains('Explorar Catálogo').click()

    cy.url().should('include', '/products')

    cy.go('back')

    cy.contains('Ir al Checkout').click()

    cy.url().should('include', '/checkout')
  })
})
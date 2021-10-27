/// <reference types="cypress" />

describe('Actions', () => {
    beforeEach(() => {
        cy.visit('https://predict-webapp.herokuapp.com/')
    })

    it('Home page', () => {
        cy.visit('https://predict-webapp.herokuapp.com/')
        cy.get(':nth-child(2) > .MuiBox-root > .MuiTypography-root').should('have.text', 'Predict')
    })

    // it('Login Test', () => {
    //     cy.get('.MuiTypography-root > .MuiButtonBase-root').click()
    //     cy.get('#Email').type('smitpat2000@gmail.com')
    //     cy.get('#next').click()
    //     cy.get('#password').type('Smitp@t0013')
    //     cy.get('#submit').click()
    // })


    it('Show My Profile', () => {
        cy.get('.MuiTypography-root > .MuiButtonBase-root').click()
        cy.get(':nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click()
        cy.get('[href="/profile/608673909e6fed3064ad01c9"]').click()
    })

    it('Show Friends', () => {
        cy.get('.MuiTypography-root > .MuiButtonBase-root').click()
        cy.get(':nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click()
        cy.get('[href="/friends/0"]').click()
    })

    it('Show Rewards', () => {
        cy.get('.MuiTypography-root > .MuiButtonBase-root').click()
        cy.get(':nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click()
        cy.get('[href="/rewards"]').click()
    })

    it('Show My Battles', () => {
        cy.get('.MuiTypography-root > .MuiButtonBase-root').click()
        cy.get(':nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click()
        cy.get('[href="/bets/0"]').click()
    })

})

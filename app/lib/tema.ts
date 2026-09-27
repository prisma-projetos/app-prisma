/** Chave da escolha manual de tema; vale só na sessão (spec 020). */
export const CHAVE_TEMA = "prisma-theme";

/**
 * Roda no <head>, antes da primeira pintura: aplica a escolha da sessão ou,
 * sem ela, o tema do sistema. Apaga a escolha antiga do localStorage (versões
 * anteriores gravavam lá e prendiam o visitante num tema).
 */
export const SCRIPT_TEMA_INICIAL = `(function(){var k=${JSON.stringify(CHAVE_TEMA)};try{localStorage.removeItem(k)}catch(e){}var s=null;try{s=sessionStorage.getItem(k)}catch(e){}var t=s==="dark"||s==="light"?s:(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t)})()`;

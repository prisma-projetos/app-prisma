# Botão "Ver candidatos" no topo do partido

## Objetivo
Pedido de Bea (27/09/2026): a página do partido ganha, logo no início, o botão "Ver candidatos", que leva à lista de candidatos já filtrada pelo partido.

## Escopo
- Botão secundário (borda de 2px em tinta, 48px de altura) "Ver candidatos do {sigla}" ao lado do cabeçalho do partido (abaixo dele no celular), apontando para `/candidatos?partido={numero}`.
- A lista de candidatos no fim da página do partido continua como está.

## Critérios de aceite
- [ ] Na página do partido 55, o link "Ver candidatos do PSD" aponta para `/candidatos?partido=55`.
- [ ] O link aparece logo após o cabeçalho do partido, antes do seletor de janela.
- [ ] Sem sigla, o texto é "Ver candidatos do partido".

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Eleitor comum, inclusive pessoas com baixo letramento digital. Chega querendo saber o que a imprensa está publicando sobre um partido ou candidato, muitas vezes pelo celular, sem conhecer termos como "análise de sentimento" ou "janela". Jornalistas e pesquisadores também usam, mas não são o foco das decisões.

## Product Purpose

O PRISMA coleta matérias publicadas na internet, identifica os partidos e políticos citados e classifica o teor de cada trecho em relação à entidade: positivo, neutro ou negativo. A interface mostra esse retrato por entidade, por tema e por veículo, sempre com link para a matéria de origem.

Sucesso: uma pessoa encontra o partido ou candidato que procura, entende o que o resultado quer dizer e consegue chegar à matéria que o sustenta.

## Positioning

O PRISMA mede o teor do que foi publicado sobre cada entidade, não o viés da fonte. Não classifica veículos nem pessoas em espectro ideológico e não diz qual lado está certo. Todo número é rastreável até as matérias. O README antigo, que fala em "classificação de viés", está desatualizado.

## Operating Context

- Consulta pública, sem login. O produto será publicado e monetizado por anúncios (ver `../context.md`).
- Período de eleição: o recorte de candidaturas segue `ANO_ELEICAO` (hoje 2026).
- Dados vêm da API Prisma (Spring), consumida por um proxy no servidor do Next.js.

## Capabilities and Constraints

- Hoje: lista de partidos, página de partido, página de político, sentimento agregado, temas, veículos, menções e matérias, com filtro de período por `janela` (mês).
- Ainda não existem: título da matéria, filtro por UF, lista de meses com dados, resultado de eleição confiável além da situação do turno. Detalhes em `../prisma-plano-frontend.md`.
- Terminologia: entidade (partido ou político), sentimento (positivo, neutro, negativo), tema, veículo, menção, matéria.
- A classificação é feita por modelos de IA e pode errar; isso precisa estar visível onde houver resultado.
- Regras de UI e glossário obrigatórios estão em `CLAUDE.md`: termos sem sinônimos (entidade, sentimento negativo/neutro/positivo, panorama, fonte, janela), ordem fixa Negativo, Neutro, Positivo, texto exato do aviso de IA, e panorama sempre com "Gerado por IA" + nome do modelo + fontes. Explicações simples ("critica", "só informa", "elogia") entram ao lado do termo, nunca no lugar dele.

## Brand Commitments

- Nome: PRISMA.
- Neutralidade partidária absoluta: nenhuma cor de partido e nada que lembre um partido na interface. As logos dos partidos aparecem como vieram.
- Identidade de prisma confirmada por Bea: preto, branco e o espectro da luz decomposta como marca. O espectro nunca codifica dado.
- Nada de preto 100% nem branco 100% (decisão de Bea, 25/09/2026): o "preto" e o "branco" da interface são quase-preto e quase-branco neutros.
- Sentimento em tons neutros; nenhuma cor sugere que "positivo" é bom.

## Evidence on Hand

- Dados reais pela API (logos dos partidos, candidaturas, análises).
- Não há depoimentos, números de uso nem imprensa sobre o produto. Não inventar.

## Product Principles

1. Rastreável: todo resultado leva à matéria que o sustenta.
2. Neutro: a interface não favorece nem pune nenhuma entidade, nem pela ordem, nem pela cor.
3. Claro para quem não é especialista: texto simples antes do método; explicação técnica fica disponível, não em primeiro plano.
4. Honesto sobre limites: dado ausente aparece como ausente, sem suposição, e a origem por IA é declarada.

## Accessibility & Inclusion

WCAG AA em claro e escuro. Público com baixo letramento digital: textos curtos e simples, alvos de toque grandes, hierarquia óbvia, uso pleno no celular e por teclado. Informação nunca depende só de cor.

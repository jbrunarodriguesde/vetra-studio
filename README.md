# Vetra Studio
**Demonstração fictícia para portfólio — em desenvolvimento.** Interface editorial em marfim, sálvia e bronze; Next.js App Router, TypeScript, Prisma e PostgreSQL.

## Executar
Copie `.env.example` para `.env` e substitua o segredo de sessão.
```
npm install
docker compose up -d
npx prisma generate
npx prisma migrate deploy
npx tsx prisma/seed.ts
npm run dev
```
Contas: cliente@vetra.demo, profissional@vetra.demo, admin@vetra.demo. Senha demonstrativa: VetraDemo2026!

## Arquitetura
API em app/api/studio. Sessão JWT em cookie HttpOnly e SameSite strict. Autorização por proprietário e papel no servidor. Valores em centavos; instantes timestamptz UTC, apresentação America/Sao_Paulo. Jornada em minutos locais, pausa de almoço e buffer entre reservas. Transação com trava por profissional e exclusão de intervalos PostgreSQL protege reservas concorrentes. Dados e fotos ilustrativos. Fotografias remotas Unsplash; revisar ativos antes de distribuição comercial.

## Estudo de caso
Problema: transformar descoberta de cuidados em uma reserva clara no celular. Solução: seleção direta, horários em botões e resumo persistente. A landing editorial mantém a marca, enquanto as telas operacionais priorizam legibilidade.

## Limitações atuais
Ainda faltam gestão de serviços/jornadas/bloqueios pela interface, remarcação atômica, adaptação real de e-mail, agenda seed variada, testes de integração de concorrência/autorização e Playwright. Rate limit em memória é apenas local por processo. Não há publicação configurada. Não considerar pronto para produção.

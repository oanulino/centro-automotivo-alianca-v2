# A/B — Centro Automotivo Aliança v2 (estilo DM)

**Cliente:** Centro Automotivo Aliança · Matheus
**Deploy v1 (produção):** https://centro-automotivo-alianca.vercel.app/
**Deploy v2 (A/B):** https://centro-automotivo-alianca-v2.vercel.app/ (a criar)
**Objetivo:** Comparar CPL entre v1 (preto+vermelho) e v2 (azul-marinho+DM-style) com split de tráfego.

## Origem da inspiração
Referência visual: [oficinadm.com.br](https://oficinadm.com.br/) (Domingos Martins Auto Center, 60 anos de mercado).

## Diferenças vs v1 (produção)

| Elemento | v1 (produção) | v2 (experimento) |
|---|---|---|
| Paleta primária | Preto-grafite + vermelho (#E10600) | Azul-marinho (#1B2C4F) + azul vibrante (#2C7DA0) |
| Headline | "Seu carro dando sinal de problema? A gente resolve direito." | "Seu carro na mão certa. **30 anos de estrada provam isso.**" |
| Proof-stat | "Mais de 30 anos" no badge | "30 anos de estrada provam isso" no h1 |
| Prova social | Card com 4 avatares + 5 estrelas, **depois** do CTA | (a) Faixa pill **antes** do badge + (b) card com 5 avatares + "+", entre sub e CTA |
| Trust bar | Não tem | Faixa azul-marinho com 3 checks: Diagnóstico / Orçamento / Garantia |
| Cards de serviço | Borda neutra | Gradiente branco→cinza + hover com borda azul |
| Número "+500 clientes" | Não tem | Tem, no pill do topo |

## Como abrir local

```bash
cd /root/claudi-o/lp-variacoes/alianca-v2
python3 -m http.server 8081
# Acessa: http://localhost:8081
```

## Tracking A/B
Pra rodar teste real:
- v1: `https://centro-automotivo-alianca.vercel.app/?v=1` (ou só a URL raiz)
- v2: `https://centro-automotivo-alianca-v2.vercel.app/?v=2`
- Comparar CPL via dataLayer push de `ab_variant` no GTM
- O header `X-A-B-Variant: v2-dm-style` é injetado pelo `vercel.json` pra facilitar debug

## Métricas-alvo
- **Primário:** CPL (custo por lead WhatsApp)
- **Secundário:** scroll_depth_50 (engajamento), whatsapp_click (conversão direta)
- **Hipótese:** v2 deve converter melhor por causa do proof-stat gigante no hero + trust bar abaixo

## Quando o Matheus decidir
1. Se **v2 ganhar**: mover `index.html` da v2 pra raiz do repo `oanulino/centro-automotivo-alianca`, ajustar paleta
2. Se **v1 ganhar**: continuar com a versão atual
3. Se **empate**: fazer mistura — manter prova social no topo da v2 + paleta preto+vermelho da v1

## Deploy
- Workflow: `.github/workflows/deploy-v2.yml` (criar)
- Trigger: push em `lp-variacoes/alianca-v2/**` na main do monorepo `claudi-o`
- Hook: `VERCEL_DEPLOY_HOOK_V2` (criar no painel Vercel)

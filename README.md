# n8n-nodes-cortex-filters

Community node do n8n: um **HTTP Request** com campos dedicados para o
[spatie/laravel-query-builder](https://spatie.be/docs/laravel-query-builder) —
filters, includes, sorts, fields, appends e paginação, sem montar query string na mão.

| Campo no node | Query string gerada |
|---|---|
| Filters (nome, operador opcional, valor) | `filter[nome]=valor` · `filter[nome][op]=valor` |
| Includes | `include=posts,posts.comments` |
| Sorts (campo + asc/desc) | `sort=-created_at,name` |
| Select Fields (tabela opcional) | `fields[leads]=id,name` — sem tabela, usa o recurso do endpoint (`/leads` → `leads`) |
| Appends | `append=full_name` |
| Pagination (página única ou todas) | `page=1&per_page=50` |

Os nomes dos parâmetros (`filter`, `include`, `sort`, `fields`, `append`, `page`, `per_page`)
podem ser trocados em **Options**, caso você tenha alterado o config do Laravel.

## Instalação no n8n

Pacote no npm: [n8n-nodes-cortex-filters](https://www.npmjs.com/package/n8n-nodes-cortex-filters)

### Opção 1 — pela interface (recomendado)

1. No n8n, vá em **Settings → Community Nodes → Install**.
2. Digite o nome do pacote:

```
n8n-nodes-cortex-filters
```

3. Marque a caixa de confirmação de risco e clique em **Install**.
4. O node **Cortex Filters** aparece na busca de nodes.

### Opção 2 — n8n self-hosted (npm / Docker)

Dentro da pasta de nodes do n8n (`~/.n8n/nodes`; no Docker, `/home/node/.n8n/nodes`):

```bash
mkdir -p ~/.n8n/nodes && cd ~/.n8n/nodes
npm install n8n-nodes-cortex-filters
```

Reinicie o n8n. No Docker, rode os mesmos comandos dentro do container (o volume precisa ser persistente):

```bash
docker compose exec n8n sh -c "mkdir -p /home/node/.n8n/nodes && cd /home/node/.n8n/nodes && npm install n8n-nodes-cortex-filters"
docker compose restart n8n
```

### Instalar direto do GitHub (versão em desenvolvimento)

```bash
cd ~/.n8n/nodes && npm install github:Plurinvest/n8n-nodes-cortex-filters
```

### Atualizar

Pela interface: Settings → Community Nodes → Update. Ou:

```bash
cd ~/.n8n/nodes && npm update n8n-nodes-cortex-filters
```

## Uso

1. (Opcional) Crie a credencial **Cortex Filters API**: Base URL + autenticação por **Query Parameter** (`?api_token=…`, o nome do parâmetro é editável), Bearer token ou header customizado.
2. Adicione o node **Cortex Filters**, escolha o método e o endpoint (`/users`), ou uma URL completa.
3. Preencha Filters / Includes / Sorts / Fields / Appends.
4. Cada item de `data` na resposta vira um item de saída (mude em Options → Data Property).

Exemplo — `GET /users` com:
- Filter `status = active`, Filter `age` operador `gte` valor `18`
- Includes `posts,profile` · Sort `created_at` desc · Fields `users` → `id,name`

gera:

```
/users?filter[status]=active&filter[age][gte]=18&include=posts,profile&sort=-created_at&fields[users]=id,name
```

> O operador é opcional e só faz sentido se sua API tiver filtros customizados que aceitem `filter[campo][op]`.
> O Spatie puro usa apenas `filter[campo]=valor`.

## Desenvolvimento

```bash
npm install
npm run build      # gera dist/ (que é versionado para permitir instalar via GitHub)
```

Para testar localmente: `npm link` nesta pasta e `npm link n8n-nodes-cortex-filters` em `~/.n8n/nodes`.

## Publicação automática

Todo push na `main` dispara o workflow `.github/workflows/publish.yml`: ele compila, publica no npm e,
se a versão do `package.json` já existir no npm, sobe o patch automaticamente (0.2.0 → 0.2.1) e
commita a nova versão de volta. Para uma versão minor/major, altere o `version` no `package.json`
antes do push. Requer o secret `NPM_TOKEN` no repositório (token granular com bypass de 2FA).

## Licença

MIT

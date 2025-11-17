# Word-to-PDF Converter
- [PT-BR 🇧🇷](#versão-em-português)

---

# Versão em Português

## O Que Faz?
Este projeto **Node.js** automatiza a criação de documentos. Ele combina o preenchimento dinâmico de um template **DOCX** com dados de um arquivo **JSON** e, em seguida, converte o documento final para **PDF** usando o **Adobe PDF Services SDK**.

Funcionalidade principal: Gerar um relatório de filmes com listas hierárquicas (por gênero) a partir de dados JSON.

---

## Como Funciona?
O projeto é dividido em duas etapas principais: Preenchimento (feito localmente) e Conversão (feita pela Adobe).
 
1. Preenchimento do Template (`fillTemplate.js`):

- Lê o arquivo de dados (`/data/filmes.json`).
- Carrega o template DOCX (`/templates/template-filmes.docx`).
- Utiliza a biblioteca `docxtemplater` para substituir placeholders (sintaxe **Mustache**) por valores do JSON.
- Salva o DOCX preenchido em `/output/resultado.docx`.

---

2. Conversão para PDF (`generatePdf.js`):

- Utiliza o **Adobe PDF Services SDK** para autenticação (via Client ID e Client Secret).
- Faz o upload do DOCX preenchido para os servidores da Adobe (criação do Asset).
- Cria e monitora um Job de conversão de DOCX para PDF.
- Baixa o PDF final e o salva em `/output/resultado.pdf`.

### Uso dos placeholders no DOCX
O template utiliza sintaxe estilo Mustache:

- `{titulo_relatorio}`
- `{subtitulo_relatorio}`
- `{nome_autor}`
- `{#generos} ... {/generos}`
- `{#filmes} ... {/filmes}`

Isso permite montar listas dinâmicas como:

```
{{#generos}}
Gênero: {{nome_genero}}
{{#filmes}}
Título: {{titulo}}
Ano: {{ano}}
...
{{/filmes}}
{{/generos}}
```

---

## Estrutura do projeto
```
WORD-TO-PDF/
├── data/
│   └── filmes.json
├── output/
├── src/
│   └── fillTemplate.js
│   └── generatePdf.js
│   └── index.js
├── templates/
│   └── template-filmes.docx
├── package.json
├── package-lock.json
├── README.md
```

---

## Exemplo real de JSON utilizado
(Arquivo: `/data/filmes.json`)

```json
{
    "titulo_relatorio": "LISTA DE FILMES:",
    "subtitulo_relatorio": "Sinopse & Avaliação",
    "nome_autor": "Gabriella S. Batista",
    "generos": [
        {
            "nome_genero": "Terror",
            "filmes": [
                {
                    "titulo": "Rosemary's Baby",
                    "ano": "1968",
                    "diretor": "Roman Polanski",
                    "duracao": "2h17m",
                    "pais_origem": "EUA / Reino Unido",
                    "avaliacao_rt": "97%",
                    "sinopse": "Uma jovem grávida começa a suspeitar que seus vizinhos pertencem a um culto envolvido com seu filho."
                }
            ]
        }
    ]
}
```

---

## Como rodar
1. Intale as dependências.
```bash
npm install
```

2. Configuração da Adobe.
Crie um arquivo chamado `.env` na raiz do projeto e configure suas credenciais do **Adobe PDF Services SDK (Service Account OAuth)**.

```bash
# .env file
# Credenciais obtidas na Adobe Developer Console (Service Account)
PDF_SERVICES_CLIENT_ID=sua_client_id_aqui
PDF_SERVICES_CLIENT_SECRET=seu_client_secret_aqui
```

3. Executar o projeto
```
node src/index.js
```
O arquivo `resultado.pdf` e o arquivo `doc-preenchido.docx` temporário serão gerados na pasta `/output`.

---

## Dependências principais
- **@adobe/pdfservices-node-sdk**: Gerencia a autenticação e a conversão DOCX → PDF.
- **docxtemplater** e **PizZip**: Usados para o preenchimento local do template DOCX.
- **Node.js**: Ambiente de execução.

---
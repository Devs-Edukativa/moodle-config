# Máscaras customizadas do Simple Certificate

Este documento descreve todas as máscaras (variáveis de substituição) disponíveis no plugin `mod_simplecertificate` do Moodle.

## O que são máscaras?

Máscaras são variáveis no formato `{$a->variavel}` que podem ser inseridas no editor de texto do certificado. No momento da geração do PDF, essas variáveis são substituídas pelos valores reais correspondentes ao usuário e ao curso.

### Exemplo
Se você inserir no texto do certificado:
```
Este certificado foi emitido para {$a->userfullname}
no curso {$a->coursename}
Período: {$a->courseperiod}
```

O resultado será:
```
Este certificado foi emitido para João Silva
no curso Programação Avançada
Período: 15/06/2025 a 10/10/2025
```

---

## Máscaras padrão do Moodle

Essas máscaras são fornecidas nativamente e funcionam em qualquer instalação do Moodle:

### Dados do usuário

| Máscara | Descrição |
|---------|-----------|
| `{$a->username}` | Nome completo do usuário (sinônimo de `userfullname`) |
| `{$a->userfullname}` | Nome completo do usuário (formato preferido) |
| `{$a->firstname}` | Primeiro nome |
| `{$a->lastname}` | Sobrenome/última nome |
| `{$a->email}` | Endereço de e-mail |
| `{$a->idnumber}` | Campo de ID do usuário (pode ser matrícula, CPF, etc) |
| `{$a->institution}` | Instituição/Empresa |
| `{$a->department}` | Departamento |
| `{$a->city}` | Cidade |
| `{$a->address}` | Endereço completo |
| `{$a->phone1}` | Telefone 1 |
| `{$a->phone2}` | Telefone 2 |
| `{$a->country}` | País (nome traduzido conforme idioma do Moodle) |
| `{$a->identity}` | Identidade bruta (disponível somente se `enableidentity` estiver ativado nas configurações do plugin) |

### Dados do curso

| Máscara | Descrição |
|---------|-----------|
| `{$a->coursename}` | Nome do curso |
| `{$a->grade}` | Nota/Grade do aluno (conforme configurada na atividade) |
| `{$a->date}` | Data de emissão do certificado (formatada conforme configuração) |
| `{$a->code}` | Código único do certificado (usado para verificação) |

---

## Máscaras customizadas (Simple Certificate)

Essas máscaras foram implementadas especificamente para o plugin Simple Certificate e realizam processamento/formatação adicional.

### `{$a->cpfmask2}` — CPF com mascaramento LGPD

**Implementado em:** `locallib.php` → método `format_cpf()`

**Formato de saída:** `***.XXX.XXX-**`

Exibe apenas os 6 dígitos centrais do CPF, ocultando os 3 primeiros e os 2 últimos. Esta máscara foi implementada para atender requisitos de privacidade (LGPD) ao expor o CPF em documentos impressos.

#### Funcionamento

1. Remove todos os caracteres não numéricos do campo `username` do usuário
2. Verifica se o resultado tem exatamente 11 dígitos
3. Se sim, formata como `***.XXX.XXX-**` (exibindo posições 3-8 do CPF)
4. Se não, retorna o valor original sem formatação (não é um CPF válido)

#### Exemplos

| Username | Saída |
|----------|-------|
| `12345678901` | `***.456.789-**` |
| `123.456.789-01` | `***.456.789-**` |
| `joão` | `joão` (não é CPF, retorna original) |
| `1234` | `1234` (menos de 11 dígitos, retorna original) |

#### Pré-requisitos

- O campo `username` do usuário deve conter um CPF
- Para entrada formatada (`XXX.XXX.XXX-XX`), a função remove automaticamente os pontos e hífens
- Para entrada sem formatação, deve ter exatamente 11 dígitos

#### Implementação

```php
protected function format_cpf($value) {
    // Remove todos os caracteres não numéricos.
    $cpf = preg_replace('/[^0-9]/', '', $value);
    
    // Verifica se temos exatamente 11 dígitos (CPF válido).
    if (strlen($cpf) != 11) {
        // Se não, retorna o valor original.
        return strip_tags($value);
    }
    
    // Formata como ***.XXX.XXX-** (mostrando apenas os 6 dígitos do meio).
    return '***.' . 
           substr($cpf, 3, 3) . '.' . 
           substr($cpf, 6, 3) . '-**';
}
```

---

### `{$a->courseperiod}` — Período do curso por aluno

**Implementado em:** `locallib.php` → método `format_course_period()` + bloco em `get_certificate_text()`

**Formato de saída:** `DD/MM/AAAA a DD/MM/AAAA`

Exibe o período real de participação do aluno no curso. Diferente do comportamento anterior que mostrava o período inteiro do curso, essa máscara busca as datas reais de matrícula e conclusão de cada aluno individualmente.

#### Dates utilizadas

- **startdate (início):** Quando o aluno iniciou sua participação no curso
- **enddate (fim):** Quando o aluno completou o curso

#### Lógica de obtenção de datas

##### Data de início (`startdate`)

Hierarquia de busca:

1. **Primeira tentativa:** Busca o `timestart` do usuário na tabela `{user_enrolments}`
   - Executa uma query que busca o **menor `timestart`** (mais antiga matrícula) onde `timestart > 0`
   - Conecta com a tabela `{enrol}` para filtrar pelo course correto
   
2. **Fallback:** Se o usuário não tiver `timestart` definido (matrícula manual sem data)
   - Usa o `startdate` da tabela `{course}`
   - Representa o início teórico do curso

##### Data de término (`enddate`)

Hierarquia de busca:

1. **Primeira tentativa:** Busca o `timecompleted` do usuário na tabela `{course_completions}`
   - Executa uma query buscando o **maior `timecompleted`** (mais recente conclusão)
   - Representa quando o aluno realmente completou o curso

2. **Fallback:** Se o usuário não tiver conclusão registrada
   - Usa a data de **emissão do certificado** (`issuecert->timecreated`)
   - Útil em turmas contínuas onde o aluno ainda está estudando

#### Tabelas consultadas

| Tabela | Campo | Propósito |
|--------|-------|-----------|
| `mdl_user_enrolments` | `timestart` | Data de matrícula do usuário |
| `mdl_enrol` | `courseid` | Vínculo entre matrícula e curso |
| `mdl_course_completions` | `timecompleted` | Data de conclusão do curso |
| `mdl_course` | `startdate` | Fallback: início teórico do curso |
| `mdl_simplecertificate_issues` | `timecreated` | Fallback: quando certificado foi emitido |

#### Exemplos de comportamento

**Caso 1: CaBeginning e conclusão claras (cenário ideal)**

```
Matrícula: 15/06/2025
Conclusão: 10/10/2025
Certificado emitido em: 11/10/2025
```

Resultado: `15/06/2025 a 10/10/2025`

Explicação: Valores reais das tabelas `user_enrolments` e `course_completions`

---

**Caso 2: Matrícula manual + conclusão registrada**

```
Matrícula: (sem timestart, inserida manualmente)
Curso iniciou: 01/01/2025
Conclusão: 20/08/2025
```

Resultado: `01/01/2025 a 20/08/2025`

Explicação:
- startdate: usa `course.startdate` (fallback, pois não tem `timestart`)
- enddate: usa `course_completions.timecompleted` (conclusão real)

---

**Caso 3: Turma contínua, aluno ainda estudando**

```
Matrícula: 15/03/2026
Conclusão: (nenhuma registrada)
Certificado emitido: 27/02/2026
```

Resultado: `15/03/2026 a 27/02/2026`

Explicação:
- startdate: usa `user_enrolments.timestart` (matrícula real)
- enddate: usa `issuecert.timecreated` (fallback para emissão)

---

**Caso 4: Turma contínua, matrícula e conclusão não claras**

```
Matrícula: (manual, sem timestart)
Curso iniciou: 01/01/2025
Conclusão: (nenhuma)
Certificado emitido: 27/02/2026
```

Resultado: `01/01/2025 a 27/02/2026`

Explicação:
- startdate: `course.startdate` (fallback duplo, sem matrícula real)
- enddate: `issuecert.timecreated` (fallback duplo, sem conclusão)

#### SQL executado

**Query de matrícula:**
```sql
SELECT MIN(ue.timestart) AS timestart
  FROM {user_enrolments} ue
  JOIN {enrol} e ON ue.enrolid = e.id
 WHERE e.courseid = :courseid
   AND ue.userid = :userid
   AND ue.timestart > 0
```

**Query de conclusão:**
```sql
SELECT MAX(c.timecompleted) AS timecompleted
  FROM {course_completions} c
 WHERE c.userid = :userid
   AND c.course = :courseid
```

---

## Como adicionar uma nova máscara

Se você precisar criar uma nova máscara customizada:

### 1. Implemente o método de formatação (se necessário)

Adicione um método `protected` em `locallib.php`:

```php
protected function format_minha_mascara($value) {
    // Sua lógica aqui
    return $resultado;
}
```

### 2. Populate o objeto `$a` em `get_certificate_text()`

Procure o método `get_certificate_text()` em `locallib.php` e adicione uma linha:

```php
$a->minhanovamascara = $this->format_minha_mascara($value);
```

Ou, se for simples:

```php
$a->minhanovamascara = 'valor direto';
```

### 3. Documente a nova máscara

Adicione uma entrada na seção "Máscaras customizadas" acima com:
- Descrição clara
- Formato de saída
- Exemplos
- Qualquer dado que precisa estar populado antes de usar

### 4. Teste em homologação

Sempre teste a nova máscara em um ambiente de staging antes de promover para produção.

---

## Notas importantes

- Todas as máscaras são case-sensitive: `{$a->coursename}` ≠ `{$a->CourseName}`
- As máscaras são processadas por `get_string()`, que faz a interpolação
- Se uma máscara não existir, ela permanecerá literal no certificado (ex: `{$a->variavelinexistente}`)
- Sempre use `strip_tags()` ao popular máscara com dados do usuário (proteção contra XSS)
- Para campos numéricos de grande valor (timestamps), sempre faça cast para `(int)` antes de processar

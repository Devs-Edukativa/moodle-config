# CHANGELOG — Simple Certificate

Todas as alterações significativas neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) e este projeto segue [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- **Nova classe de evento:** `mod_simplecertificate\event\certificate_issued`
  - Dispara quando um certificado é emitido (insert na tabela `simplecertificate_issues`)
  - Inclui contexto completo: código, course ID, certificate ID, nome do curso
  - Permite observadores externos (como `local_edukativa_apis`) reagir à emissão de certificados
  - **Arquivo:** `classes/event/certificate_issued.php`

- **Nova máscara customizada:** `{$a->courseperiod}`
  - Exibe período real de participação do aluno: data de matrícula → data de conclusão
  - Busca `user_enrolments.timestart` (com fallback para `course.startdate`)
  - Busca `course_completions.timecompleted` (com fallback para data de emissão)
  - Ideal para turmas contínuas onde a data de fim não é fixa
  - **Arquivo:** `locallib.php`, método `get_certificate_text()`

- **Documentação das máscaras:** `docs/masks.md`
  - Guia completo de todas as máscaras padrão e customizadas
  - Explicação detalhada do funcionamento de `courseperiod` com 4 cenários de uso
  - SQL das queries de lookup incluído
  - Instruções para adicionar novas máscaras

- **Strings de idioma para novo evento:**
  - `eventcertificate_issued`
  - `eventcertificate_issued_description`
  - **Arquivo:** `lang/en/simplecertificate.php`

### Changed
- **`locallib.php` — Máscara `{$a->courseperiod}`:**
  - **Antes:** Usava período inteiro do curso (`course.startdate` → `course.enddate`)
    - ❌ Não refletia a realidade individual de cada aluno
    - ❌ Impossível em turmas contínuas (sem `enddate`)
    - ❌ Todos os alunos viam o mesmo período
  
  - **Depois:** Usa período real do aluno com fallbacks inteligentes
    - ✅ startdate: `user_enrolments.timestart` → fallback: `course.startdate`
    - ✅ enddate: `course_completions.timecompleted` → fallback: `issuecert.timecreated`
    - ✅ Cada aluno vê seu próprio período
    - ✅ Funciona em turmas contínuas
  
  - **Impacto:** Certificados agora mostram datas mais precisas
  - **Migration:** Nenhuma ação necessária; a change é automática no próximo certificado emitido
  - **Linhas afetadas:** linhas 1591-1639 (adicionadas), linhas 1595-1596 (removidas)

---

## [Histórico anterior]

As alterações mais antigas podem ser consultadas no repositório Git ou em issues do Linear.

---

## Como ler este CHANGELOG

- **Added:** Novas funcionalidades ou recursos
- **Changed:** Mudanças em funcionalidades existentes
- **Deprecated:** Funcionalidades que serão removidas em breve
- **Removed:** Funcionalidades removidas
- **Fixed:** Bug fixes
- **Security:** Correções de segurança

---

## Versionamento

Este plugin usa Semantic Versioning:
- **MAJOR:** Mudanças incompatíveis (break de API ou dados)
- **MINOR:** Novas funcionalidades retrocompatíveis
- **PATCH:** Bug fixes

Exemplo: `1.2.3` = Major.Minor.Patch

---

## Checklist para próximas releases

Ao planejar uma nova versão, considere:

- [ ] Atualizar versão em `version.php`
- [ ] Listar todas as mudanças neste CHANGELOG
- [ ] Testar em staging antes de deploy
- [ ] Fazer backup de dados se houver mudanças críticas
- [ ] Comunicar mudanças ao time via Linear
- [ ] Criar documentação se houver novas funcionalidades (adicionar a `docs/`)

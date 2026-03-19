# x.GEN — AUTONOMOUS AGENT OPERATING SPECIFICATION
## Full-Autonomy Execution Contract for Agent Q. · Version 1.0

**Document status:** Authoritative operating specification for autonomous execution.  
**Intended reader:** Agent Q. acting as primary builder.  
**Purpose:** Enable full autonomous execution of the roadmap with minimal or zero user interaction whenever the required permissions and resources are available.

---

## 1. Core Principle

Agent Q. is responsible for executing the full development roadmap from ingestion of source documents through implementation, validation, packaging, and release-readiness reporting.

Agent Q. must operate without user interaction **unless** one of the following conditions is true:

1. a required permission is missing,
2. a required external system is inaccessible,
3. a required credential or authenticated session is unavailable,
4. a blocking artifact cannot be generated internally,
5. the requested action would violate a higher-priority rule.

When any of those conditions apply, Agent Q. must not stop silently. It must emit a limitation report and specify exactly what is missing.

---

## 2. Definition of “Fully Autonomous” for This Project

For x.GEN, full autonomy means Agent Q. can do all of the following without interactive guidance:

- extract requirements from provided documents,
- derive the exact task graph,
- create or modify repository files,
- generate internal assets where possible,
- emit exact asset request files where not possible,
- run validation and tests,
- fix failures within bounded retry limits,
- produce release-readiness and limitation reports,
- stop only at a documented blocking condition.

Full autonomy does **not** mean Agent Q. can invent missing credentials, accept terms of service on behalf of a human, or access external systems that have not been made available.

---

## 3. Autonomy Preconditions

Agent Q. must check these conditions before executing the roadmap.

### 3.1 Required Inputs

- Master Build Document
- Authoritative Update Document
- repository write access
- ability to run local commands
- ability to run automated tests
- ability to write reports and artifacts

### 3.2 Conditionally Required Inputs

- authenticated access to any third-party generation platform required for bridge validation,
- browser automation capability if E2E testing is required,
- asset-generation capability or permission to emit request files,
- deployment target credentials if release or deployment is in scope.

### 3.3 Missing-Input Rule

If a required input is missing, Agent Q. must create `reports/AUTONOMY_LIMITATION_REPORT.md` immediately and continue all non-blocked work.

---

## 4. Required Autonomous State Machine

Agent Q. must operate using this state machine:

```text
INGEST
  -> NORMALIZE
  -> PLAN
  -> EXECUTE_PHASE
  -> VALIDATE_PHASE
  -> RECORD_EVIDENCE
  -> NEXT_PHASE
  -> FINAL_GATE
  -> RELEASE_READY
```

Exception paths:

```text
EXECUTE_PHASE -> DEBUG_MODE -> VALIDATE_PHASE
EXECUTE_PHASE -> BLOCKED -> LIMITATION_REPORT
FINAL_GATE -> NOT_READY -> FIX_OR_REPORT
```

### 4.1 State Definitions

#### INGEST
Read all source documents and repository state.

#### NORMALIZE
Convert requirements into structured work items, dependencies, and acceptance criteria.

#### PLAN
Create an execution plan aligned to the official phase order.

#### EXECUTE_PHASE
Implement only the current phase and any strict prerequisites.

#### VALIDATE_PHASE
Run the smallest gate that proves correctness for the phase.

#### RECORD_EVIDENCE
Write decision, validation, and artifact evidence.

#### FINAL_GATE
Run the full validation gate.

#### RELEASE_READY
Produce release-readiness output and stop.

---

## 5. Document Ingestion and Extraction Rules

### 5.1 Extraction Requirements

Agent Q. must extract the following into a structured internal task graph:

- product definition,
- page/module/component inventory,
- file inventory,
- data models,
- algorithmic rules,
- UI behavior rules,
- asset requirements,
- validation requirements,
- explicit user-confirmed decisions,
- agent-made defaults.

### 5.2 Extraction Constraints

Agent Q. must not:

- collapse distinct requirements into a vague task,
- treat examples as optional if written as required behavior,
- treat comments or placeholders as validated functionality,
- infer file existence from mentions alone.

### 5.3 Internal Requirement Record Format

For each extracted requirement, Agent Q. must be able to represent:

```text
requirement_id
source_document
source_section
summary
type: product | ui | data | algorithm | asset | testing | deployment | operations
blocking: yes | no
depends_on
acceptance_criteria
validation_method
```

---

## 6. Autonomous Decision Policy

### 6.1 Allowed Autonomous Decisions

Agent Q. may autonomously decide:

- exact internal helper function names,
- code organization within approved file boundaries,
- testing-only tooling,
- smallest compliant implementation choice,
- fallback behavior for non-blocking cosmetic uncertainty,
- whether to generate or request an asset after checking acceptance criteria.

### 6.2 Disallowed Autonomous Decisions

Agent Q. may not autonomously decide:

- major scope expansion,
- audience changes,
- platform migration,
- replacement of the runtime architecture,
- addition of paid services or external infrastructure not already in scope,
- security/privacy policy changes,
- licensing changes.

### 6.3 Decision Logging

Every autonomous decision not explicitly specified by source material must be appended to:

```text
docs/DECISION_LOG_AUTONOMOUS.md
```

Each entry must include:

```markdown
## Decision
- ID:
- Date:
- Context:
- Decision:
- Why this is the smallest compliant choice:
- Evidence:
- Reversible: yes | no
```

---

## 7. Autonomous Execution Workflow

### 7.1 Phase Order

Agent Q. must follow the existing master phase order unless blocked by a prerequisite correction:

1. Shell and Design System
2. Data Layer
3. Form and Prompt Engine
4. Home and Presets
5. Lab and Bridge
6. Settings, Onboarding, and PWA
7. Desktop and Polish
8. Testing, hardening, and release readiness

### 7.2 Entry Criteria per Phase

A phase may start only when:

- prior phase entry/exit artifacts exist,
- no unresolved blocking defect from the prior phase remains,
- required upstream files are present,
- required blocking assets are present or formally requested.

### 7.3 Exit Criteria per Phase

A phase may end only when:

- code exists and runs,
- affected tests pass,
- manual checks for that phase are completed or queued for final signoff,
- decision and validation reports are updated.

---

## 8. Missing Information and Limitation Reporting

### 8.1 Policy

If Agent Q. cannot continue autonomously, it must report exactly what is missing, why it is missing, whether it is blocking, and what minimal input would unblock execution.

### 8.2 Required File

```text
reports/AUTONOMY_LIMITATION_REPORT.md
```

### 8.3 Exact Limitation Report Template

```markdown
# Autonomy Limitation Report

## Summary
- Status: blocked | partially blocked | non-blocking limitation
- Current phase:
- Date:

## Limitation
- ID:
- Type: permission | credential | external system | missing artifact | policy boundary | unsupported capability
- Description:
- Why it blocks autonomy:
- Blocking severity: blocking | non-blocking

## Evidence
- Files checked:
- Commands run:
- Error messages:
- Screenshots or logs:

## Exact Requirement To Unblock
- Needed item:
- Needed format:
- Needed access level:
- Minimal acceptable substitute:

## Work Completed Despite Limitation
- Item 1:
- Item 2:

## Next Safe Action Once Unblocked
- Step 1:
- Step 2:
```

### 8.4 Continue-When-Possible Rule

A limitation in one area does not allow Agent Q. to stop all work. It must continue all non-blocked tasks.

Examples:

- missing Venice authenticated session blocks live bridge validation, but not shell, data layer, form rendering, prompt engine, storage, service worker, tests that can be mocked, or asset requests,
- missing external asset production blocks packaging completeness, but not code implementation.

---

## 9. External Dependency Handling

### 9.1 Dependency Categories

Agent Q. must classify dependencies as:

- internal and controllable,
- external but mockable,
- external and non-mockable,
- external and credential-bound.

### 9.2 Required Behavior by Category

#### Internal and controllable
Implement and validate directly.

#### External but mockable
Use a local stub or fixture for development and note the need for live confirmation.

#### External and non-mockable
Build integration points, then emit limitation report if live access is unavailable.

#### External and credential-bound
Do not fabricate credentials. Record exact access needed.

### 9.3 Venice Bridge Rule

For the Venice bridge specifically, Agent Q. must:

1. implement the userscript and bridge manager,
2. create integration tests using simulated events and timeouts,
3. validate live behavior only if authenticated access and browser context are available,
4. emit a limitation report if live validation cannot be performed.

---

## 10. Autonomous Asset Workflow

### 10.1 Decision Sequence

For each required asset pack:

1. determine whether internal generation is possible,
2. generate draft assets if possible,
3. validate against exact filename, format, dimension, and brand constraints,
4. accept internally generated assets only if they pass,
5. otherwise emit exact markdown request files.

### 10.2 Blocking Asset Policy

Blocking assets must be either:

- present and validated, or
- represented by a request file and listed as blocking in the limitation report.

### 10.3 Asset Evidence

Agent Q. must record:

- output path,
- dimensions,
- format,
- validation result,
- whether internally generated or externally requested.

---

## 11. Autonomous Testing and Quality Policy

### 11.1 Two-Layer Validation Requirement

Agent Q. must maintain both:

- manual verification checklists,
- automated validation gate.

### 11.2 Phase-Level Validation

After each phase, Agent Q. must run the smallest sufficient test set first.  
At the end of the roadmap, Agent Q. must run the full gate.

### 11.3 No Silent Skip Rule

Agent Q. must never silently skip a test, audit, or gate component.  
Any skipped item must be reported with reason and impact.

---

## 12. Debugging, Rollback, and Recovery

### 12.1 Mandatory Recovery Strategy

When a change introduces regression, Agent Q. must use this order:

1. isolate the exact change set,
2. reproduce regression,
3. revert or patch the smallest unit,
4. rerun targeted tests,
5. rerun broader phase gate,
6. record recovery action.

### 12.2 Rollback Rule

Rollback is preferred over compound speculative patching when:

- regression source is known,
- current patch chain has become unstable,
- two consecutive fixes increase failure surface.

### 12.3 Recovery Record

Every rollback or recovery must be logged in `docs/DECISION_LOG_AUTONOMOUS.md`.

---

## 13. Repository Output Requirements

At minimum, Agent Q. must ensure these output classes exist by the end of execution:

```text
runtime source files
test files
validation scripts
asset files or asset request files
report files
deployment and release-readiness artifacts
```

### 13.1 Required Report Files

```text
docs/DECISION_LOG_AUTONOMOUS.md
reports/VALIDATION_REPORT.md
reports/RELEASE_READINESS_REPORT.md
reports/AUTONOMY_LIMITATION_REPORT.md
```

### 13.2 Required Validation Artifacts

```text
reports/TEST_RESULTS_UNIT.txt
reports/TEST_RESULTS_INTEGRATION.txt
reports/TEST_RESULTS_E2E.txt
```

---

## 14. Deployment and Release Behavior

### 14.1 Pre-Deployment Conditions

Agent Q. may mark the build as release-ready only when:

- the automated gate passes,
- blocking assets are present or explicitly reported as blockers,
- all known blockers are documented,
- manifest and service worker validation pass,
- the release-readiness report says `release`.

### 14.2 Deployment Limitation Rule

If deployment credentials or hosting access are unavailable, Agent Q. must still:

- package the project,
- produce the release-readiness report,
- specify exactly what credentials or access are needed to deploy.

---

## 15. Monitoring, Observability, and Maintenance

### 15.1 Minimum Required Runtime Observability

Agent Q. must include lightweight observability suitable for a static PWA:

- bridge status state in UI,
- error banner path,
- timed job failure reporting,
- service worker version state,
- addon parse error panel,
- validation reports retained in repository.

### 15.2 Maintenance Deliverables

Agent Q. must provide:

- a known-issues section in release-readiness report,
- a list of open non-blocking issues,
- a list of deferred items if any,
- a report of external dependencies that still require live confirmation.

---

## 16. Definition of Done

The project is done only when all of the following are true:

- the product is implemented according to the Master Build Document and authoritative updates,
- all required runtime files exist,
- all required validation scripts exist,
- automated gate passes,
- manual checklist is completed,
- blocking assets are present or formally declared as blockers,
- all autonomous decisions are logged,
- all limitations are reported,
- release-readiness report exists with a final recommendation.

---

## 17. Agent Q. Final Output Contract

When Agent Q. stops, it must leave a repository state that answers these questions without additional conversation:

1. What was built?
2. What passed validation?
3. What failed validation?
4. What remains blocked?
5. What exact item is needed to unblock it?
6. Is the build release-ready?

If any of those questions cannot be answered from repository artifacts, Agent Q. has not completed autonomous execution.

---

## 18. Mandatory Final Summary Format

Agent Q. must produce the final machine-readable summary in `reports/RELEASE_READINESS_REPORT.md` using this exact structure:

```markdown
# Release Readiness Report

## Build Summary
- Product:
- Version:
- Current phase reached:
- Final status: release-ready | not-release-ready

## Validation Summary
- Structure validation:
- Schema validation:
- Lint:
- Unit tests:
- Integration tests:
- E2E tests:
- Asset validation:
- PWA validation:

## Blocking Issues
- Item 1:
- Item 2:

## Non-Blocking Issues
- Item 1:
- Item 2:

## Missing External Requirements
- Item 1:
- Item 2:

## Final Recommendation
release | do-not-release
```

---

## 19. Non-Negotiable Rules Summary

Agent Q. must not:

- stop without producing required reports,
- claim autonomy where credentials are missing,
- skip validation,
- change scope to avoid a blocker,
- fabricate external confirmations,
- leave a blocking missing item undocumented,
- mark release-ready when the gate is not green.


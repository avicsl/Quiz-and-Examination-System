/**
 * LOGICAL PROGRAMMING PARADIGM: INFERENCE ENGINE
 * 
 * In the Logic Programming Paradigm (e.g. Prolog, Datalog, Expert Systems),
 * programming is declarative:
 * 
 *   Algorithm = Logic + Control (Robert Kowalski, 1979)
 * 
 * Rather than writing an imperative step-by-step procedure (e.g. loops, counters,
 * mutation of score variables), the developer declares:
 *   1. Domain Facts (What is known to be true)
 *   2. Horn Clauses / Inference Rules (Relationships and conditions under which conclusions hold)
 *   3. Goals / Queries (What we want to deduce or prove)
 * 
 * The Inference Engine solves goals through Unification (substitutions)
 * and Backward-Chaining Resolution.
 */

class LogicVariable {
  constructor(name) {
    this.name = name.startsWith("?") ? name : `?${name}`;
  }

  toString() {
    return this.name;
  }
}

function isVar(x) {
  return x instanceof LogicVariable || (typeof x === "string" && x.startsWith("?"));
}

function varName(x) {
  return x instanceof LogicVariable ? x.name : x;
}

class Predicate {
  constructor(name, args = []) {
    this.name = name;
    this.args = args;
  }

  toString() {
    return `${this.name}(${this.args.map((a) => (a !== null && a !== undefined ? a.toString() : "null")).join(", ")})`;
  }
}

class Rule {
  /**
   * Horn Clause: Head :- Body1, Body2, ...
   * @param {Predicate} head 
   * @param {Array<Predicate>} body 
   */
  constructor(head, body = []) {
    this.head = head;
    this.body = body;
  }

  toString() {
    return `${this.head.toString()} :- ${this.body.map((b) => b.toString()).join(", ")}.`;
  }
}

/**
 * Robinson's Unification Algorithm
 * Finds the Most General Unifier (MGU) of two terms/predicates given existing substitutions.
 */
function unify(term1, term2, bindings = {}) {
  if (bindings === null) return null;

  term1 = resolveTerm(term1, bindings);
  term2 = resolveTerm(term2, bindings);

  if (term1 === term2) return bindings;

  if (isVar(term1)) {
    return bindVariable(varName(term1), term2, bindings);
  }

  if (isVar(term2)) {
    return bindVariable(varName(term2), term1, bindings);
  }

  if (term1 instanceof Predicate && term2 instanceof Predicate) {
    if (term1.name !== term2.name || term1.args.length !== term2.args.length) {
      return null;
    }

    let currentBindings = { ...bindings };
    for (let i = 0; i < term1.args.length; i++) {
      currentBindings = unify(term1.args[i], term2.args[i], currentBindings);
      if (currentBindings === null) return null;
    }
    return currentBindings;
  }

  return null;
}

function resolveTerm(term, bindings) {
  let current = term;
  while (isVar(current) && bindings && bindings[varName(current)] !== undefined) {
    const next = bindings[varName(current)];
    if (next === current) break;
    current = next;
  }
  return current;
}

function bindVariable(variableName, value, bindings) {
  const newBindings = { ...bindings };
  newBindings[variableName] = value;
  return newBindings;
}

class KnowledgeBase {
  constructor() {
    this.facts = [];
    this.rules = [];
  }

  /**
   * Assert a ground fact into the knowledge base
   */
  assertFact(name, args) {
    this.facts.push(new Predicate(name, args));
  }

  /**
   * Assert a Horn clause rule into the knowledge base
   */
  assertRule(head, body) {
    this.rules.push(new Rule(head, body));
  }

  /**
   * Backward-Chaining Resolution Engine
   * Evaluates a goal against facts and rules.
   * Returns an array of resolved variable mappings for the goal's variables.
   */
  query(goal) {
    const rawSolutions = this._resolveGoal(goal, {});
    
    // Project and ground all variables from the top-level goal
    const projectedSolutions = [];
    for (const sol of rawSolutions) {
      const projection = {};
      for (const arg of goal.args) {
        if (isVar(arg)) {
          const v = varName(arg);
          projection[v] = resolveTerm(arg, sol);
        }
      }
      projectedSolutions.push(projection);
    }

    return projectedSolutions;
  }

  _resolveGoal(goal, currentBindings) {
    // Built-in logical inequality predicate: diff(X, Y) or not_equal(X, Y)
    if (goal.name === "diff" || goal.name === "not_equal" || goal.name === "\\=") {
      const left = resolveTerm(goal.args[0], currentBindings);
      const right = resolveTerm(goal.args[1], currentBindings);
      if (!isVar(left) && !isVar(right) && left !== right) {
        return [currentBindings];
      }
      return [];
    }

    // Built-in logical equality predicate: equal(X, Y)
    if (goal.name === "equal" || goal.name === "==") {
      const unified = unify(goal.args[0], goal.args[1], currentBindings);
      return unified !== null ? [unified] : [];
    }

    const solutions = [];

    // 1. Direct Axioms (Ground Facts)
    for (const fact of this.facts) {
      if (fact.name === goal.name && fact.args.length === goal.args.length) {
        const unified = unify(goal, fact, currentBindings);
        if (unified !== null) {
          solutions.push(unified);
        }
      }
    }

    // 2. Horn Clause Resolution (Rules)
    for (const rule of this.rules) {
      if (rule.head.name === goal.name && rule.head.args.length === goal.args.length) {
        const renamedRule = this._standardizeApart(rule);
        const headBindings = unify(goal, renamedRule.head, currentBindings);
        if (headBindings !== null) {
          const bodySolutions = this._resolveBody(renamedRule.body, headBindings);
          solutions.push(...bodySolutions);
        }
      }
    }

    return solutions;
  }

  _resolveBody(bodyGoals, bindings) {
    if (bodyGoals.length === 0) return [bindings];

    const [firstGoal, ...restGoals] = bodyGoals;

    // Instantiate first goal using current bindings
    const instantiatedGoal = new Predicate(
      firstGoal.name,
      firstGoal.args.map((arg) => resolveTerm(arg, bindings))
    );

    const subSolutions = this._resolveGoal(instantiatedGoal, bindings);
    const finalSolutions = [];

    for (const subBinding of subSolutions) {
      const nextSolutions = this._resolveBody(restGoals, subBinding);
      finalSolutions.push(...nextSolutions);
    }

    return finalSolutions;
  }

  _standardizeApart(rule) {
    const suffix = "_" + Math.random().toString(36).substring(2, 8);
    const renameTerm = (term) => {
      if (isVar(term)) return new LogicVariable(varName(term) + suffix);
      if (term instanceof Predicate) {
        return new Predicate(term.name, term.args.map(renameTerm));
      }
      return term;
    };

    const newHead = new Predicate(rule.head.name, rule.head.args.map(renameTerm));
    const newBody = rule.body.map((b) => new Predicate(b.name, b.args.map(renameTerm)));

    return new Rule(newHead, newBody);
  }
}

module.exports = {
  LogicVariable,
  Predicate,
  Rule,
  KnowledgeBase,
  unify,
  resolveTerm,
  isVar,
  varName
};

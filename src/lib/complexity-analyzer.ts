export interface ComplexityAnalysis {
  complexity: string;
  confidence: "high" | "medium" | "low";
  explanation: string;
  patterns: string[];
}

export function analyzeComplexity(code: string, dict: any): ComplexityAnalysis {
  const patterns: string[] = [];
  let complexity = "O(1)";
  let confidence: "high" | "medium" | "low" = "medium";
  let explanation = dict.complexity.constant_time;

  // Normalize code once
  const normalized = code.toLowerCase();

  // Precompute keyword flags to avoid repeated includes()
  const hasFor = normalized.includes("for");
  const hasWhile = normalized.includes("while");
  const hasForeach = normalized.includes("foreach");
  const hasMap = normalized.includes(".map(");
  const hasFilter = normalized.includes(".filter(");
  const hasReduce = normalized.includes(".reduce(");
  const hasSort = normalized.includes(".sort(");
  const hasRecursion = normalized.match(/function\s+(\w+)[^{]*{[^}]*\1\s*\(/);
  const hasDivideConquer = normalized.includes("binarysearch") || normalized.includes("/2");
  const hasHash =
    normalized.includes("hash") || normalized.includes("map") || normalized.includes("set");
  const hasTree = normalized.includes("binary") && normalized.includes("tree");
  const nestedLoopPattern = /(for|while)[^:\n{]*[:{][\s\S]*?(for|while)[^:\n{]*[:{]/;

  if (nestedLoopPattern.test(normalized)) {
    const nestingDepth = countMaxNestingDepth(normalized);
    if (nestingDepth >= 3) {
      complexity = "O(n³)";
      explanation = dict.complexity.triple_nested_loops_cubic;
      patterns.push(dict.complexity.patterns.triple_nested);
    } else {
      complexity = "O(n²)";
      explanation = dict.complexity.nested_loops_quadratic;
      patterns.push(dict.complexity.patterns.nested);
    }
    confidence = "high";
  } else if (
    hasSort ||
    normalized.includes("quicksort") ||
    normalized.includes("mergesort") ||
    normalized.includes("heapsort")
  ) {
    complexity = "O(n log n)";
    explanation = dict.complexity.sorting_operation;
    patterns.push(dict.complexity.patterns.sorting);
    confidence = "high";
  } else if (hasDivideConquer || (hasRecursion && normalized.includes("return"))) {
    complexity = "O(log n)";
    explanation = dict.complexity.divide_and_conquer;
    patterns.push(dict.complexity.patterns.divide_conquer);
    confidence = "medium";
  } else if (hasFor || hasWhile || hasForeach || hasMap || hasFilter || hasReduce) {
    complexity = "O(n)";
    explanation = dict.complexity.single_loop;
    patterns.push(dict.complexity.patterns.single_loop);
    confidence = "high";
  } else if (hasRecursion || normalized.includes("recursive")) {
    complexity = "O(n)";
    explanation = dict.complexity.recursion_detected;
    patterns.push(dict.complexity.patterns.recursion);
    confidence = "low";
  }

  if (hasHash) patterns.push(dict.complexity.patterns.hash_structure);
  if (hasTree) patterns.push(dict.complexity.patterns.binary_tree);

  if (patterns.length === 0) patterns.push(dict.complexity.patterns.none);

  return { complexity, confidence, explanation, patterns };
}

function countMaxNestingDepth(code: string): number {
  const lines = code.split("\n");
  const indentStack: number[] = [];
  let maxDepth = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("for") && !trimmed.startsWith("while")) continue;

    const indent = line.search(/\S/);
    while (indentStack.length && indent <= indentStack[indentStack.length - 1]) {
      indentStack.pop();
    }

    indentStack.push(indent);
    maxDepth = Math.max(maxDepth, indentStack.length);
  }

  return maxDepth;
}

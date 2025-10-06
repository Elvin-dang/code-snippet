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

  // Normalize code for analysis
  const normalizedCode = code.toLowerCase();

  // Check for nested loops (O(n²) or higher)
  const nestedLoopPattern = /for\s*$$[^)]*$$[^{]*{[^}]*for\s*$$[^)]*$$/g;
  const whileNestedPattern = /while\s*$$[^)]*$$[^{]*{[^}]*while\s*$$[^)]*$$/g;
  const forWhileNested = /for\s*$$[^)]*$$[^{]*{[^}]*while\s*$$[^)]*$$/g;
  const whileForNested = /while\s*$$[^)]*$$[^{]*{[^}]*for\s*$$[^)]*$$/g;

  if (
    nestedLoopPattern.test(normalizedCode) ||
    whileNestedPattern.test(normalizedCode) ||
    forWhileNested.test(normalizedCode) ||
    whileForNested.test(normalizedCode)
  ) {
    // Count nesting depth
    const nestingDepth = countMaxNestingDepth(normalizedCode);
    if (nestingDepth >= 3) {
      complexity = "O(n³)";
      explanation = dict.complexity.triple_nested_loops_cubic;
      patterns.push(dict.complexity.patterns.triple_nested);
    } else {
      complexity = "O(n²)";
      explanation = dict.complexity.nested_loops_quadratic;
      patterns.push(dict.complexity.patterns.nested);
    }
    confidence = dict.complexity.confidence["high"];
  }
  // Check for sorting algorithms
  else if (
    normalizedCode.includes(".sort(") ||
    normalizedCode.includes("quicksort") ||
    normalizedCode.includes("mergesort") ||
    normalizedCode.includes("heapsort")
  ) {
    complexity = "O(n log n)";
    explanation = dict.complexity.sorting_operation;
    patterns.push(dict.complexity.patterns.sorting);
    confidence = dict.complexity.confidence["high"];
  }
  // Check for recursion with divide and conquer
  else if (
    (normalizedCode.includes("return") &&
      normalizedCode.match(/function\s+(\w+)[^{]*{[^}]*return[^}]*\1\s*\(/)) ||
    normalizedCode.includes("binarysearch") ||
    (normalizedCode.includes("recursion") && normalizedCode.includes("/2"))
  ) {
    complexity = "O(log n)";
    explanation = dict.complexity.divide_and_conquer;
    patterns.push(dict.complexity.patterns.divide_conquer);
    confidence = dict.complexity.confidence["medium"];
  }
  // Check for single loop
  else if (
    normalizedCode.includes("for") ||
    normalizedCode.includes("while") ||
    normalizedCode.includes("foreach") ||
    normalizedCode.includes(".map(") ||
    normalizedCode.includes(".filter(") ||
    normalizedCode.includes(".reduce(") ||
    normalizedCode.includes("for (") ||
    normalizedCode.includes("for(")
  ) {
    complexity = "O(n)";
    explanation = dict.complexity.single_loop;
    patterns.push(dict.complexity.patterns.single_loop);
    confidence = dict.complexity.confidence["high"];
  }
  // Check for recursion (general case)
  else if (
    normalizedCode.match(/function\s+(\w+)[^{]*{[^}]*\1\s*\(/) ||
    normalizedCode.includes("recursive")
  ) {
    complexity = "O(n)";
    explanation = dict.complexity.recursion_detected;
    patterns.push(dict.complexity.patterns.recursion);
    confidence = dict.complexity.confidence["low"];
  }

  // Additional pattern detection
  if (
    normalizedCode.includes("hash") ||
    normalizedCode.includes("map") ||
    normalizedCode.includes("set")
  ) {
    patterns.push(dict.complexity.patterns.hash_structure);
  }

  if (normalizedCode.includes("binary") && normalizedCode.includes("tree")) {
    patterns.push(dict.complexity.patterns.binary_tree);
  }

  if (patterns.length === 0) {
    patterns.push(dict.complexity.patterns.none);
  }

  return {
    complexity,
    confidence,
    explanation,
    patterns,
  };
}

function countMaxNestingDepth(code: string): number {
  let maxDepth = 0;
  let currentDepth = 0;
  let inLoop = false;

  const loopKeywords = ["for", "while", "foreach"];

  const tokens = code.split(/\s+/);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (loopKeywords.some((keyword) => token.includes(keyword))) {
      inLoop = true;
    }

    if (token.includes("{") && inLoop) {
      currentDepth++;
      maxDepth = Math.max(maxDepth, currentDepth);
    }

    if (token.includes("}") && currentDepth > 0) {
      currentDepth--;
      if (currentDepth === 0) {
        inLoop = false;
      }
    }
  }

  return maxDepth;
}

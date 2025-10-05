export interface ComplexityAnalysis {
  complexity: string;
  confidence: "high" | "medium" | "low";
  explanation: string;
  patterns: string[];
}

export function analyzeComplexity(code: string): ComplexityAnalysis {
  const patterns: string[] = [];
  let complexity = "O(1)";
  let confidence: "high" | "medium" | "low" = "medium";
  let explanation = "Constant time - no loops or recursion detected";

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
      explanation = "Cubic time - three or more nested loops detected";
      patterns.push("Triple nested loops");
    } else {
      complexity = "O(n²)";
      explanation = "Quadratic time - nested loops detected";
      patterns.push("Nested loops");
    }
    confidence = "high";
  }
  // Check for sorting algorithms
  else if (
    normalizedCode.includes(".sort(") ||
    normalizedCode.includes("quicksort") ||
    normalizedCode.includes("mergesort") ||
    normalizedCode.includes("heapsort")
  ) {
    complexity = "O(n log n)";
    explanation = "Linearithmic time - sorting operation detected";
    patterns.push("Sorting algorithm");
    confidence = "high";
  }
  // Check for recursion with divide and conquer
  else if (
    (normalizedCode.includes("return") &&
      normalizedCode.match(/function\s+(\w+)[^{]*{[^}]*return[^}]*\1\s*\(/)) ||
    normalizedCode.includes("binarysearch") ||
    (normalizedCode.includes("recursion") && normalizedCode.includes("/2"))
  ) {
    complexity = "O(log n)";
    explanation = "Logarithmic time - divide and conquer or binary search pattern detected";
    patterns.push("Divide and conquer");
    confidence = "medium";
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
    explanation = "Linear time - single loop or iteration detected";
    patterns.push("Single loop/iteration");
    confidence = "high";
  }
  // Check for recursion (general case)
  else if (
    normalizedCode.match(/function\s+(\w+)[^{]*{[^}]*\1\s*\(/) ||
    normalizedCode.includes("recursive")
  ) {
    complexity = "O(n)";
    explanation = "Linear time - recursive function detected";
    patterns.push("Recursion");
    confidence = "low";
  }

  // Additional pattern detection
  if (
    normalizedCode.includes("hash") ||
    normalizedCode.includes("map") ||
    normalizedCode.includes("set")
  ) {
    patterns.push("Hash-based data structure");
  }

  if (normalizedCode.includes("binary") && normalizedCode.includes("tree")) {
    patterns.push("Binary tree operations");
  }

  if (patterns.length === 0) {
    patterns.push("No significant patterns detected");
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

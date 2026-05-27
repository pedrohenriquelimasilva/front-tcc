export interface Challenge {
  id: string;
  title: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
  category: string;
  tags: string[];
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: string;
  testCases: { input: string; expected: string }[];
  timeLimit: number; // minutes
  completionRate: number;
}

export interface UserStats {
  totalSolved: number;
  totalAttempted: number;
  streak: number;
  ranking: number;
  easy: number;
  medium: number;
  hard: number;
  recentScores: number[];
  skillRadar: { label: string; value: number }[];
}

export interface Submission {
  id: string;
  challengeId: string;
  challengeTitle: string;
  date: string;
  score: number;
  status: "Aprovado" | "Parcial" | "Reprovado";
  metrics: {
    correctness: number;
    efficiency: number;
    codeQuality: number;
    edgeCases: number;
  };
}

export const challenges: Challenge[] = [
  {
    id: "two-sum",
    title: "Soma de Dois Números",
    difficulty: "Fácil",
    category: "Arrays",
    tags: ["arrays", "hash-map", "busca"],
    description:
      "Dado um array de inteiros `nums` e um inteiro `target`, retorne os índices dos dois números que somados resultam no `target`.\n\nVocê pode assumir que cada entrada terá exatamente uma solução e não pode usar o mesmo elemento duas vezes.\n\nVocê pode retornar a resposta em qualquer ordem.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Porque nums[0] + nums[1] == 9, retornamos [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10⁴",
      "-10⁹ <= nums[i] <= 10⁹",
      "-10⁹ <= target <= 10⁹",
      "Apenas uma resposta válida existe.",
    ],
    starterCode: `function twoSum(nums: number[], target: number): number[] {
  // Escreva sua solução aqui

}`,
    testCases: [
      { input: "[2,7,11,15], 9", expected: "[0,1]" },
      { input: "[3,2,4], 6", expected: "[1,2]" },
      { input: "[3,3], 6", expected: "[0,1]" },
    ],
    timeLimit: 30,
    completionRate: 78,
  },
  {
    id: "reverse-string",
    title: "Inverter String",
    difficulty: "Fácil",
    category: "Strings",
    tags: ["strings", "two-pointers"],
    description:
      "Escreva uma função que inverta uma string. A string de entrada é fornecida como um array de caracteres `s`.\n\nVocê deve fazer isso modificando o array de entrada in-place com O(1) de memória extra.",
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]',
      },
    ],
    constraints: [
      "1 <= s.length <= 10⁵",
      "s[i] é um caractere ASCII imprimível.",
    ],
    starterCode: `function reverseString(s: string[]): void {
  // Escreva sua solução aqui

}`,
    testCases: [
      {
        input: '["h","e","l","l","o"]',
        expected: '["o","l","l","e","h"]',
      },
      {
        input: '["H","a","n","n","a","h"]',
        expected: '["h","a","n","n","a","H"]',
      },
    ],
    timeLimit: 20,
    completionRate: 85,
  },
  {
    id: "valid-parentheses",
    title: "Parênteses Válidos",
    difficulty: "Fácil",
    category: "Pilhas",
    tags: ["pilha", "strings", "validação"],
    description:
      "Dada uma string `s` contendo apenas os caracteres '(', ')', '{', '}', '[' e ']', determine se a string de entrada é válida.\n\nUma string é válida se:\n1. Parênteses abertos são fechados pelo mesmo tipo.\n2. Parênteses abertos são fechados na ordem correta.\n3. Todo parêntese fechado tem um correspondente aberto do mesmo tipo.",
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
    ],
    constraints: [
      "1 <= s.length <= 10⁴",
      "s consiste apenas em parênteses '()[]{}'.",
    ],
    starterCode: `function isValid(s: string): boolean {
  // Escreva sua solução aqui

}`,
    testCases: [
      { input: '"()"', expected: "true" },
      { input: '"()[]{}"', expected: "true" },
      { input: '"(]"', expected: "false" },
    ],
    timeLimit: 25,
    completionRate: 72,
  },
  {
    id: "max-subarray",
    title: "Subarray de Soma Máxima",
    difficulty: "Médio",
    category: "Arrays",
    tags: ["arrays", "programação dinâmica", "divide-and-conquer"],
    description:
      "Dado um array de inteiros `nums`, encontre o subarray contíguo (contendo pelo menos um número) que possui a maior soma e retorne sua soma.\n\nUm subarray é uma parte contígua do array.",
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation:
          "O subarray [4,-1,2,1] tem a maior soma = 6.",
      },
      { input: "nums = [1]", output: "1" },
      { input: "nums = [5,4,-1,7,8]", output: "23" },
    ],
    constraints: [
      "1 <= nums.length <= 10⁵",
      "-10⁴ <= nums[i] <= 10⁴",
    ],
    starterCode: `function maxSubArray(nums: number[]): number {
  // Escreva sua solução aqui

}`,
    testCases: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", expected: "6" },
      { input: "[1]", expected: "1" },
      { input: "[5,4,-1,7,8]", expected: "23" },
    ],
    timeLimit: 35,
    completionRate: 55,
  },
  {
    id: "linked-list-cycle",
    title: "Detectar Ciclo em Lista Ligada",
    difficulty: "Médio",
    category: "Listas Ligadas",
    tags: ["lista-ligada", "two-pointers", "floyd"],
    description:
      "Dada a `head` de uma lista ligada, determine se a lista contém um ciclo.\n\nHá um ciclo se algum nó na lista pode ser alcançado novamente seguindo o ponteiro `next` continuamente.\n\nRetorne `true` se houver ciclo, caso contrário retorne `false`.",
    examples: [
      {
        input: "head = [3,2,0,-4], pos = 1",
        output: "true",
        explanation:
          "Há um ciclo na lista, onde a cauda conecta ao segundo nó (índice 1).",
      },
      {
        input: "head = [1,2], pos = 0",
        output: "true",
      },
    ],
    constraints: [
      "O número de nós está no intervalo [0, 10⁴]",
      "-10⁵ <= Node.val <= 10⁵",
      "pos é -1 ou um índice válido na lista.",
    ],
    starterCode: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function hasCycle(head: ListNode | null): boolean {
  // Escreva sua solução aqui

}`,
    testCases: [
      { input: "[3,2,0,-4], pos=1", expected: "true" },
      { input: "[1,2], pos=0", expected: "true" },
      { input: "[1], pos=-1", expected: "false" },
    ],
    timeLimit: 30,
    completionRate: 60,
  },
  {
    id: "binary-search",
    title: "Busca Binária",
    difficulty: "Fácil",
    category: "Busca",
    tags: ["busca", "arrays", "divide-and-conquer"],
    description:
      "Dado um array de inteiros `nums` ordenado em ordem crescente e um inteiro `target`, escreva uma função que busque `target` em `nums`. Se `target` existir, retorne seu índice. Caso contrário, retorne `-1`.\n\nVocê deve escrever um algoritmo com complexidade O(log n).",
    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        explanation: "9 existe em nums e seu índice é 4.",
      },
      {
        input: "nums = [-1,0,3,5,9,12], target = 2",
        output: "-1",
        explanation: "2 não existe em nums, então retornamos -1.",
      },
    ],
    constraints: [
      "1 <= nums.length <= 10⁴",
      "-10⁴ < nums[i], target < 10⁴",
      "Todos os inteiros em nums são únicos.",
      "nums está ordenado em ordem crescente.",
    ],
    starterCode: `function search(nums: number[], target: number): number {
  // Escreva sua solução aqui

}`,
    testCases: [
      { input: "[-1,0,3,5,9,12], 9", expected: "4" },
      { input: "[-1,0,3,5,9,12], 2", expected: "-1" },
    ],
    timeLimit: 20,
    completionRate: 80,
  },
  {
    id: "merge-sorted-arrays",
    title: "Mesclar Arrays Ordenados",
    difficulty: "Médio",
    category: "Arrays",
    tags: ["arrays", "two-pointers", "ordenação"],
    description:
      "Você recebe dois arrays de inteiros `nums1` e `nums2`, ambos ordenados em ordem crescente, e dois inteiros `m` e `n`, representando o número de elementos em `nums1` e `nums2` respectivamente.\n\nMescle `nums1` e `nums2` em um único array ordenado em ordem crescente.\n\nO resultado final deve ser armazenado dentro do array `nums1`.",
    examples: [
      {
        input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
        output: "[1,2,2,3,5,6]",
      },
    ],
    constraints: [
      "nums1.length == m + n",
      "nums2.length == n",
      "0 <= m, n <= 200",
    ],
    starterCode: `function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  // Escreva sua solução aqui

}`,
    testCases: [
      {
        input: "[1,2,3,0,0,0], 3, [2,5,6], 3",
        expected: "[1,2,2,3,5,6]",
      },
    ],
    timeLimit: 25,
    completionRate: 65,
  },
  {
    id: "lru-cache",
    title: "Cache LRU",
    difficulty: "Difícil",
    category: "Design",
    tags: ["hash-map", "lista-ligada", "design"],
    description:
      'Projete uma estrutura de dados que siga as restrições de um cache Least Recently Used (LRU).\n\nImplemente a classe `LRUCache`:\n- `LRUCache(capacity)` inicializa o cache com capacidade positiva.\n- `get(key)` retorna o valor da chave se existir, caso contrário retorna -1.\n- `put(key, value)` atualiza o valor da chave se existir. Caso contrário, adiciona o par chave-valor ao cache. Se o número de chaves exceder a capacidade, remova a chave usada menos recentemente ("least recently used").',
    examples: [
      {
        input:
          '["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]',
        output: "[null,null,null,1,null,-1,null,-1,3,4]",
      },
    ],
    constraints: [
      "1 <= capacity <= 3000",
      "0 <= key <= 10⁴",
      "0 <= value <= 10⁵",
    ],
    starterCode: `class LRUCache {
  constructor(capacity: number) {
    // Inicialize aqui
  }

  get(key: number): number {
    // Escreva sua solução aqui
    return -1;
  }

  put(key: number, value: number): void {
    // Escreva sua solução aqui
  }
}`,
    testCases: [
      {
        input: "capacity=2, put(1,1), put(2,2), get(1)",
        expected: "1",
      },
    ],
    timeLimit: 45,
    completionRate: 32,
  },
  {
    id: "tree-traversal",
    title: "Travessia em Ordem de Árvore Binária",
    difficulty: "Médio",
    category: "Árvores",
    tags: ["árvore", "recursão", "dfs"],
    description:
      "Dada a raiz `root` de uma árvore binária, retorne a travessia em ordem (inorder) dos valores de seus nós.\n\nA travessia em ordem visita: subárvore esquerda, nó raiz, subárvore direita.",
    examples: [
      {
        input: "root = [1,null,2,3]",
        output: "[1,3,2]",
      },
      {
        input: "root = []",
        output: "[]",
      },
    ],
    constraints: [
      "O número de nós está no intervalo [0, 100].",
      "-100 <= Node.val <= 100",
    ],
    starterCode: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

function inorderTraversal(root: TreeNode | null): number[] {
  // Escreva sua solução aqui

}`,
    testCases: [
      { input: "[1,null,2,3]", expected: "[1,3,2]" },
      { input: "[]", expected: "[]" },
      { input: "[1]", expected: "[1]" },
    ],
    timeLimit: 25,
    completionRate: 68,
  },
];

export const userStats: UserStats = {
  totalSolved: 24,
  totalAttempted: 31,
  streak: 7,
  ranking: 142,
  easy: 12,
  medium: 9,
  hard: 3,
  recentScores: [65, 72, 80, 75, 88, 92, 85],
  skillRadar: [
    { label: "Arrays", value: 85 },
    { label: "Strings", value: 70 },
    { label: "Árvores", value: 55 },
    { label: "Grafos", value: 40 },
    { label: "P.D.", value: 45 },
    { label: "Busca", value: 75 },
  ],
};

export interface SubmissionDetailed extends Submission {
  language: "TypeScript" | "Python" | "JavaScript";
  timeSpent: string;
  linesOfCode: number;
  complexity: { time: string; space: string };
  summary: string;
  strengths: string[];
  improvements: string[];
}

export const submissions: SubmissionDetailed[] = [
  {
    id: "sub-1",
    challengeId: "two-sum",
    challengeTitle: "Soma de Dois Números",
    date: "2026-04-12",
    score: 92,
    status: "Aprovado",
    metrics: { correctness: 100, efficiency: 90, codeQuality: 85, edgeCases: 95 },
    language: "TypeScript",
    timeSpent: "18:32",
    linesOfCode: 14,
    complexity: { time: "O(n)", space: "O(n)" },
    summary:
      "Solução linear usando HashMap para evitar busca quadrática. Todos os casos passaram. Estilo limpo com nomes claros.",
    strengths: [
      "Complexidade O(n) idiomática",
      "Uso correto de HashMap para lookup em O(1)",
      "Tratamento bom de duplicatas",
    ],
    improvements: [
      "A variável `map` poderia se chamar `numIndex`",
      "Falta comentário breve indicando a invariante do loop",
    ],
  },
  {
    id: "sub-2",
    challengeId: "max-subarray",
    challengeTitle: "Subarray de Soma Máxima",
    date: "2026-04-10",
    score: 78,
    status: "Aprovado",
    metrics: { correctness: 85, efficiency: 70, codeQuality: 80, edgeCases: 75 },
    language: "TypeScript",
    timeSpent: "27:14",
    linesOfCode: 22,
    complexity: { time: "O(n)", space: "O(1)" },
    summary:
      "Implementou Kadane corretamente, mas tratou array de um único elemento com um if redundante. Bom raciocínio no geral.",
    strengths: [
      "Aplicou Kadane sem buscar referências",
      "Complexidade de espaço O(1)",
    ],
    improvements: [
      "Simplificar o caso base (o algoritmo já cobre n=1)",
      "Considerar tipagem mais estrita no retorno",
      "Faltou testar arrays com todos valores negativos",
    ],
  },
  {
    id: "sub-3",
    challengeId: "lru-cache",
    challengeTitle: "Cache LRU",
    date: "2026-04-08",
    score: 45,
    status: "Reprovado",
    metrics: { correctness: 50, efficiency: 40, codeQuality: 45, edgeCases: 30 },
    language: "TypeScript",
    timeSpent: "44:58",
    linesOfCode: 58,
    complexity: { time: "O(n)", space: "O(n)" },
    summary:
      "Estrutura próxima da ideal, mas a operação get não está promovendo o item corretamente, quebrando a invariante LRU.",
    strengths: [
      "Escolheu combinar Map + lista duplamente ligada",
      "Separou bem as responsabilidades em métodos",
    ],
    improvements: [
      "get precisa mover o nó para o topo (essencial)",
      "put não está descartando o menos recente quando lota",
      "Implementar testes para capacidade = 1",
      "Usar Map em vez de objeto para manter ordem de inserção",
    ],
  },
  {
    id: "sub-4",
    challengeId: "valid-parentheses",
    challengeTitle: "Parênteses Válidos",
    date: "2026-04-06",
    score: 88,
    status: "Aprovado",
    metrics: { correctness: 95, efficiency: 85, codeQuality: 80, edgeCases: 90 },
    language: "TypeScript",
    timeSpent: "14:22",
    linesOfCode: 18,
    complexity: { time: "O(n)", space: "O(n)" },
    summary:
      "Solução clássica com pilha, bem escrita. Um pequeno ajuste no mapa de pares deixaria o código mais conciso.",
    strengths: [
      "Uso correto de pilha",
      "Retorno antecipado ao encontrar par inválido",
    ],
    improvements: [
      "Extrair o mapa de pares para uma constante no topo",
      "Renomear `c` para `char` em favor da legibilidade",
    ],
  },
  {
    id: "sub-5",
    challengeId: "linked-list-cycle",
    challengeTitle: "Detectar Ciclo em Lista Ligada",
    date: "2026-04-03",
    score: 65,
    status: "Parcial",
    metrics: { correctness: 70, efficiency: 60, codeQuality: 65, edgeCases: 55 },
    language: "TypeScript",
    timeSpent: "31:47",
    linesOfCode: 20,
    complexity: { time: "O(n)", space: "O(n)" },
    summary:
      "Usou Set de nós visitados — funciona, mas perde pontos em eficiência de espaço. Floyd (slow/fast) seria O(1).",
    strengths: [
      "Lógica clara e direta",
      "Cobertura de lista vazia",
    ],
    improvements: [
      "Substituir Set por algoritmo de Floyd (tortaruga e lebre)",
      "Revisar condição de parada para evitar NPE em next.next",
    ],
  },
  {
    id: "sub-6",
    challengeId: "binary-search",
    challengeTitle: "Busca Binária",
    date: "2026-04-01",
    score: 95,
    status: "Aprovado",
    metrics: { correctness: 100, efficiency: 100, codeQuality: 90, edgeCases: 90 },
    language: "TypeScript",
    timeSpent: "09:41",
    linesOfCode: 12,
    complexity: { time: "O(log n)", space: "O(1)" },
    summary:
      "Busca binária impecável. Cuidado com overflow ao calcular o meio — detalhe avançado.",
    strengths: [
      "Cálculo do meio usando (lo + (hi - lo) / 2) evita overflow",
      "Retorno claro e sem ambiguidade",
    ],
    improvements: [
      "Poderia adicionar um breve JSDoc explicando pré-condição de array ordenado",
    ],
  },
  {
    id: "sub-7",
    challengeId: "reverse-string",
    challengeTitle: "Inverter String",
    date: "2026-03-29",
    score: 82,
    status: "Aprovado",
    metrics: { correctness: 100, efficiency: 75, codeQuality: 70, edgeCases: 85 },
    language: "TypeScript",
    timeSpent: "11:05",
    linesOfCode: 10,
    complexity: { time: "O(n)", space: "O(1)" },
    summary:
      "Funciona corretamente, mas usou .reverse() — o enunciado pede in-place manual com dois ponteiros.",
    strengths: [
      "Código muito enxuto",
      "Todos os casos passaram",
    ],
    improvements: [
      "Implementar com dois ponteiros em vez de .reverse()",
      "Ler restrições com mais atenção antes de escolher a abordagem",
    ],
  },
  {
    id: "sub-8",
    challengeId: "tree-traversal",
    challengeTitle: "Travessia em Ordem de Árvore Binária",
    date: "2026-03-26",
    score: 70,
    status: "Parcial",
    metrics: { correctness: 80, efficiency: 70, codeQuality: 70, edgeCases: 60 },
    language: "TypeScript",
    timeSpent: "22:18",
    linesOfCode: 24,
    complexity: { time: "O(n)", space: "O(n)" },
    summary:
      "Recursão correta, mas a versão iterativa com pilha traria um ganho de robustez para árvores desbalanceadas.",
    strengths: [
      "Travessia recursiva clara",
      "Tratamento de árvore vazia",
    ],
    improvements: [
      "Considerar versão iterativa para evitar stack overflow em árvores muito profundas",
      "Extrair o helper recursivo para função nomeada em vez de closure anônima",
    ],
  },
];

export const feedbackData = {
  score: 85,
  status: "Aprovado" as const,
  timeSpent: "18:32",
  metrics: {
    correctness: { score: 95, label: "Correção", detail: "Todos os casos de teste passaram corretamente." },
    efficiency: { score: 80, label: "Eficiência", detail: "Complexidade O(n) alcançada. Uso de HashMap otimiza a busca." },
    codeQuality: { score: 78, label: "Qualidade do Código", detail: "Nomes de variáveis claros. Considere extrair a lógica de validação para uma função auxiliar." },
    edgeCases: { score: 88, label: "Casos Extremos", detail: "Boa cobertura. Array vazio e elementos duplicados foram tratados." },
  },
  strengths: [
    "Solução com complexidade de tempo O(n) usando HashMap",
    "Tratamento adequado de casos extremos",
    "Código limpo e bem organizado",
  ],
  improvements: [
    "Considere adicionar comentários explicando a lógica do HashMap",
    "A variável 'map' poderia ter um nome mais descritivo como 'numIndexMap'",
    "Adicione validação para entrada nula ou undefined",
  ],
  complexity: {
    time: "O(n)",
    space: "O(n)",
    explanation: "A solução itera pelo array uma vez (O(n)) e usa um HashMap auxiliar que pode armazenar até n elementos (O(n) espaço).",
  },
  codeReview: [
    { line: 3, type: "suggestion" as const, message: "Considere usar 'const' ao invés de 'let' para a variável que não é reatribuída." },
    { line: 7, type: "praise" as const, message: "Boa utilização do HashMap para busca em O(1)." },
    { line: 12, type: "warning" as const, message: "Não há validação de entrada. E se nums for null?" },
  ],
};

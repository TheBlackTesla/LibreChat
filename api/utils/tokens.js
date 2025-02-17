const { EModelEndpoint } = require('~/server/services/Endpoints');

const models = [
  'text-davinci-003',
  'text-davinci-002',
  'text-davinci-001',
  'text-curie-001',
  'text-babbage-001',
  'text-ada-001',
  'davinci',
  'curie',
  'babbage',
  'ada',
  'code-davinci-002',
  'code-davinci-001',
  'code-cushman-002',
  'code-cushman-001',
  'davinci-codex',
  'cushman-codex',
  'text-davinci-edit-001',
  'code-davinci-edit-001',
  'text-embedding-ada-002',
  'text-similarity-davinci-001',
  'text-similarity-curie-001',
  'text-similarity-babbage-001',
  'text-similarity-ada-001',
  'text-search-davinci-doc-001',
  'text-search-curie-doc-001',
  'text-search-babbage-doc-001',
  'text-search-ada-doc-001',
  'code-search-babbage-code-001',
  'code-search-ada-code-001',
  'gpt2',
  'gpt-4',
  'gpt-4-0314',
  'gpt-4-32k',
  'gpt-4-32k-0314',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-0301',
];

// Order is important here: by model series and context size (gpt-4 then gpt-3, ascending)
const maxTokensMap = {
  [EModelEndpoint.openAI]: {
    'gpt-4': 8191,
    'gpt-4-0613': 8191,
    'gpt-4-32k': 32767,
    'gpt-4-32k-0314': 32767,
    'gpt-4-32k-0613': 32767,
    'gpt-3.5-turbo': 4095,
    'gpt-3.5-turbo-0613': 4095,
    'gpt-3.5-turbo-0301': 4095,
    'gpt-3.5-turbo-16k': 15999,
    'gpt-3.5-turbo-16k-0613': 15999,
    'gpt-3.5-turbo-1106': 16380, // -5 from max
    'gpt-4-1106': 127995, // -5 from max
  },
  [EModelEndpoint.google]: {
    /* Max I/O is 32k combined, so -1000 to leave room for response */
    'text-bison-32k': 31000,
    'chat-bison-32k': 31000,
    'code-bison-32k': 31000,
    'codechat-bison-32k': 31000,
    /* Codey, -5 from max: 6144 */
    'code-': 6139,
    'codechat-': 6139,
    /* PaLM2, -5 from max: 8192 */
    'text-': 8187,
    'chat-': 8187,
  },
  [EModelEndpoint.anthropic]: {
    'claude-2.1': 200000,
    'claude-': 100000,
  },
};

/**
 * Retrieves the maximum tokens for a given model name. If the exact model name isn't found,
 * it searches for partial matches within the model name, checking keys in reverse order.
 *
 * @param {string} modelName - The name of the model to look up.
 * @param {string} endpoint - The endpoint (default is 'openAI').
 * @returns {number|undefined} The maximum tokens for the given model or undefined if no match is found.
 *
 * @example
 * getModelMaxTokens('gpt-4-32k-0613'); // Returns 32767
 * getModelMaxTokens('gpt-4-32k-unknown'); // Returns 32767
 * getModelMaxTokens('unknown-model'); // Returns undefined
 */
function getModelMaxTokens(modelName, endpoint = EModelEndpoint.openAI) {
  if (typeof modelName !== 'string') {
    return undefined;
  }

  const tokensMap = maxTokensMap[endpoint];
  if (!tokensMap) {
    return undefined;
  }

  if (tokensMap[modelName]) {
    return tokensMap[modelName];
  }

  const keys = Object.keys(tokensMap);
  for (let i = keys.length - 1; i >= 0; i--) {
    if (modelName.includes(keys[i])) {
      return tokensMap[keys[i]];
    }
  }

  return undefined;
}

/**
 * Retrieves the model name key for a given model name input. If the exact model name isn't found,
 * it searches for partial matches within the model name, checking keys in reverse order.
 *
 * @param {string} modelName - The name of the model to look up.
 * @param {string} endpoint - The endpoint (default is 'openAI').
 * @returns {string|undefined} The model name key for the given model; returns input if no match is found and is string.
 *
 * @example
 * matchModelName('gpt-4-32k-0613'); // Returns 'gpt-4-32k-0613'
 * matchModelName('gpt-4-32k-unknown'); // Returns 'gpt-4-32k'
 * matchModelName('unknown-model'); // Returns undefined
 */
function matchModelName(modelName, endpoint = EModelEndpoint.openAI) {
  if (typeof modelName !== 'string') {
    return undefined;
  }

  const tokensMap = maxTokensMap[endpoint];
  if (!tokensMap) {
    return modelName;
  }

  if (tokensMap[modelName]) {
    return modelName;
  }

  const keys = Object.keys(tokensMap);
  for (let i = keys.length - 1; i >= 0; i--) {
    if (modelName.includes(keys[i])) {
      return keys[i];
    }
  }

  return modelName;
}

module.exports = {
  tiktokenModels: new Set(models),
  maxTokensMap,
  getModelMaxTokens,
  matchModelName,
};

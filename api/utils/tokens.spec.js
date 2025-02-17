const { EModelEndpoint } = require('~/server/services/Endpoints');
const { getModelMaxTokens, matchModelName, maxTokensMap } = require('./tokens');

describe('getModelMaxTokens', () => {
  test('should return correct tokens for exact match', () => {
    expect(getModelMaxTokens('gpt-4-32k-0613')).toBe(
      maxTokensMap[EModelEndpoint.openAI]['gpt-4-32k-0613'],
    );
  });

  test('should return correct tokens for partial match', () => {
    expect(getModelMaxTokens('gpt-4-32k-unknown')).toBe(
      maxTokensMap[EModelEndpoint.openAI]['gpt-4-32k'],
    );
  });

  test('should return correct tokens for partial match (OpenRouter)', () => {
    expect(getModelMaxTokens('openai/gpt-4-32k')).toBe(
      maxTokensMap[EModelEndpoint.openAI]['gpt-4-32k'],
    );
  });

  test('should return undefined for no match', () => {
    expect(getModelMaxTokens('unknown-model')).toBeUndefined();
  });

  test('should return correct tokens for another exact match', () => {
    expect(getModelMaxTokens('gpt-3.5-turbo-16k-0613')).toBe(
      maxTokensMap[EModelEndpoint.openAI]['gpt-3.5-turbo-16k-0613'],
    );
  });

  test('should return correct tokens for another partial match', () => {
    expect(getModelMaxTokens('gpt-3.5-turbo-unknown')).toBe(
      maxTokensMap[EModelEndpoint.openAI]['gpt-3.5-turbo'],
    );
  });

  test('should return undefined for undefined input', () => {
    expect(getModelMaxTokens(undefined)).toBeUndefined();
  });

  test('should return undefined for null input', () => {
    expect(getModelMaxTokens(null)).toBeUndefined();
  });

  test('should return undefined for number input', () => {
    expect(getModelMaxTokens(123)).toBeUndefined();
  });

  // 11/06 Update
  test('should return correct tokens for gpt-3.5-turbo-1106 exact match', () => {
    expect(getModelMaxTokens('gpt-3.5-turbo-1106')).toBe(
      maxTokensMap[EModelEndpoint.openAI]['gpt-3.5-turbo-1106'],
    );
  });

  test('should return correct tokens for gpt-4-1106 exact match', () => {
    expect(getModelMaxTokens('gpt-4-1106')).toBe(maxTokensMap[EModelEndpoint.openAI]['gpt-4-1106']);
  });

  test('should return correct tokens for gpt-3.5-turbo-1106 partial match', () => {
    expect(getModelMaxTokens('something-/gpt-3.5-turbo-1106')).toBe(
      maxTokensMap[EModelEndpoint.openAI]['gpt-3.5-turbo-1106'],
    );
    expect(getModelMaxTokens('gpt-3.5-turbo-1106/something-/')).toBe(
      maxTokensMap[EModelEndpoint.openAI]['gpt-3.5-turbo-1106'],
    );
  });

  test('should return correct tokens for gpt-4-1106 partial match', () => {
    expect(getModelMaxTokens('gpt-4-1106/something')).toBe(
      maxTokensMap[EModelEndpoint.openAI]['gpt-4-1106'],
    );
    expect(getModelMaxTokens('gpt-4-1106-preview')).toBe(
      maxTokensMap[EModelEndpoint.openAI]['gpt-4-1106'],
    );
    expect(getModelMaxTokens('gpt-4-1106-vision-preview')).toBe(
      maxTokensMap[EModelEndpoint.openAI]['gpt-4-1106'],
    );
  });

  test('should return correct tokens for Anthropic models', () => {
    const models = [
      'claude-2.1',
      'claude-2',
      'claude-1.2',
      'claude-1',
      'claude-1-100k',
      'claude-instant-1',
      'claude-instant-1-100k',
    ];

    const claudeMaxTokens = maxTokensMap[EModelEndpoint.anthropic]['claude-'];
    const claude21MaxTokens = maxTokensMap[EModelEndpoint.anthropic]['claude-2.1'];
    models.forEach((model) => {
      const expectedTokens = model === 'claude-2.1' ? claude21MaxTokens : claudeMaxTokens;
      expect(getModelMaxTokens(model, EModelEndpoint.anthropic)).toEqual(expectedTokens);
    });
  });

  // Tests for Google models
  test('should return correct tokens for exact match - Google models', () => {
    expect(getModelMaxTokens('text-bison-32k', EModelEndpoint.google)).toBe(
      maxTokensMap[EModelEndpoint.google]['text-bison-32k'],
    );
    expect(getModelMaxTokens('codechat-bison-32k', EModelEndpoint.google)).toBe(
      maxTokensMap[EModelEndpoint.google]['codechat-bison-32k'],
    );
  });

  test('should return undefined for no match - Google models', () => {
    expect(getModelMaxTokens('unknown-google-model', EModelEndpoint.google)).toBeUndefined();
  });

  test('should return correct tokens for partial match - Google models', () => {
    expect(getModelMaxTokens('code-', EModelEndpoint.google)).toBe(
      maxTokensMap[EModelEndpoint.google]['code-'],
    );
    expect(getModelMaxTokens('chat-', EModelEndpoint.google)).toBe(
      maxTokensMap[EModelEndpoint.google]['chat-'],
    );
  });
});

describe('matchModelName', () => {
  it('should return the exact model name if it exists in maxTokensMap', () => {
    expect(matchModelName('gpt-4-32k-0613')).toBe('gpt-4-32k-0613');
  });

  it('should return the closest matching key for partial matches', () => {
    expect(matchModelName('gpt-4-32k-unknown')).toBe('gpt-4-32k');
  });

  it('should return the input model name if no match is found', () => {
    expect(matchModelName('unknown-model')).toBe('unknown-model');
  });

  it('should return undefined for non-string inputs', () => {
    expect(matchModelName(undefined)).toBeUndefined();
    expect(matchModelName(null)).toBeUndefined();
    expect(matchModelName(123)).toBeUndefined();
    expect(matchModelName({})).toBeUndefined();
  });

  // 11/06 Update
  it('should return the exact model name for gpt-3.5-turbo-1106 if it exists in maxTokensMap', () => {
    expect(matchModelName('gpt-3.5-turbo-1106')).toBe('gpt-3.5-turbo-1106');
  });

  it('should return the exact model name for gpt-4-1106 if it exists in maxTokensMap', () => {
    expect(matchModelName('gpt-4-1106')).toBe('gpt-4-1106');
  });

  it('should return the closest matching key for gpt-3.5-turbo-1106 partial matches', () => {
    expect(matchModelName('gpt-3.5-turbo-1106/something')).toBe('gpt-3.5-turbo-1106');
    expect(matchModelName('something/gpt-3.5-turbo-1106')).toBe('gpt-3.5-turbo-1106');
  });

  it('should return the closest matching key for gpt-4-1106 partial matches', () => {
    expect(matchModelName('something/gpt-4-1106')).toBe('gpt-4-1106');
    expect(matchModelName('gpt-4-1106-preview')).toBe('gpt-4-1106');
    expect(matchModelName('gpt-4-1106-vision-preview')).toBe('gpt-4-1106');
  });

  // Tests for Google models
  it('should return the exact model name if it exists in maxTokensMap - Google models', () => {
    expect(matchModelName('text-bison-32k', EModelEndpoint.google)).toBe('text-bison-32k');
    expect(matchModelName('codechat-bison-32k', EModelEndpoint.google)).toBe('codechat-bison-32k');
  });

  it('should return the input model name if no match is found - Google models', () => {
    expect(matchModelName('unknown-google-model', EModelEndpoint.google)).toBe(
      'unknown-google-model',
    );
  });

  it('should return the closest matching key for partial matches - Google models', () => {
    expect(matchModelName('code-', EModelEndpoint.google)).toBe('code-');
    expect(matchModelName('chat-', EModelEndpoint.google)).toBe('chat-');
  });
});

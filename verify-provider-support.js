const fs = require('fs');
const path = require('path');
const assert = require('assert');

const html = fs.readFileSync(path.join(__dirname, 'app.html'), 'utf8');
const scriptMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/);
if (!scriptMatch) throw new Error('Module script not found');
const script = scriptMatch[1];

function sliceBetween(startMarker, endMarker) {
  const start = script.indexOf(startMarker);
  const end = script.indexOf(endMarker, start);
  if (start === -1 || end === -1) {
    throw new Error(`Failed to slice between markers: ${startMarker} -> ${endMarker}`);
  }
  return script.slice(start, end);
}

const configSection = sliceBetween('// Provider Config Persistence', '// IndexedDB Cache');
const apiSection = sliceBetween('// Provider API — Embeddings & Generation', '// Math Pipeline');

function makeElement(initial = '') {
  return {
    value: initial,
    placeholder: '',
    textContent: '',
    innerHTML: '',
    listeners: {},
    addEventListener(type, fn) {
      this.listeners[type] = fn;
    },
  };
}

const elements = {
  'embedding-provider-select': makeElement('gemini'),
  'embedding-api-key-input': makeElement(''),
  'embedding-base-url-input': makeElement(''),
  'embedding-model-input': makeElement(''),
  'embedding-api-version-input': makeElement(''),
  'embedding-api-key-label': makeElement(''),
  'chat-provider-select': makeElement('gemini'),
  'chat-api-key-input': makeElement(''),
  'chat-base-url-input': makeElement(''),
  'chat-model-input': makeElement(''),
  'chat-api-version-input': makeElement(''),
  'chat-api-key-label': makeElement(''),
};

const localStorageData = new Map();

global.document = {
  getElementById(id) {
    if (!elements[id]) throw new Error(`Unknown element: ${id}`);
    return elements[id];
  },
};

global.localStorage = {
  getItem(key) {
    return localStorageData.has(key) ? localStorageData.get(key) : null;
  },
  setItem(key, value) {
    localStorageData.set(key, String(value));
  },
};

let fetchCalls = [];
global.fetch = async (url, options = {}) => {
  fetchCalls.push({ url, options });
  return {
    ok: true,
    headers: { get: () => 'application/json' },
    async json() {
      if (url.includes(':batchEmbedContents')) {
        const body = JSON.parse(options.body);
        return {
          embeddings: body.requests.map((_, index) => ({ values: [index + 1, index + 2] })),
        };
      }
      if (url.endsWith('/embeddings') || url.includes('/embeddings?api-version=')) {
        const body = JSON.parse(options.body);
        const input = Array.isArray(body.input) ? body.input : [];
        return {
          data: input.map((_, index) => ({ index, embedding: [index + 0.1, index + 0.2] })),
        };
      }
      if (url.includes(':generateContent')) {
        return { candidates: [{ content: { parts: [{ text: 'GEMINI OK' }] } }] };
      }
      if (url.endsWith('/messages')) {
        return { content: [{ type: 'text', text: 'ANTHROPIC OK' }] };
      }
      if (url.includes('/chat/completions')) {
        return { choices: [{ message: { content: 'OPENAI OK' } }] };
      }
      throw new Error(`Unexpected fetch URL: ${url}`);
    },
    async text() {
      return 'ok';
    },
    statusText: 'OK',
  };
};

const exported = new Function(`
${configSection}
${apiSection}
return {
  AZURE_API_VERSION,
  ANTHROPIC_VERSION,
  getProviderPreset,
  getDefaultSlotConfig,
  normalizeSlotConfig,
  normalizeConfig,
  getSavedConfig,
  saveConfig,
  getConfigFromInputs,
  applyConfigToInputs,
  syncSlotProvider,
  resolveAzureDeploymentBase,
  embedTexts,
  generateContent,
  embeddingProviderSelect,
  embeddingApiKeyInput,
  embeddingBaseUrlInput,
  embeddingModelInput,
  embeddingApiVersionInput,
  embeddingApiKeyLabel,
  chatProviderSelect,
  chatApiKeyInput,
  chatBaseUrlInput,
  chatModelInput,
  chatApiVersionInput,
  chatApiKeyLabel,
};
`)();

(async () => {
  const results = {};

  assert.equal(exported.embeddingProviderSelect.value, 'gemini');
  assert.equal(exported.embeddingBaseUrlInput.value, 'https://generativelanguage.googleapis.com/v1beta');
  assert.equal(exported.embeddingModelInput.value, 'gemini-embedding-001');
  assert.equal(exported.chatProviderSelect.value, 'gemini');
  assert.equal(exported.chatModelInput.value, 'gemini-2.5-flash');
  results.initial_defaults = 'ok';

  exported.embeddingApiKeyInput.value = 'embed-key';
  exported.syncSlotProvider('embedding', 'azure');
  assert.equal(exported.embeddingProviderSelect.value, 'azure');
  assert.equal(exported.embeddingApiKeyInput.value, 'embed-key');
  assert.equal(exported.embeddingBaseUrlInput.value, 'https://YOUR-RESOURCE.openai.azure.com');
  assert.equal(exported.embeddingModelInput.value, 'text-embedding-3-small');
  assert.equal(exported.embeddingApiVersionInput.value, exported.AZURE_API_VERSION);
  results.azure_switch = 'ok';

  exported.chatApiKeyInput.value = 'chat-key';
  exported.syncSlotProvider('chat', 'anthropic');
  assert.equal(exported.chatProviderSelect.value, 'anthropic');
  assert.equal(exported.chatApiKeyInput.value, 'chat-key');
  assert.equal(exported.chatBaseUrlInput.value, 'https://api.anthropic.com/v1');
  assert.equal(exported.chatApiVersionInput.value, exported.ANTHROPIC_VERSION);
  results.anthropic_switch = 'ok';

  fetchCalls = [];
  const openaiEmbedConfig = exported.normalizeSlotConfig('embedding', {
    provider: 'openrouter',
    apiKey: 'sk-openrouter',
    baseUrl: 'https://openrouter.ai/api/v1/',
    model: 'openai/text-embedding-3-small',
    apiVersion: '',
  });
  const openaiEmbeddings = await exported.embedTexts(['alpha', 'beta'], openaiEmbedConfig);
  assert.deepEqual(openaiEmbeddings, [[0.1, 0.2], [1.1, 1.2]]);
  assert.equal(fetchCalls[0].url, 'https://openrouter.ai/api/v1/embeddings');
  assert.equal(fetchCalls[0].options.headers.Authorization, 'Bearer sk-openrouter');
  results.openai_embedding = 'ok';

  fetchCalls = [];
  const anthropicChatConfig = exported.normalizeSlotConfig('chat', {
    provider: 'anthropic',
    apiKey: 'sk-ant',
    baseUrl: 'https://api.anthropic.com/v1/',
    model: 'claude-3-5-sonnet-latest',
    apiVersion: exported.ANTHROPIC_VERSION,
  });
  const anthropicText = await exported.generateContent('Hello', anthropicChatConfig);
  assert.equal(anthropicText, 'ANTHROPIC OK');
  assert.equal(fetchCalls[0].url, 'https://api.anthropic.com/v1/messages');
  assert.equal(fetchCalls[0].options.headers['x-api-key'], 'sk-ant');
  assert.equal(fetchCalls[0].options.headers['anthropic-version'], exported.ANTHROPIC_VERSION);
  const anthropicBody = JSON.parse(fetchCalls[0].options.body);
  assert.equal(anthropicBody.model, 'claude-3-5-sonnet-latest');
  results.anthropic_chat = 'ok';

  fetchCalls = [];
  const azureEmbedConfig = exported.normalizeSlotConfig('embedding', {
    provider: 'azure',
    apiKey: 'az-key',
    baseUrl: 'https://demo.openai.azure.com',
    model: 'embed-deployment',
    apiVersion: '2024-10-21',
  });
  const azureChatConfig = exported.normalizeSlotConfig('chat', {
    provider: 'azure',
    apiKey: 'az-key',
    baseUrl: 'https://demo.openai.azure.com',
    model: 'chat-deployment',
    apiVersion: '2024-10-21',
  });
  await exported.embedTexts(['alpha'], azureEmbedConfig);
  await exported.generateContent('Hello', azureChatConfig);
  assert.equal(fetchCalls[0].url, 'https://demo.openai.azure.com/openai/deployments/embed-deployment/embeddings?api-version=2024-10-21');
  assert.equal(fetchCalls[0].options.headers['api-key'], 'az-key');
  assert.deepEqual(JSON.parse(fetchCalls[0].options.body), { input: ['alpha'] });
  assert.equal(fetchCalls[1].url, 'https://demo.openai.azure.com/openai/deployments/chat-deployment/chat/completions?api-version=2024-10-21');
  assert.equal(fetchCalls[1].options.headers['api-key'], 'az-key');
  assert.deepEqual(JSON.parse(fetchCalls[1].options.body), {
    messages: [{ role: 'user', content: 'Hello' }],
    temperature: 0.2,
  });
  results.azure_requests = 'ok';

  fetchCalls = [];
  const geminiEmbedConfig = exported.normalizeSlotConfig('embedding', {
    provider: 'gemini',
    apiKey: 'AIza test/key',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/',
    model: 'gemini-embedding-001',
    apiVersion: '',
  });
  const geminiChatConfig = exported.normalizeSlotConfig('chat', {
    provider: 'gemini',
    apiKey: 'AIza test/key',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/',
    model: 'gemini-2.5-flash',
    apiVersion: '',
  });
  await exported.embedTexts(['alpha'], geminiEmbedConfig);
  await exported.generateContent('Hello', geminiChatConfig);
  assert.equal(fetchCalls[0].url, 'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:batchEmbedContents?key=AIza%20test%2Fkey');
  assert.equal(fetchCalls[1].url, 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIza%20test%2Fkey');
  results.gemini_requests = 'ok';

  fetchCalls = [];
  const ollamaCloudChatConfig = exported.normalizeSlotConfig('chat', {
    provider: 'ollama-cloud',
    apiKey: 'ollama-key',
    baseUrl: 'https://ollama.com/v1/',
    model: 'deepseek-v4-pro',
    apiVersion: '',
  });
  await exported.generateContent('Hello', ollamaCloudChatConfig);
  assert.equal(fetchCalls[0].url, 'https://ollama.com/v1/chat/completions');
  assert.equal(fetchCalls[0].options.headers.Authorization, 'Bearer ollama-key');
  results.ollama_cloud = 'ok';

  console.log(JSON.stringify(results, null, 2));
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

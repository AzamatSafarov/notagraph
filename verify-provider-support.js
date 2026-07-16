const fs = require('fs');
const path = require('path');
const assert = require('assert');

const html = fs.readFileSync(path.join(__dirname, 'app.html'), 'utf8');
const scriptMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/);
if (!scriptMatch) throw new Error('Module script not found');
const script = scriptMatch[1].replace(/\r\n/g, '\n');

function sliceBetween(startMarker, endMarker) {
  const start = script.indexOf(startMarker);
  const end = script.indexOf(endMarker, start);
  if (start === -1 || end === -1) {
    throw new Error(`Failed to slice between markers: ${startMarker} -> ${endMarker}`);
  }
  return script.slice(start, end);
}

const configSection = sliceBetween('// Provider Config Persistence', '// IndexedDB Cache');
const pickerSection = sliceBetween('const folderInput = document.getElementById(\'folder-input\');', '// ═══════════════════════════════════════════════\n    // Button Wiring & Screen Transition');
const apiSection = sliceBetween('// Provider API — Embeddings & Generation', '// Math Pipeline');

function makeElement(initial = '') {
  return {
    value: initial,
    placeholder: '',
    textContent: '',
    innerHTML: '',
    checked: false,
    files: [],
    listeners: {},
    classList: {
      classes: new Set(),
      toggle(name, force) {
        if (force === undefined) {
          if (this.classes.has(name)) this.classes.delete(name);
          else this.classes.add(name);
          return;
        }
        if (force) this.classes.add(name);
        else this.classes.delete(name);
      },
      add(name) { this.classes.add(name); },
      remove(name) { this.classes.delete(name); },
      contains(name) { return this.classes.has(name); },
    },
    addEventListener(type, fn) {
      this.listeners[type] = fn;
    },
    removeEventListener(type) {
      delete this.listeners[type];
    },
    click() {
      if (typeof this._clickImpl === 'function') this._clickImpl();
    },
  };
}

const elements = {
  'primary-provider-select': makeElement('ollama-cloud'),
  'primary-api-key-input': makeElement(''),
  'primary-base-url-input': makeElement(''),
  'primary-api-version-input': makeElement(''),
  'primary-embedding-model-input': makeElement(''),
  'primary-chat-model-input': makeElement(''),
  'primary-api-key-label': makeElement(''),
  'use-separate-chat-toggle': makeElement(''),
  'advanced-chat-section': makeElement(''),
  'chat-provider-select': makeElement('anthropic'),
  'chat-api-key-input': makeElement(''),
  'chat-base-url-input': makeElement(''),
  'chat-api-version-input': makeElement(''),
  'chat-model-input': makeElement(''),
  'chat-api-key-label': makeElement(''),
  'folder-input': makeElement(''),
};

const localStorageData = new Map();
const windowListeners = {};

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

global.window = {
  addEventListener(type, fn) {
    windowListeners[type] = fn;
  },
  removeEventListener(type) {
    delete windowListeners[type];
  },
};

global.setTimeout = (fn) => { fn(); return 1; };

let fetchCalls = [];
global.fetch = async (url, options = {}) => {
  fetchCalls.push({ url, options });
  return {
    ok: true,
    headers: { get: () => 'application/json' },
    async json() {
      if (url.includes(':batchEmbedContents')) {
        const body = JSON.parse(options.body);
        return { embeddings: body.requests.map((_, index) => ({ values: [index + 1, index + 2] })) };
      }
      if (url.endsWith('/embeddings') || url.includes('/embeddings?api-version=')) {
        const body = JSON.parse(options.body);
        const input = Array.isArray(body.input) ? body.input : [];
        return { data: input.map((_, index) => ({ index, embedding: [index + 0.1, index + 0.2] })) };
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
    async text() { return 'ok'; },
    statusText: 'OK',
  };
};

const exported = new Function(`
${configSection}
${pickerSection}
${apiSection}
return {
  AZURE_API_VERSION,
  ANTHROPIC_VERSION,
  getSavedConfig,
  saveConfig,
  getConfigFromInputs,
  applyConfigToInputs,
  syncPrimaryProvider,
  syncChatOverrideProvider,
  buildRuntimeConfig,
  pickFolder,
  readNotesFromSelection,
  embedTexts,
  generateContent,
  primaryProviderSelect,
  primaryApiKeyInput,
  primaryBaseUrlInput,
  primaryApiVersionInput,
  primaryEmbeddingModelInput,
  primaryChatModelInput,
  useSeparateChatToggle,
  advancedChatSection,
  chatProviderSelect,
  chatApiKeyInput,
  chatBaseUrlInput,
  chatApiVersionInput,
  chatModelInput,
  folderInput,
};
`)();

(async () => {
  const results = {};

  assert.equal(exported.primaryProviderSelect.value, 'ollama-cloud');
  assert.equal(exported.primaryBaseUrlInput.value, 'https://ollama.com/v1');
  assert.equal(exported.primaryEmbeddingModelInput.value, 'nomic-embed-text');
  assert.equal(exported.primaryChatModelInput.value, 'deepseek-v4-pro');
  assert.equal(exported.useSeparateChatToggle.checked, false);
  assert.equal(exported.advancedChatSection.classList.contains('hidden'), true);
  results.simple_defaults = 'ok';

  exported.primaryApiKeyInput.value = 'primary-key';
  exported.syncPrimaryProvider('azure');
  assert.equal(exported.primaryProviderSelect.value, 'azure');
  assert.equal(exported.primaryApiKeyInput.value, 'primary-key');
  assert.equal(exported.primaryBaseUrlInput.value, 'https://YOUR-RESOURCE.openai.azure.com');
  assert.equal(exported.primaryApiVersionInput.value, exported.AZURE_API_VERSION);
  assert.equal(exported.primaryEmbeddingModelInput.value, 'text-embedding-3-small');
  assert.equal(exported.primaryChatModelInput.value, 'gpt-4o-mini');
  results.azure_defaults = 'ok';

  exported.primaryBaseUrlInput.value = 'https://demo.openai.azure.com';
  exported.primaryEmbeddingModelInput.value = 'embed-deploy';
  exported.primaryChatModelInput.value = 'chat-deploy';
  let runtime = exported.buildRuntimeConfig(exported.getConfigFromInputs());
  assert.equal(runtime.embedding.provider, 'azure');
  assert.equal(runtime.embedding.model, 'embed-deploy');
  assert.equal(runtime.chat.model, 'chat-deploy');
  assert.equal(runtime.chat.provider, 'azure');
  results.simple_runtime = 'ok';

  exported.useSeparateChatToggle.checked = true;
  exported.chatProviderSelect.value = 'anthropic';
  exported.chatApiKeyInput.value = 'chat-key';
  exported.chatBaseUrlInput.value = 'https://api.anthropic.com/v1';
  exported.chatApiVersionInput.value = exported.ANTHROPIC_VERSION;
  exported.chatModelInput.value = 'claude-3-5-sonnet-latest';
  runtime = exported.buildRuntimeConfig(exported.getConfigFromInputs());
  assert.equal(runtime.chat.provider, 'anthropic');
  assert.equal(runtime.chat.model, 'claude-3-5-sonnet-latest');
  results.advanced_runtime = 'ok';

  fetchCalls = [];
  await exported.embedTexts(['alpha'], {
    provider: 'azure',
    apiKey: 'az-key',
    baseUrl: 'https://demo.openai.azure.com',
    apiVersion: '2024-10-21',
    model: 'embed-deploy',
  });
  await exported.generateContent('Hello', {
    provider: 'anthropic',
    apiKey: 'chat-key',
    baseUrl: 'https://api.anthropic.com/v1',
    apiVersion: exported.ANTHROPIC_VERSION,
    model: 'claude-3-5-sonnet-latest',
  });
  assert.equal(fetchCalls[0].url, 'https://demo.openai.azure.com/openai/deployments/embed-deploy/embeddings?api-version=2024-10-21');
  assert.equal(fetchCalls[0].options.headers['api-key'], 'az-key');
  assert.equal(fetchCalls[1].url, 'https://api.anthropic.com/v1/messages');
  assert.equal(fetchCalls[1].options.headers['x-api-key'], 'chat-key');
  results.provider_requests = 'ok';

  delete global.window.showDirectoryPicker;
  exported.folderInput._clickImpl = () => {
    exported.folderInput.files = [
      { name: 'a.md', webkitRelativePath: 'vault/a.md', text: async () => '# A' },
      { name: 'b.txt', webkitRelativePath: 'vault/sub/b.txt', text: async () => 'hello' },
      { name: 'c.jpg', webkitRelativePath: 'vault/c.jpg', text: async () => 'ignore' },
    ];
    exported.folderInput.listeners.change();
  };
  const selection = await exported.pickFolder();
  assert.equal(selection.mode, 'input');
  assert.equal(selection.folderName, 'vault');
  assert.deepEqual(selection.filenames, ['vault/a.md', 'vault/sub/b.txt']);
  const notes = await exported.readNotesFromSelection(selection);
  assert.equal(notes.length, 2);
  assert.equal(notes[0].filename, 'vault/a.md');
  assert.equal(notes[1].filename, 'vault/sub/b.txt');
  results.folder_fallback = 'ok';

  console.log(JSON.stringify(results, null, 2));
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

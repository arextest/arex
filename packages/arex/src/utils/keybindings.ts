import {
  isAppleDevice,
  isDOMElement,
  isTypableElement,
  transformPlatformKey,
} from '@arextest/arex-core';

/**
 * This variable keeps track whether keybindings are being accepted
 * true -> Keybindings are checked
 * false -> Key presses are ignored (Keybindings are not checked)
 */
let keybindingsEnabled = true;

/**
 * Alt is also regarded as macOS OPTION (⌥) key
 * Ctrl is also regarded as macOS COMMAND (⌘) key (NOTE: this differs from HTML Keyboard spec where COMMAND is Meta key!)
 */
type ModifierKeys = 'ctrl' | 'alt' | 'ctrl-shift' | 'alt-shift' | 'ctrl-alt' | 'ctrl-alt-shift';

/* eslint-disable prettier/prettier */
// prettier-ignore
type Key =
  | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j"
  | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t"
  | "u" | "v" | "w" | "x" | "y" | "z" | "0" | "1" | "2" | "3"
  | "4" | "5" | "6" | "7" | "8" | "9" | "up" | "down" | "left"
  | "right" | "/" | "?" | "." |"," | "enter"
/* eslint-enable */

type ModifierBasedShortcutKey = `${ModifierKeys}-${Key}`;
// Singular keybindings (these will be disabled when an input-ish area has been focused)
type SingleCharacterShortcutKey = `${Key}`;

type ShortcutKey = ModifierBasedShortcutKey | SingleCharacterShortcutKey;

// Keyboard shortcut config, first section value is category name
export const bindings: {
  [_ in ShortcutKey]?: string;
} = {
  // General
  'ctrl-u': 'general.copy-link',
  // 'ctrl-k': 'general.search.toggle',
  'ctrl-/': 'general.keybindings.toggle',

  // Request
  'ctrl-enter': 'request.send',
  'ctrl-shift-enter': 'request.send-cancel',
  'ctrl-s': 'request.save',
  'ctrl-shift-s': 'request.save-as',

  // Replay
  'alt-r': 'replay.refresh-report',
  'alt-d': 'replay.record-detail',
  'alt-shift-,': 'replay.app-setting',
  'alt-p': 'replay.create-plan',

  // ReplayCase
  'alt-b': 'replayCase.replay-report',

  // Navigation
  'alt-,': 'navigation.setting',
  'alt-h': 'navigation.help',
  'alt-o': 'navigation.workspace',

  // Pane
  'alt-t': 'pane.new',
  'alt-w': 'pane.close',
  'alt-shift-w': 'pane.close-other',
  'alt-left': 'pane.prev',
  'alt-right': 'pane.next',

  // Menu
  'alt-x': 'menu.collapse',
  'alt-up': 'menu.prev',
  'alt-down': 'menu.next',
  'alt-shift-c': 'menu.collection',
  'alt-shift-r': 'menu.replay',
  'alt-shift-e': 'menu.environment',
};

export type ShortcutDef = {
  label: string;
  keys: string[];
  section: string;
};
export type ShortcutsMap = { [category: string]: ShortcutDef[] };
export const shortcuts = Object.entries(bindings).reduce<ShortcutsMap>((map, [key, action]) => {
  const [section] = action.split('.');
  if (!map[section]) {
    map[section] = [];
  }
  map[section].push({
    label: action,
    keys: key.split('-').map(transformPlatformKey),
    section,
  });
  return map;
}, {});

export function handleKeyDown(ev: KeyboardEvent) {
  // Do not check keybindings if the mode is disabled
  if (!keybindingsEnabled) return;

  const binding = generateKeybindingString(ev);
  if (!binding) return;

  const boundAction = bindings[binding];
  if (!boundAction) return;

  ev.preventDefault();
  return boundAction;
}

function generateKeybindingString(ev: KeyboardEvent): ShortcutKey | null {
  // We may or may not have a modifier key
  const modifierKey = getActiveModifier(ev);

  // We will always have a non-modifier key
  const key = getPressedKey(ev);
  if (!key) return null;

  // All key combos backed by modifiers are valid shortcuts (whether currently typing or not)
  if (modifierKey) return `${modifierKey}-${key}`;

  const target = ev.target;

  // no modifier key here then we do not do anything while on input
  if (isDOMElement(target) && isTypableElement(target)) return null;

  // single key while not input
  return `${key}`;
}

function getPressedKey(ev: KeyboardEvent): Key | null {
  const val = ev.key.toLowerCase();
  // Check arrow keys
  if (val === 'arrowup') return 'up';
  else if (val === 'arrowdown') return 'down';
  else if (val === 'arrowleft') return 'left';
  else if (val === 'arrowright') return 'right';

  // Check letter keys
  const isLetter = ev.code.toLowerCase().startsWith('key');
  if (isLetter) return ev.code.toLowerCase().substring(3) as Key;

  // Check if number keys
  if (val.length === 1 && !isNaN(val as any)) return val as Key;

  // Check if question mark
  if (val === '?') return '?';

  // Check if question mark
  if (val === '/') return '/';

  // Check if period
  if (val === '.') return '.';

  // redirection to comma
  if (val === '≤') return ','; // effected by alt
  if (val === '¯') return ','; // effected by alt-shift

  if (val === 'enter') return 'enter';

  // If no other cases match, this is not a valid key
  return null;
}

function getActiveModifier(ev: KeyboardEvent): ModifierKeys | null {
  const modifierKeys = {
    ctrl: isAppleDevice() ? ev.metaKey : ev.ctrlKey,
    alt: ev.altKey,
    shift: ev.shiftKey,
  };

  // active modifier: ctrl | alt | ctrl-alt | ctrl-shift | ctrl-alt-shift | alt-shift
  // modifierKeys object's keys are sorted to match the above order
  const activeModifier = Object.keys(modifierKeys)
    .filter((key) => modifierKeys[key as keyof typeof modifierKeys])
    .join('-');

  return activeModifier === '' ? null : (activeModifier as ModifierKeys);
}

/**
 * This composable allows for the UI component to be disabled if the component in question is mounted
 */
export function useKeybindingDisabler() {
  // TODO: Move to a lock based system that keeps the bindings disabled until all locks are lifted
  const disableKeybindings = () => {
    keybindingsEnabled = false;
  };

  const enableKeybindings = () => {
    keybindingsEnabled = true;
  };

  return {
    disableKeybindings,
    enableKeybindings,
  };
}

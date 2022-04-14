import {
  createPluginFactory,
  getAbove,
  getNodes,
  getPluginType,
} from '@udecode/plate-core';
import { ThreadPlugin } from './types.js';

export const ELEMENT_THREAD = 'thread';

export const createThreadPlugin = createPluginFactory<ThreadPlugin>({
  key: ELEMENT_THREAD,
  isElement: true,
  isInline: true,
  handlers: {
    onChange(editor) {
      const type = getPluginType(editor, ELEMENT_THREAD);
      return () => {
        const threadNodes = getNodes(editor, {
          at: [],
          match: { type },
        });
        for (const threadNode of threadNodes) {
          threadNode[0].selected = false;
        }

        const threadNode = getAbove(editor, {
          match: { type },
        });
        if (threadNode) {
          const { thread } = threadNode[0];
          if (thread) {
            threadNode[0].selected = true;
            // window.alert(comment);
          }
        }
      };
    },
  },
});
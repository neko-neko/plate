import { TElement } from '@udecode/plate-core';
import { Thread } from './Thread';

export interface ThreadNodeData {
  thread: Thread;
  selected: boolean;
}

export type ThreadElement = TElement & ThreadNodeData;

export interface ThreadPlugin {}
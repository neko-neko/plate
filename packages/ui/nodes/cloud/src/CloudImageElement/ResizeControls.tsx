import React, { useCallback, useRef, useState } from 'react';
import { resizeInWidth } from '@portive/client';
import { CloudEditor, TCloudImageElement } from '@udecode/plate-cloud';
import { Element, Transforms } from 'slate';
import { ReactEditor, useSlateStatic } from 'slate-react';
import { useImageContext } from './ImageContext';
import { ImageSize, SetImageSize } from './types';
// import { ImageFileInterface } from '../types';
// import { useHostedImageContext } from './hosted-image-context';

/**
 * FIXME: These constant should be options in the plugin.
 */
const PLUGIN_MIN_RESIZE_WIDTH = 100;
const PLUGIN_MAX_RESIZE_WIDTH = 640;

/**
 * The resize label that shows the width/height of the image
 */
function ResizeLabel({ size }: { size: { width: number; height: number } }) {
  const isBelow = size.width < 100 || size.height < 100;
  const bottom = isBelow ? -24 : 4;
  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        left: 4,
        font: '10px/20px sans-serif',
        color: 'white',
        background: '#404040',
        minWidth: 50,
        padding: '0 7px',
        borderRadius: 3,
        textAlign: 'center',
        boxShadow: '0px 0px 2px 1px rgba(255, 255, 255, 0.5)',
        zIndex: 100,
        transition: 'bottom 250ms',
      }}
    >
      {size.width} &times; {size.height}
    </div>
  );
}

/**
 * The little divets on the resize handle bar.
 */
const barStyle = {
  position: 'absolute',
  top: 8,
  width: 1,
  height: 16,
  background: 'rgba(255,255,255,0.75)',
} as const;

/**
 * The handle used to drag resize an image
 */
function ResizeHandles({
  onMouseDown,
}: {
  onMouseDown: React.MouseEventHandler;
}) {
  return (
    <>
      {/* Invisible Handle */}
      <div
        onMouseDown={onMouseDown}
        style={{
          position: 'absolute',
          cursor: 'ew-resize',
          width: 16,
          right: -8,
          top: 0,
          bottom: 0,
          background: 'rgba(127,127,127,0.01)',
        }}
      >
        {/* Visible Handle */}
        <div
          style={{
            position: 'absolute',
            width: 16,
            height: 32,
            background: 'DodgerBlue',
            borderRadius: 4,
            left: 0,
            top: '50%',
            marginTop: -16,
          }}
        >
          <div style={{ ...barStyle, left: 3.5 }} />
          <div style={{ ...barStyle, left: 7.5 }} />
          <div style={{ ...barStyle, left: 11.5 }} />
        </div>
      </div>
    </>
  );
}

export function ResizeControls({
  element,
  size,
  setSize,
}: {
  element: TCloudImageElement;
  size: ImageSize;
  setSize: SetImageSize;
}) {
  const editor = useSlateStatic() as CloudEditor;
  const [isResizing, setIsResizing] = useState(false);

  const currentSizeRef = useRef<{ width: number; height: number }>();

  const onMouseDown = useCallback(
    (mouseDownEvent: React.MouseEvent) => {
      setIsResizing(true);
      const startX = mouseDownEvent.clientX;
      const startWidth = size.width;
      const minWidth = PLUGIN_MIN_RESIZE_WIDTH;
      const maxWidth = Math.min(element.maxWidth, PLUGIN_MAX_RESIZE_WIDTH);
      /**
       * Handle resize dragging through an event handler on mouseMove on the
       * document.
       */
      function onDocumentMouseMove(mouseMoveEvent: MouseEvent) {
        mouseMoveEvent.preventDefault();
        mouseMoveEvent.stopPropagation();
        /**
         * Calculate the proposed width based on drag position
         */
        const proposedWidth = startWidth + mouseMoveEvent.clientX - startX;

        /**
         * Constrain the proposed with between min, max and original width
         */
        const nextWidth = Math.min(maxWidth, Math.max(minWidth, proposedWidth));

        const currentSize = resizeInWidth(
          { width: element.maxWidth, height: element.maxHeight },
          nextWidth
        );

        currentSizeRef.current = currentSize;
        setSize(currentSize);
      }

      const originalCursor = document.body.style.cursor;

      /**
       * When the user releases the mouse, remove all the event handlers
       */
      function onDocumentMouseUp() {
        setIsResizing(false);
        document.removeEventListener('mousemove', onDocumentMouseMove);
        document.removeEventListener('mouseup', onDocumentMouseUp);
        document.body.style.cursor = originalCursor;

        const at = ReactEditor.findPath(editor, element as Element);

        if (!currentSizeRef.current) return;

        Transforms.setNodes<TCloudImageElement>(
          editor,
          currentSizeRef.current,
          { at }
        );
      }

      /**
       * Attach document event listeners
       */
      document.addEventListener('mousemove', onDocumentMouseMove);
      document.addEventListener('mouseup', onDocumentMouseUp);

      /**
       * While dragging, we want the cursor to be `ew-resize` (left-right arrow)
       * even if the cursor happens to not be exactly on the handle at the moment
       * due to a delay in the cursor moving to a location and the image resizing
       * to it.
       *
       * Also, image has max width/height and the cursor can fall outside of it.
       */
      document.body.style.cursor = 'ew-resize';
    },
    [editor, element, size, setSize]
  );

  if (element.width < PLUGIN_MIN_RESIZE_WIDTH) return null;

  return (
    <>
      {isResizing ? <ResizeLabel size={size} /> : null}
      <ResizeHandles onMouseDown={onMouseDown} />
    </>
  );
}

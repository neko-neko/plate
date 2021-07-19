import { FunctionComponent } from 'react';
import { SPRenderElementProps } from '../SPRenderElementProps';
import { SPRenderLeafProps } from '../SPRenderLeafProps';
import { AnyObject } from '../utility/AnyObject';
import { DeserializeOptions } from './DeserializeOptions';
import { GetNodeProps } from './GetNodeProps';

/**
 * React component rendering a slate element or leaf.
 * @default DefaultElement | DefaultLeaf
 */
export type PlatePluginComponent = FunctionComponent<
  SPRenderElementProps | SPRenderLeafProps
>;

export interface PlatePluginOptions extends AnyObject {
  /**
   * Node properties to delete.
   */
  clear?: string | string[];

  /**
   * `Plate` maps each slate node to this component to render.
   */
  component?: PlatePluginComponent;

  /**
   * Default type of slate blocks.
   * @default 'p'
   */
  defaultType?: string;

  /**
   * `getElementDeserializer` and `getLeafDeserializer` options.
   */
  deserialize?: Partial<DeserializeOptions>;

  /**
   * @see {@link GetNodeProps}
   */
  getNodeProps?: GetNodeProps;

  /**
   * Hotkeys to listen to trigger a plugin action.
   */
  hotkey?: string | string[];

  /**
   * Element or mark type.
   * @default plugin key
   */
  type: string;
}

/**
 * A unique key to store the plugin options by key.
 */
export type PluginKey = string;

/**
 * Plate options stored by plugin key.
 * Each plugin can access the options by its plugin key.
 *
 * @default {}
 * @see {@link PluginKey}
 */
export type PlateOptions = Record<PluginKey, PlatePluginOptions>;

import {
  createStyles,
  StyledElementProps,
} from '@udecode/plate-styled-components';
import { css } from 'styled-components';

export const getLinkElementStyles = (props: StyledElementProps) =>
  createStyles(
    { prefixClassNames: 'LinkElement', ...props },
    {
      root: css`
        color: #0078d4;
        text-decoration: initial;

        :hover,
        :visited:hover {
          color: #004578;
          text-decoration: underline;
        }

        :visited {
          color: #0078d4;
        }
      `,
    }
  );

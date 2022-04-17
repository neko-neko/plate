import '@material/button/dist/mdc.button.css';
import '@material/dialog/dist/mdc.dialog.css';
import '@material/notched-outline/dist/mdc.notched-outline.css';
import '@material/textfield/dist/mdc.textfield.css';
import '@material/snackbar/dist/mdc.snackbar.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { MDCDialog } from '@material/dialog';
import { MDCRipple } from '@material/ripple';
import { MDCSnackbar } from '@material/snackbar';

interface CommentLinkDialogProps {
  commentLink: string;
  onClose: () => void;
}

export class CommentLinkDialog extends React.Component<CommentLinkDialogProps> {
  ref: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  snackbarRef: React.RefObject<HTMLElement>;
  doneButtonRef: React.RefObject<HTMLButtonElement>;
  copyLinkButtonRef: React.RefObject<HTMLButtonElement>;
  dialog?: MDCDialog;
  snackbar?: MDCSnackbar;

  constructor(props: CommentLinkDialogProps) {
    super(props);
    this.ref = React.createRef();
    this.inputRef = React.createRef();
    this.snackbarRef = React.createRef();
    this.doneButtonRef = React.createRef();
    this.copyLinkButtonRef = React.createRef();
    this.onCopyLink = this.onCopyLink.bind(this);
  }

  componentDidMount() {
    this.dialog = new MDCDialog(this.ref.current!);
    new MDCRipple(this.doneButtonRef.current!);
    new MDCRipple(this.copyLinkButtonRef.current!);
    this.inputRef.current!.select();
    this.snackbar = new MDCSnackbar(this.snackbarRef.current!);
  }

  async onCopyLink() {
    const { commentLink } = this.props;
    await navigator.clipboard.writeText(commentLink);
    this.snackbar!.open();
    this.inputRef.current!.select();
  }

  render() {
    const { commentLink, onClose } = this.props;

    return ReactDOM.createPortal(
      <div
        ref={this.ref}
        className="mdc-dialog mdc-dialog--open mdc-dialog--fullscreen"
      >
        <div className="mdc-dialog__container">
          <div
            className="mdc-dialog__surface"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="comment-link-dialog-title"
            aria-describedby="comment-link-dialog-content"
          >
            <div
              className="mdc-dialog__content"
              id="comment-link-dialog-content"
            >
              <label
                className="mdc-text-field mdc-text-field--outlined mdc-text-field--no-label"
                style={{ width: '100%' }}
              >
                <span className="mdc-notched-outline">
                  <span className="mdc-notched-outline__leading" />
                  <span className="mdc-notched-outline__trailing" />
                </span>
                <input
                  ref={this.inputRef}
                  className="mdc-text-field__input"
                  type="text"
                  aria-label="Comment link"
                  defaultValue={commentLink}
                  readOnly
                />
              </label>

              <aside
                ref={this.snackbarRef}
                className="mdc-snackbar"
                style={{ bottom: '0.5rem' }}
              >
                <div
                  className="mdc-snackbar__surface"
                  role="status"
                  aria-relevant="additions"
                >
                  <div className="mdc-snackbar__label" aria-atomic="false">
                    The link has been copied to the clipboard.
                  </div>
                </div>
              </aside>
            </div>
            <div className="mdc-dialog__actions">
              <button
                ref={this.doneButtonRef}
                type="button"
                className="mdc-button mdc-dialog__button"
                data-mdc-dialog-action="done"
                onClick={onClose}
              >
                <div className="mdc-button__ripple" />
                <span className="mdc-button__label">Done</span>
              </button>
              <button
                ref={this.copyLinkButtonRef}
                type="button"
                className="mdc-button mdc-dialog__button"
                data-mdc-dialog-action="copy-link"
                onClick={this.onCopyLink}
              >
                <div className="mdc-button__ripple" />
                <span className="mdc-button__label">Copy link</span>
              </button>
            </div>
          </div>
        </div>
        <div className="mdc-dialog__scrim" />
      </div>,
      document.body
    );
  }
}

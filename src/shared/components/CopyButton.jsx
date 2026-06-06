import { languages } from '../../content';
import { useCopyToClipboard } from '../hooks/use-copy-to-clipboard';
import { Icon } from './Icon';

export function CopyButton({ text, lang }) {
  const { copiedText, copy } = useCopyToClipboard();
  const copyText = languages[lang].shared;
  const isCopied = copiedText === text;

  return (
    <button
      className={`copy-button${isCopied ? ' is-copied' : ''}`}
      type="button"
      aria-label={isCopied ? copyText.copiedLabel : copyText.copyLabel}
      onClick={() => copy(text)}
    >
      <Icon type="copy" />
      <span>{isCopied ? copyText.copiedLabel : copyText.copyLabel}</span>
    </button>
  );
}

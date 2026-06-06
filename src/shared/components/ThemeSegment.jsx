import { languages } from '../../content';
import { themeModes } from '../hooks/use-theme-mode';
import { Icon } from './Icon';

export function ThemeSegment({ lang, mode, setMode, compact = false }) {
  const labels = languages[lang].theme;
  const icons = {
    auto: 'monitor',
    light: 'sun',
    dark: 'moon',
  };

  return (
    <div className={`theme-segment${compact ? ' is-compact' : ''}`} role="group" aria-label={labels.label}>
      {themeModes.map((themeMode) => (
        <button
          key={themeMode}
          className={`theme-option${mode === themeMode ? ' is-active' : ''}`}
          type="button"
          aria-label={labels[themeMode]}
          aria-pressed={mode === themeMode}
          title={labels[themeMode]}
          onClick={() => setMode(themeMode)}
        >
          <Icon type={icons[themeMode]} />
        </button>
      ))}
    </div>
  );
}

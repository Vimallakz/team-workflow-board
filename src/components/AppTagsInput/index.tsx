import clsx from 'clsx';
import { useState, type FC, type KeyboardEvent } from 'react';

type CommonProps = {
  className?: string;
  label?: string;
  error?: string;
  placeholder?: string;
};

export type AppTagsInputProps = CommonProps & {
  tags: string[];
  onChange: (tags: string[]) => void;
  onBlur?: () => void;
  name?: string;
};

const normalizeTag = (value: string) => value.trim().toLowerCase();

export const AppTagsInput: FC<AppTagsInputProps> = ({
  tags,
  onChange,
  onBlur,
  name,
  className = '',
  label,
  error,
  placeholder = 'Type a tag and press Enter',
}) => {
  const [draft, setDraft] = useState('');

  const addTag = (raw: string) => {
    const tag = normalizeTag(raw);
    if (!tag || tags.includes(tag)) return;
    onChange([...tags, tag]);
    setDraft('');
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((item) => item !== tag));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addTag(draft);
      return;
    }

    if (event.key === 'Backspace' && !draft && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const borderClassName = error
    ? 'border-red-400 focus-within:border-red-500 focus-within:ring-red-100'
    : 'border-slate-300 focus-within:border-indigo-400 focus-within:ring-indigo-100';

  return (
    <div className={clsx('flex w-full flex-col gap-1', className)}>
      {label ? (
        <span className="text-xs font-medium text-slate-600">{label}</span>
      ) : null}
      <div
        className={clsx(
          'flex min-h-8 w-full flex-wrap items-center gap-1.5 rounded-lg border bg-white px-2 py-1.5 transition focus-within:ring-2',
          borderClassName,
        )}
      >
        {name ? <input type="hidden" name={name} value={tags.join(',')} readOnly /> : null}
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700"
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={() => removeTag(tag)}
              className="rounded text-indigo-500 hover:bg-indigo-100 hover:text-indigo-800"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (draft.trim()) addTag(draft);
            onBlur?.();
          }}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="min-w-[120px] flex-1 border-0 bg-transparent px-1 text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
};

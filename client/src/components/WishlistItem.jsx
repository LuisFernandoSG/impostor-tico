import { Button } from './Button.jsx';

export const WishlistItem = ({ item, onRemove }) => (
  <article className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-sm shadow-black/20">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h4 className="text-base font-semibold text-white">{item.title}</h4>
        {item.note ? <p className="text-sm text-white/80">{item.note}</p> : null}
      </div>
      {onRemove ? (
        <Button variant="ghost" onClick={() => onRemove(item.id)} className="text-xs uppercase tracking-wide">
          Quitar
        </Button>
      ) : null}
    </div>
    <a
      className="inline-flex items-center gap-2 text-sm font-semibold text-brand-100 hover:text-brand-50"
      href={item.url}
      target="_blank"
      rel="noreferrer"
    >
      Ver en Amazon
      <span aria-hidden>↗</span>
    </a>
    {item.imageUrl ? (
      <img src={item.imageUrl} alt={item.title} className="h-32 w-full rounded-xl object-cover" />
    ) : null}
  </article>
);

import clsx from 'clsx';

export const Card = ({ title, description, actions, children, className }) => (
  <section
    className={clsx(
      'flex w-full flex-col gap-4 rounded-3xl border border-white/10 bg-white/10 p-6 text-white shadow-lg shadow-black/30 backdrop-blur-md',
      className
    )}
  >
    {(title || description) && (
      <header className="flex flex-col gap-1">
        {title ? <h2 className="text-lg font-semibold text-white">{title}</h2> : null}
        {description ? <p className="text-sm text-white/80">{description}</p> : null}
      </header>
    )}
    <div className="flex flex-col gap-4">{children}</div>
    {actions ? <footer className="flex flex-wrap gap-2">{actions}</footer> : null}
  </section>
);

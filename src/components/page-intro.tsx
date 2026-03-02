type PageIntroProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <section className="site-container pt-14 pb-10">
      {eyebrow ? <p className="text-xs uppercase tracking-[0.2em] text-[var(--brand)]">{eyebrow}</p> : null}
      <h1 className="mt-3 max-w-3xl text-4xl leading-tight font-semibold">{title}</h1>
      <p className="mt-4 max-w-3xl text-lg text-[var(--muted)]">{description}</p>
    </section>
  );
}

type PageIntroProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <section className="site-container pb-10 pt-10">
      <div className="rounded-2xl border border-[var(--line)] bg-white p-6 md:p-8">
        {eyebrow ? <p className="text-xs uppercase tracking-[0.2em] text-[var(--brand)]">{eyebrow}</p> : null}
        <h1 className="mt-3 max-w-3xl text-4xl leading-tight font-semibold">{title}</h1>
        <p className="mt-4 max-w-3xl text-base text-[var(--muted)] md:text-lg">{description}</p>
      </div>
    </section>
  );
}

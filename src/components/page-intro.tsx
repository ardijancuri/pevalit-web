type PageIntroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  surface?: "muted" | "white";
};

export function PageIntro({ eyebrow, title, description, surface = "muted" }: PageIntroProps) {
  return (
    <section className={`section-block ${surface === "white" ? "bg-white" : "section-muted"}`}>
      <div className="site-container">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="mt-3 max-w-4xl text-3xl leading-tight font-semibold md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-base text-[var(--muted)] md:text-lg">{description}</p>
      </div>
    </section>
  );
}

interface HeroSectionProps {
  imageUrl: string;
  categoryName: string;
  categoryId: string;
}

export function HeroSection({
  imageUrl,
  categoryName,
  categoryId,
}: HeroSectionProps) {
  return (
    <section className="relative w-full bg-(--color-border)">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={categoryName}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-black/50 to-transparent p-8">
        <h2 className="text-4xl font-bold text-(--color-surface) mb-4">
          {categoryName}
        </h2>
        <a
          href={`/?category=${categoryId}`}
          className="inline-block bg-(--color-accent) text-(--color-surface) px-6 py-2 font-semibold hover:bg-red-700 transition-colors"
        >
          Shop Now
        </a>
      </div>
    </section>
  );
}

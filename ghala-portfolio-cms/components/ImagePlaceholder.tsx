export default function ImagePlaceholder({ hint, ratio = "4 / 5" }: { hint: string; ratio?: string }) {
  return (
    <div className="image-placeholder" style={{ aspectRatio: ratio }}>
      <div className="placeholder-plus">+</div>
      <strong>ADD YOUR IMAGE</strong>
      <span>{hint}</span>
    </div>
  );
}

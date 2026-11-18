"""Write icon-192.png and icon-512.png: a barbell on a dark rounded tile (Pillow)."""
from PIL import Image, ImageDraw

BG = (23, 27, 34)
ACCENT = (67, 207, 124)
STEEL = (150, 162, 180)


def build(size):
    s = 4  # supersample for smooth edges
    n = size * s
    img = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    r = int(n * 0.20)
    d.rounded_rectangle([0, 0, n - 1, n - 1], radius=r, fill=BG + (255,))

    cy = n / 2
    bar_h = n * 0.055
    d.rectangle([n * 0.13, cy - bar_h / 2, n * 0.87, cy + bar_h / 2], fill=STEEL + (255,))
    # plates: inner (big) and outer (smaller) on each side
    for lo, hi in ((0.245, 0.315), (0.685, 0.755)):
        d.rounded_rectangle([n * lo, cy - n * 0.155, n * hi, cy + n * 0.155],
                            radius=int(n * 0.018), fill=ACCENT + (255,))
    for lo, hi in ((0.145, 0.225), (0.775, 0.855)):
        d.rounded_rectangle([n * lo, cy - n * 0.115, n * hi, cy + n * 0.115],
                            radius=int(n * 0.014), fill=ACCENT + (230,))
    # collars
    for x in (0.325, 0.665):
        d.rectangle([n * x, cy - n * 0.085, n * (x + 0.012), cy + n * 0.085], fill=STEEL + (255,))
    # knurl marks on the bar
    for i in range(int(n * 0.40), int(n * 0.60), max(3, n // 60)):
        d.rectangle([i, cy - bar_h / 2, i + 1, cy + bar_h / 2], fill=BG + (255,))

    return img.resize((size, size), Image.LANCZOS)


for s in (192, 512):
    build(s).save(f"icon-{s}.png")
    print("wrote icon-%d.png" % s)

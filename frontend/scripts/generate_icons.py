"""Generate installable PNG icons using only Python's standard library."""
from pathlib import Path
import struct
import zlib

OUT = Path(__file__).resolve().parents[1] / 'public' / 'icons'

def chunk(kind, data):
    return struct.pack('!I', len(data)) + kind + data + struct.pack('!I', zlib.crc32(kind + data) & 0xffffffff)

def draw(size, maskable=False):
    rows = []
    center = size / 2
    for y in range(size):
        row = bytearray([0])
        for x in range(size):
            radius = ((x - center) ** 2 + (y - center) ** 2) ** .5
            rounded_corner = max(abs(x - center) - size * .29, 0) ** 2 + max(abs(y - center) - size * .29, 0) ** 2
            background = maskable or rounded_corner <= (size * .12) ** 2
            color = (0, 22, 69, 255) if background else (0, 0, 0, 0)
            if radius < size * (.31 if maskable else .35):
                color = (1, 114, 178, 255)
            if radius < size * (.20 if maskable else .23):
                color = (255, 255, 255, 255)
            if (abs(x - center) < size * .04 and abs(y - center) < size * .145) or (abs(x - center) < size * .145 and abs(y - center) < size * .04):
                color = (1, 114, 178, 255)
            row.extend(color)
        rows.append(row)
    payload = b''.join(rows)
    png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('!2I5B', size, size, 8, 6, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(payload, 9)) + chunk(b'IEND', b'')
    suffix = '-maskable' if maskable else ''
    (OUT / f'icon-{size}{suffix}.png').write_bytes(png)

for dimension in (192, 512):
    draw(dimension)
    draw(dimension, True)

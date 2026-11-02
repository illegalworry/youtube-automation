import json, sys, pathlib
d = json.loads((pathlib.Path(__file__).parent / 'shots.json').read_text())['shots']
a, b = int(sys.argv[1]), int(sys.argv[2]); k = float(sys.argv[3]) if len(sys.argv) > 3 else 0.45
print(','.join(f"{s['start'] + (s['end'] - s['start']) * k:.2f}" for s in d[a - 1:b]))

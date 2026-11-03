"""tools/pick_world.py — choose the game WORLD (style) from the video title / topic.

  python tools/pick_world.py --title "What If You Woke Up in Minecraft?"
  -> voxel   (prints the style id + why; exit code 0)

The plugin draws worlds in the GENRE look of a game (cube sandbox, block avatars, cartoon battle royale),
never its logos, named characters or exact skins. Add keywords for new games to WORLD_KEYWORDS.
"""
import argparse, re, sys

WORLD_KEYWORDS = {
    "voxel":  ["minecraft", "майнкрафт", "майн", "mc ", "creeper", "крипер", "nether", "незер", "ender", "эндер", "villager", "житель",
               "steve", "стив", "herobrine", "херобрин", "mining", "шахт", "voxel", "terraria", "cube world", "кубическ"],
    "royale": ["fortnite", "фортнайт", "battle royale", "батл рояль", "королевская битва", "pubg", "пабг", "apex", "free fire", "фри фаер",
               "warzone", "victory royale", "battle bus", "brawl", "бравл", "standoff", "стандофф"],
    "blocky": ["roblox", "роблокс", "obby", "обби", "bacon", "бекон", "noob", "нуб", "brookhaven", "брукхейвен", "adopt me", "doors", "blox",
               "piggy", "пигги", "tycoon", "тайкун", "lego", "лего"],
}
STYLE_FOR = {"voxel": "voxel", "royale": "royale", "blocky": "blocky"}


def pick(title: str):
    t = " " + title.lower() + " "
    scores = {w: sum(1 for k in kws if k in t) for w, kws in WORLD_KEYWORDS.items()}
    best = max(scores, key=scores.get)
    if scores[best] == 0:
        return "blocky", "no game named in the title -> default blocky avatar world (the competitor reference look)"
    hits = [k.strip() for k in WORLD_KEYWORDS[best] if k in t]
    return STYLE_FOR[best], f"title mentions {', '.join(hits)} -> {best} world"


if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("--title", required=True); a = ap.parse_args()
    sid, why = pick(a.title)
    print(sid); print(why, file=sys.stderr)

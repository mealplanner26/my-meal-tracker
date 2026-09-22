# Meal Rotation Planner — standalone website

This is the same meal and nutrition tracker, built to run as its own website instead of
inside claude.ai. It needs no Claude account, no sign-in, and no server: every file here
is static, and each person's data stays in their own browser.

## Why this exists

The version shared through a claude.ai link runs inside a sandboxed frame that Anthropic
uses for all published artifacts. Browser storage does not reliably work inside that frame,
so a shared claude.ai link can look fine in the moment and then lose everything the next
time someone opens it. This standalone build has no such sandbox: I tested it with a real
browser and confirmed saving, closing, and reopening all work normally. It also adds a
built-in check that warns a person immediately if their own browser's storage is somehow
not working, instead of failing silently.

What is different from the claude.ai version:
- No AI tab and no photo label reader — those need a live claude.ai connection. Labels are
  typed in on the Scan tab instead. The Sous Vide planner still works, since it needs no AI.
- No sync between a person's own devices. Each device holds its own data. Moving data
  between devices, or keeping a safety copy, is done with the "Download a backup" and
  "Restore from a backup" buttons under "Help and backup".
- The barcode list (`products.json`) is its own file, so it can be refreshed without
  touching the app itself.
- It can be installed to a phone's home screen and works offline after the first visit.

## Deploying it (you do this part; I cannot host anything myself)

Any static host that serves plain files over HTTPS will do. The simplest is GitHub Pages:

1. Create a GitHub repository (or use an existing one).
2. Upload every file in this folder (`index.html`, `products.json`, `manifest.webmanifest`,
   `sw.js`, `version.json`, and the icon files) to the repository, keeping them all in the
   same folder — do not put them in subfolders.
3. In the repository's Settings, open "Pages", and set it to serve from that branch and folder.
4. GitHub gives you a URL such as `https://yourname.github.io/your-repo/`. That is the link
   to share. It can take a few minutes to go live the first time.
5. Open the link yourself first, on both a computer and a phone, before sharing it further.

Netlify and Cloudflare Pages both also accept a folder of files dropped in directly, if you
would rather not use GitHub.

Do not let any AI website-builder "fix" or rewrite these files before deploying — this
copy has already been tested as it is, and rewriting it can silently reintroduce the very
problems it was built to avoid.

## Updating it later

When I give you a new version of the app:
1. Ask me for an updated `index.html` (and `products.json`, if the product list changed).
2. Also update `version.json` to a new version number — this is what makes the "a newer
   version is available" banner appear for people already using the site.
3. Upload the changed files to the same place. Nobody needs to do anything else; the site
   checks `version.json` for them and offers the update.

## Refreshing the product list only

The barcode list lives entirely in `products.json`. To rebuild it from a fresh USDA
FoodData Central download without touching the app itself, see `dev/tools/make_products.py`
in the developer bundle. Send me the new USDA zip file and I can run it for you and hand
back an updated `products.json` and `version.json`.

## If something breaks for someone

Ask them to open "Help and backup" (under the title) and tap "Copy support info", then send
you that text. It has their browser, screen, whether saving actually works, and version
and product-list numbers — never their meals, weights, or other personal details. Send it
to me and I will diagnose it from that.

## What I have not been able to test

I have tested this in a real desktop browser, including offline mode, installing, and a
simulated broken-storage browser. I have not been able to test it on an actual iPhone,
in Safari, or in any other real mobile browser. Please test it yourselves on real phones
before sharing it widely, especially the "add to home screen" and offline behavior.

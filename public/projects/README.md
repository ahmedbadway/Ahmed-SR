# Project cover screenshots

One cover per project, referenced by the `image` field in `src/data/projects.js`.

To add or replace a cover, drop a PNG/JPEG screenshot here named after the
project (for example `nefeera.png`, ideally a 1440x900 viewport captured at
1600px wide), then run:

```bash
npm run images:optimize
```

The script crops it to the 16:10 frame the Work grid uses (top-anchored),
converts it to WebP under 200KB, and writes an 800px `-800.webp` companion
that phones load through `srcset`.

| File               | Project                 | Live site |
| ------------------ | ----------------------- | --------- |
| `elo.webp`         | ELO Perfumes            | https://ahmedbadway.github.io/omar-berfun/ |
| `amr-ziada.webp`   | Amr Ziada Interiors     | https://ahmedbadway.github.io/amr-zida/ |
| `dr-galal.webp`    | Dr. Ahmed Galal Clinic  | https://ahmedbadway.github.io/dr-ahmed-gala/ |
| `moghazy.webp`     | DR. Moghazy             | https://ahmedbadway.github.io/DR-Moghzy-/ |
| `apothy.webp`      | Apothy Beauty           | https://ahmedbadway.github.io/Apothy-Beauty/ |
| `dasani.webp`      | Dasani                  | https://ahmedbadway.github.io/Dasani/ |
| `lufara.webp`      | Lufara                  | https://ahmedbadway.github.io/Lufara/ |
| `amr-samir.webp`   | Amr Samir               | https://ahmedbadway.github.io/AMR-SMAIER/ |
| `nefeera.webp`     | Nefeera                 | https://ahmedbadway.github.io/Nefeera/ |
| `hosni-arc.webp`   | Hosni Arc Studio        | https://www.hosniarcstudio.com/ |

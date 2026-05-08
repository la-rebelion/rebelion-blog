# Image Prompt: my-clawster-banner.png

**Article**: Managed Agents Need Infrastructure: Introducing My Clawster and Clawne Me  
**Size**: 1200 × 630 px  
**Style**: La Rebelion brand — dark tech/rebel aesthetic, neon yellow-green accents

---

## AI Image Generator Prompt

> Dark cyberpunk tech banner, 1200x630, black background (#060A06), split into two panels.
>
> LEFT PANEL: A hexagonal network cluster diagram. Central glowing hexagon with neon yellow-green (#C9FF00) border and soft glow, labeled "CLAWSTER". Six smaller dark hexagons surround it connected by dashed circuit-trace lines with small glowing dots at midpoints. Each outer hex labeled: K8S, VM, API, MCP, SKILL, AGENT. Subtle circuit board grid pattern in the background. Small text "LA REBELION LABS" top-left. "REBELS ONLY" badge bottom-right of panel.
>
> VERTICAL SEPARATOR: 4px neon yellow-green glowing line (#C9FF00) with bloom effect, separating the two panels.
>
> RIGHT PANEL: Bold typographic layout. Top: small uppercase label "MANAGED AGENT PLATFORM" in dim green. Center: two lines of very large bold condensed text "MANAGED" / "AGENT" in neon yellow-green (#C9FF00) with glow, ~128px Bebas Neue equivalent. A thin neon green horizontal rule below. Then "INFRASTRUCTURE" in large white text ~90px. Below: "MY CLAWSTER · CLAWNE ME" in medium green uppercase. A rectangular neon green outlined box containing "CONTROLLED INTELLIGENCE" in neon yellow-green text. At the bottom: tiny uppercase tags "govern · scale · secure · isolate · observe" in dark green.
>
> DECORATIONS: × marks in three corners (top-left, top-right, bottom-right) in dim green. Bottom-left coordinates "18.4861° N  69.9312° W" in very dark green. Top-right small red warning text "⚠ NO SHADOW AGENTS". Dot grid overlay across entire image, opacity 0.5. Dark green radial glow behind the hex cluster.
>
> Style: cyber-rebel, industrial, high-contrast, no gradients on text, no gradients on type. Think underground tech collective meets enterprise infrastructure diagram.

---

## Midjourney Prompt

```
dark tech cyberpunk blog banner 1200x630, split layout, left side hexagonal node cluster network diagram neon green glowing lines circuit board background, right side bold condensed white and neon yellow-green typographic layout "MANAGED AGENT INFRASTRUCTURE", industrial rebel aesthetic, black background, neon #C9FF00 accents, no people, flat design with glow effects, high contrast, clean --ar 19:10 --style raw --v 6
```

---

## DALL-E 3 Prompt

```
A wide-format (1200x630) dark tech banner image for a blog about AI agent infrastructure. The image is divided into two sections by a vertical neon yellow-green glowing line. 

Left section: A hexagonal network diagram on a very dark green-black background with circuit board patterns. A large central hexagon glows with neon yellow-green light, surrounded by six smaller dark hexagons connected by dashed glowing lines. The hexagons are labeled with tech terms. Small text reads "LA REBELION LABS" in the corner.

Right section: Bold typographic layout. Large neon yellow-green text reading "MANAGED AGENT" and below it in large white text "INFRASTRUCTURE". Under that: "MY CLAWSTER · CLAWNE ME" in medium green, a neon-bordered rectangle with "CONTROLLED INTELLIGENCE" inside, and tiny tag keywords at the bottom.

Style: Underground tech collective aesthetic, dark industrial, high contrast, neon accents on dark background.
```

---

## Design Specification (for human designer)

### Canvas
- Size: 1200 × 630 px (standard OG image / blog header)
- Background: `#060A06` to `#0A0A0A` radial gradient

### Left Panel (0–486px)
- Background: `rgba(7, 14, 7, 0.65)` over main bg
- Hex cluster centered at `(243, 315)`
- Central hex: r=88px, fill `#0F200F`, stroke `#C9FF00` 2.2px, glow filter
- 6 outer hexes: r=50px, fill `#0C160C`, stroke `#2E5E0E` 1.5px
- Node labels: `Space Grotesk 700`, 11–13px, `#5A9A22`
- Connections: dashed `#2C5C0C`, 1.5px, 5px dash / 4px gap
- Central label: `Bebas Neue`, 19px, `#C9FF00`, letter-spacing 5px
- Circuit pattern: 40×40px tile, `#162416` lines

### Separator (488–492px)
- 4px wide, `#C9FF00`
- `box-shadow: 0 0 18px 3px rgba(201,255,0,0.55)`

### Right Panel (508–1200px)
- Padding: 32px top/bottom, 36px sides
- Brand tag: 10px, `#3A6A10`, letter-spacing 5px
- Headline: `Bebas Neue` 128px, `#C9FF00`, line-height 0.87
  - `text-shadow: 0 0 18px rgba(201,255,0,0.45), 0 0 40px rgba(201,255,0,0.18)`
- Accent line: 3px, `#C9FF00` → transparent, `box-shadow: 0 0 10px rgba(201,255,0,0.55)`
- Sub-headline: `Bebas Neue` 90px, `#FFFFFF`
- Products: `Space Grotesk 600`, 17px, `#7AAF30`, letter-spacing 4px
- Controlled box: 2px solid `#C9FF00`, `box-shadow: 0 0 14px rgba(201,255,0,0.28)`
- Controlled text: `Bebas Neue` 31px, `#C9FF00`, letter-spacing 4px
- Tags: 10px, `#284820`, letter-spacing 5px

### Corner Decorations
- `×` glyphs: `Space Grotesk 900`, 20px, `#3A6A10`
- Coordinates: 8px, `#1C361C`, letter-spacing 3px, bottom-left
- Warning: 8px, `rgba(255,60,60,0.5)`, top-right
- Badge: 9px, `#2A4A10`, border `#1A3A10`, bottom of left panel

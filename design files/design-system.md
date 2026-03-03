This Design System documentation is reverse-engineered from the provided HTML and Tailwind CSS configuration for **CINE/PHILE**.

---

# Design System: CINE/PHILE Archive

## 1. Core Principles
The **CINE/PHILE** design system is built on a **Cinematic Brutalist** aesthetic. It blends the high-contrast atmosphere of classic Film Noir with modern digital "phosphor" interfaces.

*   **High Contrast:** Deep blacks paired with vibrant, high-visibility accents.
*   **Tactile Texture:** Use of "film grain" and motion to simulate analog media.
*   **Bold Typography:** Heavy use of geometric sans-serif type to command attention.
*   **Motion-Centric:** The interface is alive with constant, subtle movement (marquees, floating elements, and grain overlays).

## 2. Color Palette

The palette is limited and high-impact, utilizing a custom "Noir" base with functional cinematic accents.

| Name | Hex Code | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| **Noir** | `#050505` | `bg-noir` / `text-noir` | Primary background; deep black. |
| **Cinema Red** | `#E50914` | `text-cinema-red` | Primary brand color; alerts, highlights. |
| **Cinema Gold** | `#FFB800` | `text-cinema-gold` | Secondary brand color; premium/award status. |
| **Phosphor** | `#C1FF72` | `text-phosphor` | UI elements, digital readouts, "active" states. |
| **White** | `#FFFFFF` | `text-white` | Primary body text and high-contrast headers. |

## 3. Typography
The system relies exclusively on **Syne**, a geometric sans-serif that transitions from professional to avant-garde as its weight increases.

*   **Primary Font Family**: `Syne`, sans-serif.
*   **Headings**: Bold (700) or Extra Bold (800), often uppercase for a "poster" feel.
*   **Body Text**: Regular (400) to Medium (500).
*   **UI/Metadata**: Often rendered in `phosphor` or `cinema-gold` to mimic film credits or technical readouts.

## 4. Spacing & Layout
*   **Container**: Uses standard Tailwind responsive containers with a focus on full-bleed visual elements.
*   **Grid/Flex**: Heavy reliance on Flexbox for alignment and vertical/horizontal centering.
*   **Scrolling**: Smooth scrolling enabled (`scroll-smooth`) to maintain a premium feel.
*   **Layering**: Use of absolute positioning for "Grain" overlays and "Marquee" backgrounds to create depth.

## 5. Components & Patterns

### 5.1 Texture Overlay (Film Grain)
A signature component of this system is the grain overlay.
*   **Implementation**: An absolute-positioned div with the `.animate-grain` class.
*   **Effect**: Creates a flickering, analog film texture over the entire UI.

### 5.2 Dynamic Marquee
Used for lists of titles, archives, or scrolling credits.
*   **Implementation**: `.animate-marquee`.
*   **Behavior**: Continuous vertical or horizontal loop of text or images.

### 5.3 Floating Elements
Used for hero imagery or featured film stills to create a sense of "dreamlike" suspension.
*   **Implementation**: `.animate-float`.

## 6. Iconography
While specific icon libraries aren't fully rendered in the snippet, the naming convention (`phosphor`) suggests a preference for **Phosphor Icons** or similar thin-stroke, technical icons that match the "digital archive" aesthetic.

---

## Reference HTML

```html
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CINE/PHILE — Access the Archive</title>
    <!-- Google Fonts: Syne -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Alpine.js -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        syne: ['Syne', 'sans-serif'],
                    },
                    colors: {
                        'noir': '#050505',
                        'cinema-red': '#E50914',
                        'cinema-gold': '#FFB800',
                        'phosphor': '#C1FF72',
                    },
                    animation: {
                        'grain': 'grain 8s steps(10) infinite',
                        'marquee': 'marquee 25s linear infinite',
                        'float': 'float 6s ease-in-out infinite',
                    },
                    keyframes: {
                        grain: {
                            '0%, 100%': { transform: 'translate(0, 0)' },
                            '10%': { transform: 'translate(-5%, -10%)' },
                            '30%': { transform: 'translate(-15%, 5%)' },
                            '50%': { transform: 'translate(7%, 9%)' },
                            '70%': { transform: 'translate(-3%, 11%)' },
                            '90%': { transform: 'translate(12%, -7%)' },
                        },
                        marquee: {
                            '0%': { transform: 'translateY(0)' },
                            '100%': { transform: 'translateY(-50%)' },
                        },
                        float: {
                            '0%, 100%': { transform: 'translateY(0)' },
                        }
                    }
                }
            }
        }
    </script>
</head>
```
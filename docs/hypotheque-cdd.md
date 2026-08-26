# Hypothèque — CDD et critères d’acceptation

## Critères communs

- La page ne repose que sur des blocs EDS : `hero`, `cards`, `columns`, `header` et `footer`.
- Les liens, titres, textes et médias correspondent aux séquences éditoriales visibles de la page BNC source.
- Desktop (>= 1200 px) : contenu centré sur 1180 px, cartes dans leurs grilles respectives, hero à deux colonnes.
- Tablette (768–1199 px) : grilles adaptatives sans débordement.
- Mobile (< 768 px) : une colonne pour les contenus qui ne peuvent pas conserver une grille lisible; le hero ne dépend pas de l’illustration.
- Les liens et CTAs restent accessibles au clavier et les images ont un texte alternatif.

## Modèle auteur : Hero

| Hero |
|---|---|
| Texte promotionnel, titre, description, liens, mention légale | Illustration optionnelle |

L’illustration est facultative : l’offre reste compréhensible si elle manque. Le titre H1 et le lien d’action principal sont requis.

## Modèle auteur : Cards

| Cards (variant) |
|---|---|
| Image optionnelle | Titre, description et lien(s) |

Chaque rangée est un item. Les variantes `projects`, `rates`, `contact`, `benefits`, `calculators` et `links` sont seulement des présentations CSS d’un même modèle de collection. Les cellules restent limitées à deux par rangée.

## Preuve de test locale

- URL : `http://localhost:3000/particuliers/hypotheque`
- Référence source : `import-work/screenshot.png`
- Captures de validation : `import-work/validation/`

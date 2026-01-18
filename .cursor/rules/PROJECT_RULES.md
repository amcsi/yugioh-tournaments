# Project Rules

## Translation Requirements

**All user-facing text must be defined in `src/utils/translations.ts` and accessed through the translations object.**

### Rules:
1. **No inline translations**: Never use inline conditional translations like `language === "hu" ? "Hungarian text" : "English text"` in component code.
2. **Use translations object**: Always import and use the `translations` object from `src/utils/translations.ts`.
3. **Add new translations**: When adding new text, add it to the `Translations` interface and both language objects in `translations.ts`.
4. **Access pattern**: Use `const t = translations[language];` at the top of components, then reference `t.translationKey`.

### Exceptions:
- Date formatting using `toLocaleDateString()` with locale strings (e.g., "hu-HU", "en-US") is acceptable as these are locale identifiers, not user-facing text.
- Technical error messages from external APIs may remain untranslated if they're not user-facing.

### Example:
```typescript
// ❌ BAD - Inline translation
{language === "hu" ? "Szöveg" : "Text"}

// ✅ GOOD - Using translations
const t = translations[language];
{t.someText}
```

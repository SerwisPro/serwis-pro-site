# Serwis-Pro

Gotowa statyczna wersja strony `https://serwis-pro-poznan.pl/` przeznaczona do publikacji przez GitHub i Netlify.

## Publikacja

1. Utwórz puste repozytorium GitHub.
2. Prześlij do katalogu głównego repozytorium całą zawartość tego folderu.
3. W Netlify wybierz `Add new site` -> `Import an existing project` i połącz repozytorium.
4. Nie ustawiaj polecenia budowania. Katalog publikacji to `.`.
5. Po wdrożeniu dodaj domenę `serwis-pro-poznan.pl` w ustawieniach domen Netlify.

## Dane strukturalne

Dane JSON-LD są osadzone w sekcji `<head>` każdej strony. Strony poradnika zawierają dodatkowo typy `Article`, `FAQPage` i `BreadcrumbList`. Nie należy dodawać osobnego pliku JSON ani drugiej konkurencyjnej definicji firmy.

## Kontrola po publikacji

- sprawdź stronę główną oraz `/poradnik/`
- sprawdź `https://serwis-pro-poznan.pl/sitemap.xml`
- sprawdź `https://serwis-pro-poznan.pl/robots.txt`
- przetestuj wybraną stronę w Google Rich Results Test

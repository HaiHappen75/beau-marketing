# Deployment — Beau-Marketing (Coolify auf Hetzner + DNS bei Mittwald)

Die Website ist **Payload 3 + Next.js** in einem Container (Standalone). Datenbank: **Postgres**
(Coolify-Ressource). E-Mail bleibt **unangetastet bei Mittwald** — wir ändern nur A/AAAA-Records.

> Reihenfolge strikt einhalten. Schritte mit 🧑 erledigst du im Browser/Server, Schritte mit ✅ sind im Code bereits erledigt.

---

## 0. Voraussetzungen

- ✅ Dockerfile, `prodMigrations`, Standalone-Build — alles im Repo vorhanden und lokal verifiziert.
- 🧑 GitHub-Repo (du legst es an).
- 🧑 Coolify läuft auf dem Hetzner CPX32.
- 🧑 Domain `beau-marketing.de` mit DNS bei Mittwald.

---

## 1. 🧑 Code zu GitHub pushen

Lokal ist bereits ein Git-Repo mit erstem Commit vorhanden. Remote ergänzen und pushen:

```bash
git remote add origin git@github.com:<DEIN-USER>/beau-marketing.git
git branch -M main
git push -u origin main
```

---

## 2. 🧑 Swap auf dem Hetzner-Server anlegen (einmalig)

Der Build ist auf 4 GB Heap gedeckelt; Swap fängt Spitzen ab, damit nichts OOM-killt.

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
sudo sysctl vm.swappiness=10
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.d/99-swappiness.conf
```

---

## 3. 🧑 Projekt + Postgres in Coolify anlegen

Coolify-Struktur: **Projekt → Environment → Ressourcen**. Erst das Projekt, dann darin DB + App.

1. **+ New** → **Project** → benennen (z. B. „beau-marketing"). Es entsteht automatisch das
   Environment **„production"**. **DB und App kommen ins selbe Projekt/Environment** (gemeinsames
   internes Docker-Netz → App erreicht Postgres über den internen Hostnamen, kein öffentlicher Port).
2. Im Environment: **+ New** → **Database** → **PostgreSQL 16** → Credentials generieren, **Start**.
3. Den **internen Connection-String** notieren — Form:
   `postgres://<user>:<pass>@<service-name>:5432/<db>`
   (Service-Name = interner Hostname im selben Docker-Netz; **kein** öffentlicher Port nötig.)
4. Optional (empfohlen, 8 GB-Box) unter den Postgres-Settings tunen:
   `shared_buffers=1GB`, `effective_cache_size=3GB`, `work_mem=16MB`, `max_connections=50`.

---

## 4. 🧑 Anwendung in Coolify anlegen

1. **+ New** → **Application** → **Public/Private Repository** → das GitHub-Repo, Branch `main`.
2. **Build Pack: Dockerfile** (nicht Nixpacks).
3. **Port: 3000**.
4. Noch **nicht** deployen — erst die Env-Vars (Schritt 5).

---

## 5. 🧑 Environment-Variablen setzen

| Variable | Wert | Scope |
|---|---|---|
| `DATABASE_URI` | Connection-String aus Schritt 3 | Runtime |
| `PAYLOAD_SECRET` | langer Zufallswert: `openssl rand -base64 32` | Runtime |
| `NEXT_PUBLIC_SERVER_URL` | `https://beau-marketing.de` | **Build + Runtime** |
| `NODE_OPTIONS` | `--max-old-space-size=1024` | Runtime |
| `SMTP_HOST` | `mail.beau-marketing.de` (Mittwald) | Runtime |
| `SMTP_PORT` | `587` (STARTTLS; `465` = implizites TLS) | Runtime |
| `SMTP_USER` | Postfach-Login aus dem Mittwald mStudio | Runtime |
| `SMTP_PASSWORD` | Postfach-Passwort | Runtime |
| `SMTP_FROM_ADDRESS` | `noreply@beau-marketing.de` | Runtime |
| `SMTP_FROM_NAME` | `Beau-Marketing` | Runtime |
| `ERECHT24_API_KEY` | API-Key aus dem eRecht24 Project Manager | **Build + Runtime** |
| `ERECHT24_PUSH_SECRET` | Secret aus der Push-Client-Registrierung | Runtime |

> ⚖️ **Rechtstexte:** Impressum und Datenschutzerklärung kommen aus dem eRecht24 Project Manager,
> nicht mehr aus Payload. `ERECHT24_API_KEY` muss auch als **Build-Variable** gesetzt sein — der Build
> frischt die Snapshots unter `content/legal/` auf. Fehlt der Key, wird der committete Snapshot
> gebündelt und der Build läuft trotzdem durch. Keiner der beiden Werte wird selbst erzeugt: der
> API-Key stammt aus dem Project Manager, das Push-Secret vergibt eRecht24 bei der Registrierung des
> Push-Clients (`npx erecht24-register https://beau-marketing.de/api/erecht24/push`) und zeigt es
> **genau einmal** an.

> 📧 **SMTP ist optional, aber ohne geht „Passwort vergessen" nicht.** Ist `SMTP_HOST` leer,
> fällt Payload auf den `consoleEmailAdapter` zurück, der die Mail nur ins Log schreibt —
> der Reset-Token muss dann von Hand aus `users.reset_password_token` gelesen werden.
> Die Absenderadresse muss zu einem echten Mittwald-Postfach gehören, sonst greift SPF/DKIM nicht.

> ⚠️ `NEXT_PUBLIC_SERVER_URL` muss als **Build-Variable** markiert sein — der Wert wird beim
> Build in den Client-Bundle „eingebacken" (Media-/OG-/Canonical-URLs). In Coolify beim
> Anlegen der Variable „Build Variable / Available at buildtime" aktivieren. Der Dockerfile
> liest sie als `ARG NEXT_PUBLIC_SERVER_URL`.

---

## 6. 🧑 Persistentes Volume für Uploads

Damit hochgeladene Logos/Screenshots Re-Deploys überleben:

- Coolify → App → **Storages / Persistent Volume** → Mount-Pfad **`/app/media`**.

(Alternativ später Objektspeicher/S3 anbinden.)

---

## 7. 🧑 Erstes Deployment

1. **Deploy** klicken. Der Build läuft (Dockerfile, Standalone, 4 GB-Cap) und braucht **keine DB**.
2. Beim Start verbindet sich die App mit Postgres und führt **automatisch die Migrationen aus**
   (`prodMigrations` → legt alle Tabellen an). In den Logs erscheint der Migration-Lauf.
3. Health-Check: temporär über die Coolify-Preview-URL prüfen (vor DNS), ob `/` auf `/de` leitet.

### Admin & Inhalte
- `/admin` aufrufen → **ersten Admin-User** anlegen (E-Mail z. B. `s.beau@beau-marketing.de`).
- **Inhalte:** entweder im Backend pflegen, **oder** einmalig die 6 Marken + Globals seeden.
  Im App-Container (Coolify → App → Terminal) ist die Payload-CLI im Standalone-Image **nicht**
  enthalten — daher Inhalte am einfachsten **im Admin** anlegen. (Für einen automatisierten
  Seed bräuchte es einen separaten One-off-Job; sag Bescheid, wenn gewünscht.)

---

## 8. 🧑 DNS bei Mittwald umstellen (E-Mail bleibt!)

Im Mittwald DNS-Editor **nur** diese Records auf die Hetzner-IP setzen:

| Typ | Name | Wert |
|---|---|---|
| `A` | `@` | <Hetzner-IPv4> |
| `A` | `www` | <Hetzner-IPv4> |
| `AAAA` | `@` | <Hetzner-IPv6> (falls vorhanden) |
| `AAAA` | `www` | <Hetzner-IPv6> (falls vorhanden) |

> ⛔ **MX, SPF (TXT), DKIM, DMARC und autodiscover/autoconfig NICHT anfassen.** Die laufen
> weiter über Mittwald. Mischbetrieb von MX ist nicht erlaubt — wir ändern ausschließlich A/AAAA.
> Tipp: vorher die TTL senken und die aktuelle Zone als Screenshot sichern.

---

## 9. 🧑 Domain & SSL in Coolify

1. Coolify → App → **Domains**: `https://beau-marketing.de` (und `https://www.beau-marketing.de`).
2. Kanonisch = Root; `www` → Root als 301 (Coolify/Traefik-Redirect).
3. Sobald A/AAAA auflösen, stellt Traefik automatisch **Let's-Encrypt-Zertifikate** aus.
4. Falls `NEXT_PUBLIC_SERVER_URL` noch auf eine Preview-URL stand: auf `https://beau-marketing.de`
   setzen und **neu deployen** (Build-Variable → neuer Build nötig).

---

## 10. ✅ Post-Deploy-Checks

- `https://beau-marketing.de/` → 307 auf `/de`
- `/de`, `/en`, `/da` laden; Sprachumschalter & „Marken"-Menü funktionieren
- `/de/marken/tappi` lädt; `/de/impressum` zeigt den CMS-Text
- `/admin` per HTTPS erreichbar, Login funktioniert
- `/sitemap.xml` & `/robots.txt` erreichbar; hreflang-Tags im `<head>`
- **E-Mail-Test:** Mail an eine `@beau-marketing.de`-Adresse senden & empfangen ✔ (MX unverändert)

---

## Wartung

- **Schema-Änderungen:** lokal Feld/Collection ändern → `pnpm payload migrate:create <name>` →
  neue Migration committen → beim nächsten Deploy laufen sie automatisch (`prodMigrations`).
- **Inhalte** ändern sich sofort live (Frontend rendert dynamisch, kein Rebuild nötig).
- **Effra-Fonts:** sobald die Dateien da sind, in `public/fonts/` ablegen und in
  `src/app/(frontend)/[locale]/layout.tsx` von `next/font/google` (Platzhalter Bricolage Grotesque)
  auf `next/font/local` umstellen.

# CONTENT_TODO — facts to collect before launch

The website shows **only** verified facts about the Society. Anything missing is hidden on the public site and
appears as an empty field in the admin dashboard (`/admin`). This list is what K.E.S. staff need to supply or check.

> ⚠ **Marathi strings must be reviewed by K.E.S. staff before launch.**
> They live in `src/i18n/mr.ts` (navigation, headings, buttons, home-page hero and stats).

## Head office
- [ ] **Exact street address** of the Administrative Office & Training Center (Loknete Adv. Datta Patil Sankul).
      Only “Alibag, Raigad, Maharashtra 402 201” is known. → Admin → Settings → *Street address*.
- [ ] **Google Maps pin** — confirm the map search finds the Sankul; if not, put the exact address or a plus-code in
      Admin → Settings → *Google Maps search text*.
- [ ] Office hours (hidden until filled in).
- [ ] Public URL of this website → `SITE_URL` (used in `sitemap.xml`, `robots.txt`). Default: `https://www.kesalibag.edu.in`.

## Numbers
- [ ] Current counts of institutions, students and staff. The only figures found — **102 institutions, 51,253 students,
      2,029 staff** — come from a sister-college site and are about 10 years old. They are stored in Admin → Settings →
      *Extra numbers on the Home page*, **hidden by default**. Verify, update, then switch on.

## Institutions
- [ ] **Thane-district institutions** — the Society works in Thane district, but none are named on the old site.
- [ ] **College of Education** — mentioned by an older source, not named anywhere. Add it if it exists.
- [ ] The list has 68 institutions; the official claim is “100+”. Add the missing ones (Admin → Institutions).
- [ ] For every institution: **logo, principal, phone, email, year established**, and website if one exists.
- [ ] Website addresses of institutions that have their own site (e.g. Smt. J.R.H. Kanyashala) →
      Admin → Institutions → open the institution → *Website*. Its card then shows “Visit website”.

### Names to verify (kept exactly as given until confirmed)
- [ ] “**Genral** Arunkumar **Vaidy** **Vidyalay** & Industrial Junior College, Alibag” (General? Vaidya? Vidyalaya?)
- [ ] “**Anat** Narayan Kotibhaskar Prathamik Shala, Birwadi” (Anant?)
- [ ] “Sardar Raobahaddur Tendulkar Vidyalay & **Vishwnath** Mahadev Pilankar Junior College, Revdanda” (Vishwanath?)
- [ ] “Gangadhar Dattatrey Ambekar High School & Chandrakant Ganpat **Mehata** Junior College, Birwadi” (Mehta?)
- [ ] “**Datusheth** Patil Prathamik Shala, Panvel” vs “**Dagdusheth** Parte …, Mahad” — is “Datusheth” correct?

## Documents (Admin → Results & Publications)
Empty slots already exist for each year; open one and upload its PDF. Slots without a file are hidden.
- [ ] **SSC result** PDFs, 2020-21 … 2024-25
- [ ] **HSC result** PDFs, 2020-21 … 2024-25
- [ ] **Vikas Magazine** PDFs + cover images, 2020-21 … 2024-25 (a cover with the emblem and year is shown until a real cover is uploaded)
- [ ] **The Ceremony of Glory** (K.E.S. Inter-school Competition) files, 2014-15 … 2024-25
- [ ] **Application Form for Unaided Schools** — was a broken link on the old site; slot created, file missing.
- [x] SSC & HSC Result Blank Form — real PDF, published.

On Vercel each upload must be **under 4 MB** (compress large PDFs first).

## Photos
- [ ] Real event / campus photos for the **Gallery** (the old gallery had only template placeholders).
      Current gallery = 5 archive photos + the Sankul poster + emblem + flag.
- [ ] Dates / places for the 5 archive photographs (captions are descriptive only, no dates are claimed).
- [ ] Centenary (2017) photographs, if available.

## Social media
- [ ] Facebook / YouTube / Instagram / X links — none were found. Admin → Settings → *Social media* (hidden until filled in).

## Leaders & board
- [ ] Short factual lines for Hon. Sanjay Datta Patil and Hon. Adv. Siddharth Patil (currently only their board titles).

/** BKC journal posts. */

export interface BlogPost {
  slug: string
  title: string
  dek: string
  glyph: string
  bg: string
  cat: string
  date: string
  read: number
  body: string
}

export const POSTS: BlogPost[] = [
  {
    slug: 'oversized-took-over',
    title: 'How the oversized tee took over India',
    dek: 'Drop shoulders went from niche streetwear to the default cut in about three years. Here is what actually drove it.',
    glyph: '📦',
    bg: '#E7B325',
    cat: 'Trends',
    date: '2026-07-28',
    read: 6,
    body:
      '<p>Walk through any college gate in Delhi, Pune or Kochi and count the silhouettes. The boxy, drop-shouldered tee has quietly become the default — not the exception. That shift happened fast, and it was driven by four things that had nothing to do with fashion week.</p>' +
      '<h2>1. The cut forgives everything</h2>' +
      '<p>A regular-fit tee is a measurement problem. It has to fit your shoulders, your chest and your waist at the same time, and if any of the three is off, the shirt looks wrong. An oversized cut solves the problem by refusing to engage with it. The seam sits two to three inches below your actual shoulder, the body is boxy, and the whole thing reads as intentional on almost any frame.</p>' +
      '<p>For a direct-to-consumer brand shipping to 19,000 pin codes with no trial rooms, that is not a style choice. It is a returns-rate strategy.</p>' +
      '<h2>2. 240 GSM became affordable</h2>' +
      '<p>Heavyweight cotton used to be an import problem. Tirupur mills now run 240 GSM knits at volume, and the price gap between a flimsy 150 GSM tee and a structured 240 GSM one has narrowed enough that customers can feel the difference and still pay under a thousand rupees.</p>' +
      '<blockquote>220–240 GSM is the sweet spot: thick enough to hold the boxy silhouette, breathable enough to survive an Indian April.</blockquote>' +
      '<h2>3. The print area got bigger</h2>' +
      '<p>This is the part brands underplay. An oversized front panel gives you roughly 40% more usable print area than a regular fit in the same nominal size. Bigger typography, bolder art, better photos. Designs that die on a regular tee suddenly work.</p>' +
      '<h2>4. One size covers two people</h2>' +
      '<p>Gifting, sharing and couple-buying are enormous in Indian apparel. A cut that reads correctly on multiple body types converts better as a gift than anything sized precisely.</p>' +
      '<h3>Where it goes next</h3>' +
      '<p>Acid washes and pigment dyes are pulling ahead for the 2026 season, and powder blue and rose pink have overtaken the usual black-white-grey base in the youth segment. The silhouette is not going anywhere — the finishes are what will change.</p>',
  },
  {
    slug: 'gsm-explained',
    title: '180 vs 240 GSM: what that number actually means',
    dek: 'GSM is the single most useful spec on a t-shirt listing, and the single most often faked. A plain-English guide.',
    glyph: '⚖️',
    bg: '#AFCBE3',
    cat: 'Fabric',
    date: '2026-07-14',
    read: 5,
    body:
      '<p>GSM stands for grams per square metre. It measures how much cotton is in a fixed area of fabric. Higher GSM means denser, heavier, more opaque cloth. That is the whole concept — but the consequences are large.</p>' +
      '<h2>The practical ladder</h2>' +
      '<ul>' +
      '<li><b>140–160 GSM</b> — Very light. Cheap promotional tees and most kidswear. Prints show through slightly. Fine for children because it is soft and breathable; poor for adults who want the shirt to last two years.</li>' +
      '<li><b>180 GSM</b> — The everyday classic. Breathable through an Indian summer, holds shape after roughly 30 washes, drapes rather than stands. This is our regular fit.</li>' +
      '<li><b>200 GSM</b> — Slightly structured. Good for boxy crops where you want the hem to sit rather than cling.</li>' +
      '<li><b>240 GSM</b> — Heavyweight. The fabric holds the silhouette instead of following your body. Noticeably opaque, noticeably premium, noticeably warmer.</li>' +
      '</ul>' +
      '<h2>What GSM does not tell you</h2>' +
      '<p>A 240 GSM tee made from coarse open-end yarn can feel worse than a 180 GSM combed-cotton one. GSM is about weight, not quality of fibre. Look for the words <b>combed</b> and <b>bio-washed</b> next to the number. Combed cotton has the short fibres removed, which is why it pills less. Bio-washing uses enzymes to strip surface fuzz, which is why a good tee feels broken-in on day one.</p>' +
      '<h2>The honest trade-off</h2>' +
      '<p>Heavier is not automatically better. In Chennai in May, a 240 GSM oversized tee is a commitment. We sell both weights on purpose, and the fit filter on every page exists so you can choose by climate, not just by look.</p>',
  },
  {
    slug: 'protest-tee-without-a-side',
    title: 'How to design a protest tee without picking a side',
    dek: 'We print for polling day and for peaceful assembly. Here are the five rules we hold ourselves to.',
    glyph: '🗳️',
    bg: '#27356C',
    cat: 'Studio',
    date: '2026-06-30',
    read: 7,
    body:
      '<p>A civic tee is the hardest brief in our studio. Get it right and it says something worth saying. Get it wrong and you have accidentally printed campaign merchandise. These are the constraints we work inside.</p>' +
      '<h2>Rule 1 — Argue for the act, not the outcome</h2>' +
      '<p><i>Pehle Matdaan, Fir Jalpaan</i> — vote first, snacks after — takes no position on who you vote for. It only argues that you should turn up. That is a line we are comfortable printing at scale.</p>' +
      '<h2>Rule 2 — No party names, colours or symbols. Ever.</h2>' +
      '<p>This is absolute. It rules out certain colourways entirely during election season, and it means we reject a lot of submitted artwork. It also means a BKC tee is safe to wear inside a polling station, which matters more than the design.</p>' +
      '<h2>Rule 3 — Prefer the process to the grievance</h2>' +
      '<p><i>Sawaal Poochho</i> (ask questions), <i>RTI Filed</i>, <i>Samvidhan Reader</i>. Each of these celebrates a mechanism that exists for every citizen regardless of politics. Mechanisms age well. Grievances do not.</p>' +
      '<h2>Rule 4 — Name the method</h2>' +
      '<p><i>Shanti Se, Par Zaroor</i> — peacefully, but definitely. If we are printing anything about assembly, the tee itself should carry the standard we expect.</p>' +
      '<h2>Rule 5 — Keep the flag off the fabric</h2>' +
      '<p>India has specific rules and specific sensitivities about the national flag on clothing. We use tricolour-adjacent palettes for Republic Day and Independence Day and we never reproduce the flag as a print. It is a small restriction that removes an entire category of problem.</p>' +
      '<blockquote>If a design only works if you already agree with us, it is not a tee. It is a placard.</blockquote>',
  },
  {
    slug: 'festival-calendar',
    title: 'The Indian festival calendar we print against',
    dek: 'Twenty-three drops, planned backwards from ship dates. Why Diwali production starts in July.',
    glyph: '🪔',
    bg: '#FF7A18',
    cat: 'Operations',
    date: '2026-06-12',
    read: 6,
    body:
      '<p>Most of our year is decided by a calendar we did not write. Here is how the planning actually works.</p>' +
      '<h2>Backwards from the wear date</h2>' +
      '<p>A customer wants a Diwali tee <i>before</i> Diwali, which means it has to be discoverable four weeks earlier, in stock three weeks earlier, and printed six weeks earlier. Fabric is booked at the mill eight weeks out. So Diwali, a late-October or November festival, starts as a purchase order in July.</p>' +
      '<h2>The four tiers</h2>' +
      '<ul>' +
      '<li><b>Tier 1 — national, fixed date.</b> Republic Day, Independence Day, New Year. Easiest to plan; highest competition.</li>' +
      '<li><b>Tier 2 — national, lunar date.</b> Diwali, Holi, Eid, Raksha Bandhan, Janmashtami. Shifts every year, so the production calendar is rebuilt annually.</li>' +
      '<li><b>Tier 3 — regional.</b> Onam, Pongal, Bihu, Chhath, Durga Puja, Baisakhi, Gudi Padwa. Smaller volumes, far higher loyalty, almost no competition from national brands.</li>' +
      '<li><b>Tier 4 — civic and seasonal.</b> Polling days, board exam season, the monsoon, cricket season, shaadi season. These are the sleepers — the exam-season tee outsells three of our festival drops.</li>' +
      '</ul>' +
      '<h2>The regional bet</h2>' +
      '<p>Big platforms optimise for the largest addressable festival, which means Onam and Pongal get one generic banner and no dedicated product. That gap is the entire reason a small label can win a state for a fortnight.</p>',
  },
  {
    slug: 'why-we-print-cows',
    title: 'Cows, strays, and why our animal tees fund shelters',
    dek: 'The animal capsule is our best-selling category and our most-questioned one. An explanation.',
    glyph: '🐄',
    bg: '#A6E2C6',
    cat: 'Studio',
    date: '2026-05-22',
    read: 4,
    body:
      '<p><i>Gaay Nikli Hai</i> — the cow is out — began as a joke about Indian traffic. It is now one of the three best-selling designs we have ever printed, and it pulled an entire capsule behind it.</p>' +
      '<h2>The animals people actually want</h2>' +
      '<p>Not lions and eagles. Cows, street dogs, monkeys, crows, elephants, buffaloes. The animals you negotiate with on the way to work. Affection for them is close to universal here and almost entirely unserved by apparel brands, who default to generic Western wildlife.</p>' +
      '<h2>Insects were not a joke</h2>' +
      '<p>Bees, butterflies, ladybirds, fireflies — and the cockroach, which we print without apology. <i>Cockroach Survivor</i> outsells four of our festival tees. There is a real audience for creatures nobody else will put on cotton.</p>' +
      '<h2>The 2% commitment</h2>' +
      '<p>Two per cent of the sale price of every tee in the animal category funds street-shelter feeding drives. Not profit — sale price, which is the number that cannot be argued down by accounting. It is a small amount per shirt and a meaningful one at volume.</p>',
  },
  {
    slug: 'print-methods-compared',
    title: 'Screen print vs DTG vs DTF: an honest comparison',
    dek: 'Four printing methods, what each actually costs, and which one your order used.',
    glyph: '🖨️',
    bg: '#C6ACE4',
    cat: 'Production',
    date: '2026-05-02',
    read: 7,
    body:
      '<p>Every printed tee in India comes off one of four processes. Brands rarely tell you which, because the cheap one has a tell.</p>' +
      '<h2>Screen printing</h2>' +
      '<p>Ink pushed through a mesh stencil, one screen per colour. Unbeatable at volume — below ₹20 a piece at a thousand units — and the most durable finish available. The catch is setup: each colour needs its own screen, so a six-colour design is uneconomical under about 150 pieces. Best for: bulk orders, event merch, baraat squads.</p>' +
      '<h2>DTG (direct to garment)</h2>' +
      '<p>An inkjet printer for cotton. Water-based ink soaks into the fibre, so the print is soft to the touch with no plastic layer. Unlimited colours, no setup cost, viable at a single unit. Slower per piece and it needs a light or pre-treated garment to hit full opacity. This is what most of our catalogue uses.</p>' +
      '<h2>DTF (direct to film)</h2>' +
      '<p>Printed onto film, powdered with adhesive, heat-pressed on. Works on any fabric and any colour, brilliant opacity on dark garments. The trade-off is hand-feel: you can feel the print sitting on top of the shirt, and edges can crack after heavy washing.</p>' +
      '<h2>Sublimation</h2>' +
      '<p>Dye turns to gas and bonds with polyester. Zero hand-feel, permanent, infinite colour. Only works on polyester and only on white or very light garments — which rules it out for a cotton-first brand.</p>' +
      '<h2>The economics, per unit</h2>' +
      '<p>At the scale a new label operates, a 240 GSM blank runs roughly ₹240, printing ₹160, packaging and shipping ₹60, and marketing and overhead ₹40 — about ₹500 landed. Sell at ₹800 and the gross margin is around 37%; sell at ₹999 and it is closer to 50%. Discounting below ₹700 on that structure is not a promotion, it is a donation.</p>',
  },
  {
    slug: 'indian-sizing-truth',
    title: 'Indian sizing: why your L is someone else’s M',
    dek: 'There is no enforced national standard. Here is how to read any size chart in ninety seconds.',
    glyph: '📏',
    bg: '#F4795B',
    cat: 'Guides',
    date: '2026-04-18',
    read: 5,
    body:
      '<p>India has no mandatory garment sizing standard. Every brand publishes its own chart, and letters mean whatever the brand decides. The only reliable numbers are in centimetres.</p>' +
      '<h2>Measure the shirt, not yourself</h2>' +
      '<p>Take a t-shirt you already like. Lay it flat. Measure across the chest from armpit to armpit and double it — that is the garment chest. Measure from the highest point of the shoulder straight down to the hem — that is the length. Those two numbers will match you to any brand chart on earth.</p>' +
      '<h2>Oversized charts lie differently</h2>' +
      '<p>An oversized M is not a regular M with extra fabric. The shoulder seam is deliberately dropped, so the shoulder measurement will look absurd next to a regular chart. Compare oversized to oversized only.</p>' +
      '<h2>Our rule of thumb</h2>' +
      '<ul>' +
      '<li>Want the intended boxy look? Take your usual size in our oversized fit.</li>' +
      '<li>Want it genuinely huge? Go one up.</li>' +
      '<li>Buying our regular fit? True to size, and it will shrink under 2% because it is pre-shrunk.</li>' +
      '<li>Between two sizes on a kids tee? Always go up. They grow.</li>' +
      '</ul>',
  },
  {
    slug: 'what-the-big-players-taught-us',
    title: 'What Bewakoof, Beyoung and Myntra taught us about selling tees',
    dek: 'We took apart five storefronts before designing ours. The useful lessons and the ones we deliberately ignored.',
    glyph: '🔍',
    bg: '#B8B4AA',
    cat: 'Strategy',
    date: '2026-04-02',
    read: 8,
    body:
      '<p>Before writing a line of this site we went through Bewakoof, Beyoung, Myntra, AJIO and Amazon Fashion as customers. Here is what survived the audit.</p>' +
      '<h2>What we copied</h2>' +
      '<ul>' +
      '<li><b>Combos, from Beyoung.</b> Their homepage leads with bundles, not single products. Multi-buy is how a sub-₹1,000 category survives a ₹60–₹80 shipping cost. Average order value is the whole game.</li>' +
      '<li><b>Social proof above the fold, from Bewakoof.</b> They state customer and unit counts before showing a single product. On a category where trust is the barrier, that ordering is correct.</li>' +
      '<li><b>Filter depth, from Myntra.</b> Fit, colour, occasion, price, audience — all cross-filterable, all reflected in the URL so a filtered view can be shared. Most small D2C sites ship a category dropdown and stop.</li>' +
      '<li><b>Delivery clarity, from Amazon.</b> A date beats a promise. Pin-code-level expectations reduce pre-purchase support tickets more than any FAQ page.</li>' +
      '</ul>' +
      '<h2>What we ignored on purpose</h2>' +
      '<ul>' +
      '<li><b>Permanent 60% off.</b> A struck-through price that is never real trains customers to wait for a sale and quietly tells them what the product is actually worth.</li>' +
      '<li><b>Male-only merchandising.</b> Roughly 90% of one major competitor’s revenue comes from men. That is not a market truth, it is a merchandising decision. We built women’s, kids and pride ranges into the primary navigation rather than a sub-menu.</li>' +
      '<li><b>Licensed character IP.</b> It moves volume and it rents you someone else’s brand at a royalty. We would rather own a rude name outright.</li>' +
      '<li><b>Infinite SKU sprawl.</b> Marketplaces win on selection. A label wins on point of view. A hundred-odd designs you can defend beats ten thousand you cannot.</li>' +
      '</ul>' +
      '<h2>The gap we are aiming at</h2>' +
      '<p>Nobody is systematically serving the regional festival calendar, civic occasions, or the animal and insect audience with real design attention. Those are small markets individually. Stacked across a year, they are a business.</p>',
  },
  {
    slug: 'allah-ki-gaay-the-idiom',
    title: 'Allah Ki Gaay: the idiom for a bhola-bhala soul',
    dek: 'Hinglish for the most harmless person in the room — soft-hearted, will not hurt a fly. Why we printed an idiom about temperament, not a jab.',
    glyph: '🐄',
    bg: '#F1EADB',
    cat: 'Humour',
    date: '2026-08-11',
    read: 4,
    body:
      '<p><i>Allah ki gaay</i> is the kind of line that lands differently depending on who says it and how. In everyday Hinglish it is not theology and it is not a dig at any community. It is shorthand for a person so gentle they barely cast a shadow — bhola-bhala, soft-hearted, the one who will not hurt a fly.</p>' +
      '<h2>Temperament, not target</h2>' +
      '<p>Indian languages are full of animal idioms that describe mood more than species. A buffalo for stubborn calm. A crow for shameless confidence. A cow, in this register, for innocence that borders on comic. When someone calls you <i>allah ki gaay</i>, they are usually teasing your inability to be mean — not drafting a manifesto.</p>' +
      '<h2>Why print it</h2>' +
      '<p>Our animal capsule already carries traffic jokes, shelter fundraisers and street-dog solidarity. This one sits next to <i>Gaay Nikli Hai</i> as the quieter cousin: less about the road, more about the person wearing it. The Devanagari print — अल्लाह की गाय — keeps the idiom in the script people actually use when they say it at home.</p>' +
      '<h2>How we framed the drop</h2>' +
      '<p>Badge: IDIOM. Categories: humour and animals. Fit: oversized, off-white, Rozha One. The product copy is explicit on purpose: an idiom about temperament, not a jab at anyone. If a line needs a paragraph of defence to stay kind, we do not print it. This one did not.</p>' +
      '<blockquote>Wear it if you are the friend who always apologises first. Or if you are buying for that friend, which is most of you.</blockquote>',
  },
  {
    slug: 'how-to-choose-your-bkc-tee',
    title: 'How to choose your BKC tee (4 questions)',
    dek: 'Fit, tongue, occasion, loudness — a short chooser so you do not scroll 180 designs into analysis paralysis.',
    glyph: '🧭',
    bg: '#FFB703',
    cat: 'Chooser',
    date: '2026-08-11',
    read: 5,
    body:
      '<p>Too many tees is a good problem until it is not. Use these four questions.</p>' +
      '<h2>1. What cut do you actually wear?</h2>' +
      '<p>Oversized 240 GSM if you want silhouette and print area. Regular 180 GSM for Indian summer and daily wash cycles. Crop if the hem is the point. Kids if the neck tape must not itch.</p>' +
      '<h2>2. Where do you speak?</h2>' +
      '<p>Open <b>States</b>. If you are from Kumaon, filter Kumaon — not “Hindi humour.” Day-to-day language lands harder than pan-India catchphrases when the auntie at the wedding recognises it.</p>' +
      '<h2>3. Is this for a date on the calendar?</h2>' +
      '<p>Festivals, polling day, shaadi season, monsoon — check Occasions. Civic tees stay non-partisan on purpose.</p>' +
      '<h2>4. How soft should the joke be?</h2>' +
      '<p>Our brand word is printed as <b>Ch**tiya</b> or the Hinglish lockup <b>चूtiya</b>. If you want zero edge, pick food, animals, or typography. If you want local heat, pick your region.</p>',
  },
  {
    slug: 'soft-censor-chootiya',
    title: 'Why we write Ch**tiya (and चूtiya)',
    dek: 'It started as a gaali. India already softened it into “yaar, you idiot.” Our job is to make that habit visible — and cute.',
    glyph: '✨',
    bg: '#E01B24',
    cat: 'Brand',
    date: '2026-08-11',
    read: 4,
    body:
      '<p>In today’s India, calling someone a chootiya in a group chat is closer to affectionate roasting than to a weapon. Still: on a storefront, on a billboard, on a school WhatsApp forward, the full spelling can make people flinch before they smile.</p>' +
      '<h2>Soft censor is the bridge</h2>' +
      '<p>We print <b>Ch**tiya</b> on product titles and most hero surfaces. Same sound. Less shock. The brain fills the gap — which is exactly how language change works.</p>' +
      '<h2>Hinglish lockup: चू + tiya</h2>' +
      '<p>Devanagari <b>चू</b> plus Latin <b>tiya</b>. It reads as a designed word, not a shouted gaali. Parents photograph it. Cousins get it. The logo does the rebranding without a lecture.</p>' +
      '<h2>The motto</h2>' +
      '<blockquote>From gaali to habit — the affectionate idiot.</blockquote>' +
      '<p>We are not erasing the word. We are moving it into the register India already uses: idiot energy, not hate.</p>',
  },
  {
    slug: 'india-slang-atlas',
    title: 'The India slang atlas: state → region → day-to-day',
    dek: 'Why “Shop by where you speak” is the gap Bewakoof, Beyoung and city-only slang brands leave open.',
    glyph: '🗺️',
    bg: '#0FA678',
    cat: 'Chooser',
    date: '2026-08-11',
    read: 6,
    body:
      '<p>Puneri Paati owns Pune Marathi. Hyderabadi slang labels own Deccani. Tamil meme shops own Tamil. National D2C owns English + Hindi punchlines. The missing product is a <b>single cart</b> that respects how India actually talks — state by state, region by region.</p>' +
      '<h2>Uttarakhand is the proof</h2>' +
      '<p>Kumaon and Garhwal are not the same tongue. <i>चाल जालुं</i> is Kumaoni. <i>सिवासौँळी</i> is Garhwali. A “Pahadi tee” that ignores that is tourist merch. We filter both.</p>' +
      '<h2>Day-to-day beats festival-only</h2>' +
      '<p>Festival drops sell. Greeting lines, check-ins, and “let’s go” phrases sell every week — because people say them every week.</p>' +
      '<h2>How to use the atlas</h2>' +
      '<ol><li>Open States.</li><li>Pick your state.</li><li>Pick your region / language.</li><li>Add to bag next to a pan-India classic if you want.</li></ol>',
  },
  {
    slug: 'oversized-or-regular-chooser',
    title: 'Oversized or regular: the 60-second chooser',
    dek: 'Climate, photo, gift, and wash-cycle — pick a silhouette without a size chart spiral.',
    glyph: '👕',
    bg: '#AFCBE3',
    cat: 'Chooser',
    date: '2026-08-10',
    read: 3,
    body:
      '<p><b>Pick oversized</b> if you want drop shoulders, bigger print, cooler photos, or gifting across body types.</p>' +
      '<p><b>Pick regular</b> if you live in a hot city, wash weekly, or want a classic that layers under a shirt.</p>' +
      '<p><b>Pick crop</b> if the hem is the silhouette.</p>' +
      '<p><b>Pick kids</b> for soft 160 GSM and no-scratch neck tape.</p>' +
      '<blockquote>When unsure: oversized in chalk white. It forgives everything except bad jokes — and we already filtered those.</blockquote>',
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug)
}

/** Alias matching archive BKC.postBySlug */
export const postBySlug = getPostBySlug

export function formatPostDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z')
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

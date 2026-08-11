/* ==========================================================================
   BKC — Journal posts. Consumed by index.html (teaser), blog.html and post.html.
   Exposes BKC.posts (array), BKC.postBySlug(), BKC.postCard().
   ========================================================================== */

window.BKC = window.BKC || {};

(function (BKC) {
  'use strict';

  var POSTS = [
    {
      slug: 'oversized-took-over',
      title: 'How the oversized tee took over India',
      dek: 'Drop shoulders went from niche streetwear to the default cut in about three years. Here is what actually drove it.',
      glyph: '📦', bg: '#E7B325', cat: 'Trends', date: '2026-07-28', read: 6,
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
        '<p>Acid washes and pigment dyes are pulling ahead for the 2026 season, and powder blue and rose pink have overtaken the usual black-white-grey base in the youth segment. The silhouette is not going anywhere — the finishes are what will change.</p>'
    },
    {
      slug: 'gsm-explained',
      title: '180 vs 240 GSM: what that number actually means',
      dek: 'GSM is the single most useful spec on a t-shirt listing, and the single most often faked. A plain-English guide.',
      glyph: '⚖️', bg: '#AFCBE3', cat: 'Fabric', date: '2026-07-14', read: 5,
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
        '<p>Heavier is not automatically better. In Chennai in May, a 240 GSM oversized tee is a commitment. We sell both weights on purpose, and the fit filter on every page exists so you can choose by climate, not just by look.</p>'
    },
    {
      slug: 'protest-tee-without-a-side',
      title: 'How to design a protest tee without picking a side',
      dek: 'We print for polling day and for peaceful assembly. Here are the five rules we hold ourselves to.',
      glyph: '🗳️', bg: '#27356C', cat: 'Studio', date: '2026-06-30', read: 7,
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
        '<blockquote>If a design only works if you already agree with us, it is not a tee. It is a placard.</blockquote>'
    },
    {
      slug: 'festival-calendar',
      title: 'The Indian festival calendar we print against',
      dek: 'Twenty-three drops, planned backwards from ship dates. Why Diwali production starts in July.',
      glyph: '🪔', bg: '#FF7A18', cat: 'Operations', date: '2026-06-12', read: 6,
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
        '<p>Big platforms optimise for the largest addressable festival, which means Onam and Pongal get one generic banner and no dedicated product. That gap is the entire reason a small label can win a state for a fortnight.</p>'
    },
    {
      slug: 'why-we-print-cows',
      title: 'Cows, strays, and why our animal tees fund shelters',
      dek: 'The animal capsule is our best-selling category and our most-questioned one. An explanation.',
      glyph: '🐄', bg: '#A6E2C6', cat: 'Studio', date: '2026-05-22', read: 4,
      body:
        '<p><i>Gaay Nikli Hai</i> — the cow is out — began as a joke about Indian traffic. It is now one of the three best-selling designs we have ever printed, and it pulled an entire capsule behind it.</p>' +
        '<h2>The animals people actually want</h2>' +
        '<p>Not lions and eagles. Cows, street dogs, monkeys, crows, elephants, buffaloes. The animals you negotiate with on the way to work. Affection for them is close to universal here and almost entirely unserved by apparel brands, who default to generic Western wildlife.</p>' +
        '<h2>Insects were not a joke</h2>' +
        '<p>Bees, butterflies, ladybirds, fireflies — and the cockroach, which we print without apology. <i>Cockroach Survivor</i> outsells four of our festival tees. There is a real audience for creatures nobody else will put on cotton.</p>' +
        '<h2>The 2% commitment</h2>' +
        '<p>Two per cent of the sale price of every tee in the animal category funds street-shelter feeding drives. Not profit — sale price, which is the number that cannot be argued down by accounting. It is a small amount per shirt and a meaningful one at volume.</p>'
    },
    {
      slug: 'print-methods-compared',
      title: 'Screen print vs DTG vs DTF: an honest comparison',
      dek: 'Four printing methods, what each actually costs, and which one your order used.',
      glyph: '🖨️', bg: '#C6ACE4', cat: 'Production', date: '2026-05-02', read: 7,
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
        '<p>At the scale a new label operates, a 240 GSM blank runs roughly ₹240, printing ₹160, packaging and shipping ₹60, and marketing and overhead ₹40 — about ₹500 landed. Sell at ₹800 and the gross margin is around 37%; sell at ₹999 and it is closer to 50%. Discounting below ₹700 on that structure is not a promotion, it is a donation.</p>'
    },
    {
      slug: 'indian-sizing-truth',
      title: 'Indian sizing: why your L is someone else’s M',
      dek: 'There is no enforced national standard. Here is how to read any size chart in ninety seconds.',
      glyph: '📏', bg: '#F4795B', cat: 'Guides', date: '2026-04-18', read: 5,
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
        '</ul>'
    },
    {
      slug: 'what-the-big-players-taught-us',
      title: 'What Bewakoof, Beyoung and Myntra taught us about selling tees',
      dek: 'We took apart five storefronts before designing ours. The useful lessons and the ones we deliberately ignored.',
      glyph: '🔍', bg: '#B8B4AA', cat: 'Strategy', date: '2026-04-02', read: 8,
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
        '<p>Nobody is systematically serving the regional festival calendar, civic occasions, or the animal and insect audience with real design attention. Those are small markets individually. Stacked across a year, they are a business.</p>'
    }
  ];

  BKC.posts = POSTS;

  BKC.postBySlug = function (slug) {
    for (var i = 0; i < POSTS.length; i++) if (POSTS[i].slug === slug) return POSTS[i];
    return null;
  };

  BKC.formatDate = function (iso) {
    var d = new Date(iso + 'T00:00:00Z');
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  };

  BKC.postCard = function (p) {
    return '<article class="post-card" data-reveal data-stagger>' +
      '<div class="post-cover" style="background:' + p.bg + '">' + p.glyph + '</div>' +
      '<div class="body">' +
        '<span class="stamp stamp-marigold" style="align-self:flex-start">' + p.cat + '</span>' +
        '<h3>' + p.title + '</h3>' +
        '<p>' + p.dek + '</p>' +
        '<div class="post-meta"><span>' + BKC.formatDate(p.date) + '</span><span>' + p.read + ' min read</span></div>' +
      '</div>' +
      '<a class="card-link" href="post.html?slug=' + p.slug + '" aria-label="' + p.title + '"></a>' +
    '</article>';
  };
})(window.BKC);

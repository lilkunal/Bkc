/* ==========================================================================
   BKC — Application shell.
   Injects header/footer, runs animations, owns the cart, and drives the
   home hero, shop grid and product page. Page controllers self-activate by
   looking for their DOM hooks, so every page loads this one file.
   ========================================================================== */

window.BKC = window.BKC || {};

(function (BKC, doc) {
  'use strict';

  var H = BKC.helpers;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };

  /* ======================================================================
     1. Brand mark
     ====================================================================== */
  BKC.logoSVG = function (variant) {
    var v = variant || 'badge';
    if (v === 'wordmark') {
      return '<svg viewBox="0 0 300 90" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="BKC wordmark">' +
        '<text x="0" y="62" font-family="Anton, Impact, sans-serif" font-size="72" fill="#0E0E0C">BKC</text>' +
        '<rect x="150" y="18" width="146" height="12" fill="#E01B24"/>' +
        '<text x="150" y="56" font-family="\'Space Mono\', monospace" font-size="13" letter-spacing="2.4" fill="#0E0E0C">BHARAT KA</text>' +
        '<text x="150" y="76" font-family="\'Space Mono\', monospace" font-size="13" letter-spacing="2.4" fill="#0E0E0C">CHOOTIYA</text>' +
        '</svg>';
    }
    if (v === 'stamp') {
      return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="BKC stamp">' +
        '<circle cx="60" cy="60" r="56" fill="none" stroke="#0E0E0C" stroke-width="4"/>' +
        '<circle cx="60" cy="60" r="46" fill="none" stroke="#0E0E0C" stroke-width="2" stroke-dasharray="5 4"/>' +
        '<text x="60" y="72" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="36" fill="#0E0E0C">BKC</text>' +
        '<text x="60" y="90" text-anchor="middle" font-family="\'Space Mono\', monospace" font-size="8" letter-spacing="1.6" fill="#0E0E0C">EST. 2026 · INDIA</text>' +
        '</svg>';
    }
    /* Default: the tee-badge lockup used in the header. */
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="BKC logo">' +
      '<rect x="3" y="3" width="94" height="94" fill="#FFB703" stroke="#0E0E0C" stroke-width="5"/>' +
      '<path d="M30 26 L38 22 C41 28 59 28 62 22 L70 26 L84 36 L78 50 L71 46 L71 82 L29 82 L29 46 L22 50 L16 36 Z" fill="#FFFDF8" stroke="#0E0E0C" stroke-width="4" stroke-linejoin="round"/>' +
      '<text x="50" y="66" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="26" fill="#0E0E0C">BKC</text>' +
      '</svg>';
  };

  /* ======================================================================
     2. Header + footer injection
     ====================================================================== */
  var NAV = [
    { href: 'shop.html', label: 'Shop All' },
    { href: 'collections.html', label: 'Collections' },
    { href: 'occasions.html', label: 'Occasions' },
    { href: 'shop.html?fit=oversized', label: 'Oversized' },
    { href: 'shop.html?cat=kids', label: 'Kids' },
    { href: 'shop.html?cat=pride', label: 'Pride' },
    { href: 'blog.html', label: 'Journal' },
    { href: 'market.html', label: 'Market' },
    { href: 'about.html', label: 'About' }
  ];

  var TICKER = [
    'FREE SHIPPING OVER ₹999',
    '240 GSM OVERSIZED — NOW IN 20 COLOURS',
    'COD AVAILABLE IN 19,000+ PIN CODES',
    '7-DAY EASY RETURNS',
    '2% OF EVERY ANIMAL TEE GOES TO SHELTERS',
    'PRINTED IN TIRUPUR · SHIPPED FROM NOIDA'
  ];

  function buildHeader() {
    var mount = $('[data-shell="header"]');
    if (!mount) return;
    var here = (location.pathname.split('/').pop() || 'index.html');

    var tickerItems = TICKER.concat(TICKER).map(function (t) {
      return '<div class="ticker-item">' + t + '</div>';
    }).join('');

    var links = NAV.map(function (n) {
      var file = n.href.split('?')[0];
      var active = (file === here && n.href.indexOf('?') === -1) ? ' is-active' : '';
      return '<a class="nav-link' + active + '" href="' + n.href + '">' + n.label + '</a>';
    }).join('');

    mount.innerHTML =
      '<div class="ticker"><div class="ticker-track">' + tickerItems + '</div></div>' +
      '<header class="site-header">' +
        '<div class="header-inner">' +
          '<a class="brand" href="index.html" aria-label="BKC home">' +
            '<span class="brand-mark">' + BKC.logoSVG('badge') + '</span>' +
            '<span class="brand-word"><b>BKC</b><small>Bharat Ka Chootiya</small></span>' +
          '</a>' +
          '<nav class="nav" id="nav" aria-label="Main">' + links + '</nav>' +
          '<div class="header-actions">' +
            '<a class="icon-btn" href="shop.html" aria-label="Search the catalogue">🔍</a>' +
            '<button class="icon-btn" data-cart-open aria-label="Open cart">🛒' +
              '<span class="cart-count" data-cart-count>0</span>' +
            '</button>' +
            '<button class="icon-btn menu-toggle" data-menu aria-label="Menu" aria-expanded="false">☰</button>' +
          '</div>' +
        '</div>' +
      '</header>';

    var nav = $('#nav');
    var toggle = $('[data-menu]');
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? '✕' : '☰';
    });

    /* Hide-on-scroll-down header. */
    var last = 0, header = $('.site-header');
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      header.classList.toggle('is-stuck', y > 8);
      if (y > last && y > 260 && !nav.classList.contains('is-open')) header.classList.add('is-hidden');
      else header.classList.remove('is-hidden');
      last = y;
    }, { passive: true });
  }

  function buildFooter() {
    var mount = $('[data-shell="footer"]');
    if (!mount) return;
    var catLinks = BKC.categories.slice(0, 8).map(function (c) {
      return '<li><a href="shop.html?cat=' + c.key + '">' + c.label + '</a></li>';
    }).join('');

    mount.innerHTML =
      '<footer class="site-footer">' +
        '<div class="footer-mega marquee-scroll">BHARAT KA CHOOTIYA · BHARAT KA CHOOTIYA ·</div>' +
        '<div class="wrap">' +
          '<div class="footer-cols">' +
            '<div>' +
              '<div style="width:74px;margin-bottom:1rem">' + BKC.logoSVG('badge') + '</div>' +
              '<p style="font-size:.9rem;color:rgba(244,239,228,.8);max-width:34ch">' +
                'A printed-tee label for people who find the country exhausting and lovable in the same sentence. ' +
                '240 GSM oversized, 180 GSM classics, and one very honest brand name.</p>' +
              '<form class="newsletter" data-newsletter>' +
                '<input type="email" id="nl-email" name="email" autocomplete="email" required ' +
                  'placeholder="your@email.com" aria-label="Email address">' +
                '<button type="submit">Join</button>' +
              '</form>' +
            '</div>' +
            '<div><h4>Shop</h4><ul>' + catLinks + '</ul></div>' +
            '<div><h4>Explore</h4><ul>' +
              '<li><a href="collections.html">All collections</a></li>' +
              '<li><a href="occasions.html">Occasion calendar</a></li>' +
              '<li><a href="shop.html?fit=oversized">Oversized fits</a></li>' +
              '<li><a href="shop.html?fit=regular">Classic fits</a></li>' +
              '<li><a href="blog.html">The Journal</a></li>' +
              '<li><a href="market.html">Market analysis</a></li>' +
              '<li><a href="about.html">About BKC</a></li>' +
            '</ul></div>' +
            '<div><h4>Help</h4><ul>' +
              '<li><a href="about.html#sizing">Size guide</a></li>' +
              '<li><a href="about.html#care">Care &amp; washing</a></li>' +
              '<li><a href="about.html#shipping">Shipping &amp; returns</a></li>' +
              '<li><a href="about.html#bulk">Bulk &amp; custom orders</a></li>' +
              '<li><a href="about.html#contact">Contact</a></li>' +
            '</ul></div>' +
          '</div>' +
          '<div class="footer-bottom">' +
            '<span>© 2026 BKC — Bharat Ka Chootiya. A demo storefront.</span>' +
            '<span>Made in India · Printed in Tirupur · Not affiliated with any political party</span>' +
          '</div>' +
        '</div>' +
      '</footer>';

    var nl = $('[data-newsletter]');
    if (nl) nl.addEventListener('submit', function (e) {
      e.preventDefault();
      toast('Subscribed. Check your inbox.');
      nl.reset();
    });
  }

  /* ======================================================================
     3. Cart
     ====================================================================== */
  var CART_KEY = 'bkc_cart_v1';

  function readCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch (e) { return []; }
  }
  function writeCart(items) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) { /* private mode */ }
    paintCart();
  }

  BKC.cart = {
    items: readCart,
    add: function (id, size, qty, variant) {
      var items = readCart();
      var key = id + '|' + size + '|' + (variant || '');
      var found = null;
      for (var i = 0; i < items.length; i++) if (items[i].key === key) found = items[i];
      if (found) found.qty += (qty || 1);
      else items.push({
        key: key, id: id, size: size, variant: variant || '',
        qty: qty || 1, addedAt: new Date().toISOString()
      });
      writeCart(items);
    },
    setQty: function (key, qty) {
      var items = readCart().map(function (it) {
        if (it.key === key) it.qty = Math.max(0, qty);
        return it;
      }).filter(function (it) { return it.qty > 0; });
      writeCart(items);
    },
    remove: function (key) { BKC.cart.setQty(key, 0); },
    count: function () {
      return readCart().reduce(function (n, it) { return n + it.qty; }, 0);
    },
    total: function () {
      return readCart().reduce(function (n, it) {
        var p = H.byId(it.id);
        return n + (p ? p.price * it.qty : 0);
      }, 0);
    }
  };

  function buildDrawer() {
    if ($('[data-drawer]')) return;
    var el = doc.createElement('div');
    el.innerHTML =
      '<div class="drawer-scrim" data-scrim></div>' +
      '<aside class="drawer" data-drawer role="dialog" aria-label="Shopping bag" aria-modal="true">' +
        '<div class="drawer-head">' +
          '<h3 class="alt" style="font-size:1.3rem">Your Bag</h3>' +
          '<button class="icon-btn" data-cart-close aria-label="Close bag">✕</button>' +
        '</div>' +
        '<div class="drawer-body" data-cart-body></div>' +
        '<div class="drawer-foot">' +
          '<div class="row-between" style="margin-bottom:.8rem">' +
            '<span class="alt">Subtotal</span>' +
            '<b class="display" style="font-size:1.5rem" data-cart-total>₹0</b>' +
          '</div>' +
          '<button class="btn btn-accent btn-block" data-checkout><span>Checkout</span></button>' +
          '<p class="mono" style="margin:.7rem 0 0;text-align:center;color:var(--ink-45)">Demo store — no payment is taken.</p>' +
        '</div>' +
      '</aside>' +
      '<div class="toast-stack" data-toasts></div>';
    doc.body.appendChild(el);

    $('[data-scrim]').addEventListener('click', closeCart);
    $('[data-cart-close]').addEventListener('click', closeCart);
    $('[data-checkout]').addEventListener('click', function () {
      if (!BKC.cart.count()) return toast('Bag is empty');
      toast('This is a demo — no payment taken');
    });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeCart(); });
  }

  function openCart() {
    $('[data-drawer]').classList.add('is-open');
    $('[data-scrim]').classList.add('is-open');
  }
  function closeCart() {
    var d = $('[data-drawer]'); if (!d) return;
    d.classList.remove('is-open');
    $('[data-scrim]').classList.remove('is-open');
  }

  function paintCart() {
    var badge = $('[data-cart-count]');
    var n = BKC.cart.count();
    if (badge) {
      badge.textContent = n;
      badge.classList.toggle('is-on', n > 0);
    }
    var body = $('[data-cart-body]');
    if (!body) return;
    var items = BKC.cart.items();
    if (!items.length) {
      body.innerHTML = '<div class="empty-state"><p class="alt" style="font-size:1.2rem">Bag khaali hai</p>' +
        '<p class="muted" style="font-size:.85rem">Nothing here yet.</p>' +
        '<a class="btn btn-sm" href="shop.html"><span>Browse tees</span></a></div>';
    } else {
      body.innerHTML = items.map(function (it) {
        var p = H.byId(it.id);
        if (!p) return '';
        return '<div class="cart-line">' +
          '<div class="cart-line-media">' + BKC.renderProductTee(p, { flat: true }) + '</div>' +
          '<div><h4>' + p.name + '</h4>' +
            '<div class="meta">' + p.colorName + ' · ' + BKC.fits[p.fit].label + ' · Size ' + it.size + '</div>' +
            '<div class="qty" style="margin-top:.4rem">' +
              '<button data-dec="' + it.key + '" aria-label="Decrease">−</button>' +
              '<span>' + it.qty + '</span>' +
              '<button data-inc="' + it.key + '" aria-label="Increase">+</button>' +
            '</div>' +
          '</div>' +
          '<div style="text-align:right"><b class="display">' + H.money(p.price * it.qty) + '</b>' +
            '<button class="mono" style="display:block;margin-top:.5rem;color:var(--ink-45);text-decoration:underline" data-rm="' + it.key + '">Remove</button>' +
          '</div>' +
        '</div>';
      }).join('');
    }
    var tot = $('[data-cart-total]');
    if (tot) tot.textContent = H.money(BKC.cart.total());
  }

  function toast(msg) {
    var stack = $('[data-toasts]');
    if (!stack) return;
    var t = doc.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    stack.appendChild(t);
    setTimeout(function () { t.remove(); }, 2600);
  }
  BKC.toast = toast;

  /* Delegated cart events. */
  doc.addEventListener('click', function (e) {
    var t = e.target;
    if (t.closest('[data-cart-open]')) { openCart(); return; }
    var inc = t.closest('[data-inc]'), dec = t.closest('[data-dec]'), rm = t.closest('[data-rm]');
    if (inc || dec || rm) {
      var key = (inc || dec || rm).getAttribute('data-inc') || (inc || dec || rm).getAttribute('data-dec') || (inc || dec || rm).getAttribute('data-rm');
      var cur = 0;
      BKC.cart.items().forEach(function (it) { if (it.key === key) cur = it.qty; });
      if (inc) BKC.cart.setQty(key, cur + 1);
      if (dec) BKC.cart.setQty(key, cur - 1);
      if (rm) BKC.cart.remove(key);
    }
    var quick = t.closest('[data-quick-add]');
    if (quick) {
      e.preventDefault();
      var p = H.byId(quick.getAttribute('data-quick-add'));
      if (p) {
        var mid = BKC.fits[p.fit].sizes[Math.floor(BKC.fits[p.fit].sizes.length / 2)];
        BKC.cart.add(p.id, mid, 1);
        toast('Added · ' + p.name);
        openCart();
      }
    }
  });

  /* ======================================================================
     4. Motion
     ====================================================================== */
  function initReveal() {
    var els = $$('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    els.forEach(function (el, i) {
      if (!el.style.getPropertyValue('--reveal-delay')) {
        var stagger = el.hasAttribute('data-stagger') ? (i % 6) * 70 : 0;
        el.style.setProperty('--reveal-delay', stagger + 'ms');
      }
      io.observe(el);
    });
  }

  /* Wrap each character of [data-split] so it can rise into place. */
  function initSplit() {
    $$('[data-split]').forEach(function (el) {
      var text = el.textContent.trim();
      var i = 0;
      el.innerHTML = text.split(' ').map(function (word) {
        var chars = word.split('').map(function (c) {
          return '<span class="split-char" style="--char-i:' + (i++) + '">' + c + '</span>';
        }).join('');
        return '<span class="split-line" style="display:inline-block">' + chars + '</span>';
      }).join('<span class="split-line" style="display:inline-block">&nbsp;</span>');
      el.classList.add('split-ready');
    });
  }

  /* Duplicate marquee content so the -50% translate loops seamlessly. */
  function initMarquees() {
    $$('.marquee-track').forEach(function (track) {
      track.innerHTML = track.innerHTML + track.innerHTML;
    });
  }

  /* Parallax for anything tagged data-parallax="0.15" */
  function initParallax() {
    var items = $$('[data-parallax]');
    if (!items.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var ticking = false;
    function frame() {
      var vh = window.innerHeight;
      items.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        var offset = (r.top + r.height / 2 - vh / 2) * -speed;
        el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(frame); }
    }, { passive: true });
    frame();
  }

  /* ======================================================================
     5. Product card
     ====================================================================== */
  BKC.card = function (p) {
    var swatches = [p.color].concat(p.alsoIn.filter(function (c) { return c !== p.color; })).slice(0, 5);
    var dots = swatches.map(function (c) {
      var col = BKC.colors[c];
      return col ? '<span class="swatch-dot" style="background:' + col.hex + '" title="' + col.name + '"></span>' : '';
    }).join('');
    var off = H.discount(p);
    return '<article class="card" data-reveal data-stagger>' +
      '<div class="card-media">' + BKC.renderProductTee(p) +
        '<div class="card-badges">' +
          (p.badge ? '<span class="stamp stamp-red">' + p.badge + '</span>' : '') +
          (off >= 45 ? '<span class="stamp stamp-marigold">' + off + '% OFF</span>' : '') +
        '</div>' +
        '<span class="card-fit">' + BKC.fits[p.fit].label + '</span>' +
        '<button class="btn btn-sm btn-block card-quick" data-quick-add="' + p.id + '"><span>Quick add</span></button>' +
      '</div>' +
      '<div class="card-body">' +
        '<h3 class="card-title">' + p.name + '</h3>' +
        '<div class="card-sub">' + p.colorName + ' · ' + p.cats.map(H.catLabel).slice(0, 2).join(' · ') + '</div>' +
        '<div class="rating"><span class="rating-stars">★★★★★</span> ' + p.rating.toFixed(1) + ' (' + p.reviews.toLocaleString('en-IN') + ')</div>' +
        '<div class="card-swatches">' + dots + '</div>' +
        '<div class="card-price"><b>' + H.money(p.price) + '</b><s>' + H.money(p.mrp) + '</s><em>' + off + '% off</em></div>' +
      '</div>' +
      '<a class="card-link" href="product.html?id=' + p.id + '" aria-label="' + p.name + '"></a>' +
    '</article>';
  };

  BKC.renderGrid = function (sel, list) {
    var el = $(sel);
    if (!el) return;
    el.innerHTML = list.map(BKC.card).join('');
    initReveal();
  };

  /* ======================================================================
     6. Home hero — the typography engine
     ====================================================================== */
  var HERO_FONTS = [
    { key: 'anton',    label: 'Anton',      css: "'Anton', Impact, sans-serif" },
    { key: 'bebas',    label: 'Bebas',      css: "'Bebas Neue', Impact, sans-serif" },
    { key: 'rozha',    label: 'Rozha One',  css: "'Rozha One', Georgia, serif" },
    { key: 'marker',   label: 'Marker',     css: "'Permanent Marker', cursive" },
    { key: 'playfair', label: 'Playfair',   css: "'Playfair Display', Georgia, serif" },
    { key: 'mono',     label: 'Mono',       css: "'Space Mono', monospace" },
    { key: 'grotesk',  label: 'Grotesk',    css: "'Space Grotesk', sans-serif" },
    { key: 'deva',     label: 'भारत',       css: "'Rozha One', 'Nirmala UI', serif", lines: ['भारत का', 'चूतिया'] }
  ];

  function initHero() {
    var stage = $('[data-hero-tee]');
    if (!stage) return;
    var chips = $('[data-hero-fonts]');
    var idx = 0;
    var auto = true;

    function paint(i) {
      var f = HERO_FONTS[i];
      stage.style.opacity = '0';
      stage.style.transform = 'scale(.97)';
      setTimeout(function () {
        stage.innerHTML = BKC.renderTee({
          fit: 'oversized',
          teeHex: '#FFFFFF',
          printHex: '#0E0E0C',
          lines: f.lines || ['BHARAT KA', 'CHOOTIYA'],
          font: f.css,
          detail: 'high',
          alt: 'White oversized t-shirt printed with Bharat Ka Chootiya in ' + f.label
        });
        stage.style.opacity = '1';
        stage.style.transform = 'none';
      }, 170);
      if (chips) $$('.font-chip', chips).forEach(function (c, n) {
        c.classList.toggle('is-on', n === i);
      });
    }

    if (chips) {
      chips.innerHTML = HERO_FONTS.map(function (f, i) {
        return '<button class="font-chip" style="font-family:' + f.css + '" data-i="' + i + '">' + f.label + '</button>';
      }).join('');
      chips.addEventListener('click', function (e) {
        var b = e.target.closest('.font-chip');
        if (!b) return;
        auto = false;
        idx = parseInt(b.getAttribute('data-i'), 10);
        paint(idx);
      });
    }

    stage.style.transition = 'opacity .17s ease, transform .17s ease';
    paint(0);

    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInterval(function () {
        if (!auto) return;
        idx = (idx + 1) % HERO_FONTS.length;
        paint(idx);
      }, 2400);
    }

    var buy = $('[data-hero-buy]');
    if (buy) buy.addEventListener('click', function () {
      var hero = H.products[0];
      BKC.cart.add(hero.id, 'L', 1, HERO_FONTS[idx].label);
      toast('Added · Hero tee in ' + HERO_FONTS[idx].label);
      openCart();
    });
  }

  /* ======================================================================
     7. Shop controller
     ====================================================================== */
  function initShop() {
    var grid = $('[data-shop-grid]');
    if (!grid) return;

    var params = new URLSearchParams(location.search);
    var state = {
      q: params.get('q') || '',
      cat: params.get('cat') || '',
      fit: params.get('fit') || '',
      color: params.get('color') || '',
      occ: params.get('occ') || '',
      aud: params.get('aud') || '',
      sort: params.get('sort') || 'popular'
    };

    function build(list, key, labelFn) {
      return list.map(function (v) {
        var val = typeof v === 'string' ? v : v.key;
        var label = labelFn ? labelFn(v) : v.label;
        return '<button class="chip' + (state[key] === val ? ' is-on' : '') +
          '" data-f="' + key + '" data-v="' + val + '">' + label + '</button>';
      }).join('');
    }

    var f = $('[data-filters]');
    if (f) {
      f.innerHTML =
        '<div class="filter-group"><h4>Fit</h4><div class="filter-list">' +
          build(Object.keys(BKC.fits).map(function (k) { return BKC.fits[k]; }), 'fit') +
        '</div></div>' +
        '<div class="filter-group"><h4>Category</h4><div class="filter-list">' +
          build(BKC.categories, 'cat') +
        '</div></div>' +
        '<div class="filter-group"><h4>Occasion</h4><div class="filter-list">' +
          build(BKC.occasions, 'occ') +
        '</div></div>' +
        '<div class="filter-group"><h4>Wearer</h4><div class="filter-list">' +
          build([{ key: 'men', label: 'Men' }, { key: 'women', label: 'Women' }, { key: 'unisex', label: 'Unisex' },
                 { key: 'kids', label: 'Kids' }, { key: 'pride', label: 'Pride' }], 'aud') +
        '</div></div>' +
        '<div class="filter-group"><h4>Colour</h4><div class="filter-list">' +
          Object.keys(BKC.colors).map(function (c) {
            return '<button class="swatch' + (state.color === c ? ' is-on' : '') + '" title="' + BKC.colors[c].name +
              '" style="width:26px;height:26px;background:' + BKC.colors[c].hex + '" data-f="color" data-v="' + c + '"></button>';
          }).join('') +
        '</div></div>' +
        '<div class="filter-group"><button class="btn btn-sm btn-block" data-clear><span>Clear all</span></button></div>';

      f.addEventListener('click', function (e) {
        var b = e.target.closest('[data-f]');
        if (b) {
          var k = b.getAttribute('data-f'), v = b.getAttribute('data-v');
          state[k] = (state[k] === v) ? '' : v;
          sync();
        }
        if (e.target.closest('[data-clear]')) {
          state.q = state.cat = state.fit = state.color = state.occ = state.aud = '';
          var si = $('[data-shop-search]'); if (si) si.value = '';
          sync();
        }
      });
    }

    var search = $('[data-shop-search]');
    if (search) {
      search.value = state.q;
      search.addEventListener('input', function () { state.q = search.value; render(); });
    }
    var sort = $('[data-shop-sort]');
    if (sort) {
      sort.value = state.sort;
      sort.addEventListener('change', function () { state.sort = sort.value; render(); });
    }
    var ftog = $('[data-filter-toggle]');
    if (ftog) ftog.addEventListener('click', function () { f.classList.toggle('is-open'); });

    function sync() {
      /* Repaint chip states without rebuilding the whole panel. */
      $$('[data-f]', f).forEach(function (b) {
        var on = state[b.getAttribute('data-f')] === b.getAttribute('data-v');
        b.classList.toggle('is-on', on);
      });
      render();
    }

    function match(p) {
      if (state.fit && p.fit !== state.fit) return false;
      if (state.cat && p.cats.indexOf(state.cat) === -1) return false;
      if (state.occ && p.occasions.indexOf(state.occ) === -1) return false;
      if (state.color && p.color !== state.color) return false;
      if (state.aud) {
        var ok = p.audience.indexOf(state.aud) !== -1 ||
          (state.aud !== 'kids' && state.aud !== 'pride' && p.audience.indexOf('unisex') !== -1);
        if (!ok) return false;
      }
      if (state.q) {
        var hay = (p.name + ' ' + p.printLines.join(' ') + ' ' + p.cats.join(' ') + ' ' + p.colorName).toLowerCase();
        if (hay.indexOf(state.q.toLowerCase()) === -1) return false;
      }
      return true;
    }

    function render() {
      var list = BKC.products.filter(match);
      if (state.sort === 'price-asc') list.sort(function (a, b) { return a.price - b.price; });
      else if (state.sort === 'price-desc') list.sort(function (a, b) { return b.price - a.price; });
      else if (state.sort === 'rating') list.sort(function (a, b) { return b.rating - a.rating; });
      else list.sort(function (a, b) { return b.reviews - a.reviews; });

      var count = $('[data-shop-count]');
      if (count) count.textContent = list.length + ' design' + (list.length === 1 ? '' : 's');

      grid.innerHTML = list.length
        ? list.map(BKC.card).join('')
        : '<div class="empty-state" style="grid-column:1/-1"><p class="alt" style="font-size:1.4rem">Kuch nahi mila</p>' +
          '<p class="muted">Try clearing a filter or two.</p></div>';
      initReveal();

      var qs = Object.keys(state).filter(function (k) { return state[k] && k !== 'sort'; })
        .map(function (k) { return k + '=' + encodeURIComponent(state[k]); }).join('&');
      history.replaceState(null, '', qs ? '?' + qs : location.pathname);
    }

    render();
  }

  /* ======================================================================
     8. Product detail controller
     ====================================================================== */
  function initPDP() {
    var root = $('[data-pdp]');
    if (!root) return;
    var id = new URLSearchParams(location.search).get('id');
    var p = H.byId(id) || BKC.products[0];

    var colorKeys = [p.color].concat(Object.keys(BKC.colors).filter(function (c) { return c !== p.color; })).slice(0, 10);
    var chosen = { color: p.color, fit: p.fit, size: '' };

    function paintMedia() {
      $('[data-pdp-media]').innerHTML = BKC.renderProductTee(p, {
        teeHex: BKC.colors[chosen.color].hex,
        printHex: BKC.colors[chosen.color].ink,
        fit: chosen.fit,
        detail: 'high'
      });
    }

    root.innerHTML =
      '<div>' +
        '<div class="pdp-media"><div data-pdp-media></div>' +
          '<div class="pdp-thumbs">' +
            Object.keys(BKC.fits).map(function (k, i) {
              return '<button class="pdp-thumb' + (k === p.fit ? ' is-on' : '') + '" data-fit="' + k + '" title="' + BKC.fits[k].label + '">' +
                BKC.renderTee({ fit: k, teeHex: BKC.colors[p.color].hex, printHex: BKC.colors[p.color].ink, lines: p.printLines.slice(0, 1), glyph: p.glyph, font: p.font, flat: true }) +
              '</button>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div>' +
        '<div class="breadcrumb"><a href="index.html">Home</a> / <a href="shop.html">Shop</a> / ' +
          '<a href="shop.html?cat=' + p.cats[0] + '">' + H.catLabel(p.cats[0]) + '</a> / <span>' + p.name + '</span></div>' +
        (p.badge ? '<span class="stamp stamp-red">' + p.badge + '</span>' : '') +
        '<h1 class="pdp-title" style="margin:.6rem 0">' + p.name + '</h1>' +
        '<div class="rating" style="margin-bottom:.8rem"><span class="rating-stars">★★★★★</span> ' +
          p.rating.toFixed(1) + ' · ' + p.reviews.toLocaleString('en-IN') + ' reviews</div>' +
        '<div class="pdp-price"><b>' + H.money(p.price) + '</b><s>' + H.money(p.mrp) + '</s><em>' + H.discount(p) + '% OFF</em></div>' +
        '<p class="mono" style="margin:.3rem 0 0;color:var(--ink-45)">Inclusive of all taxes · ID ' + p.id + '</p>' +
        (p.desc ? '<p style="margin-top:1rem">' + p.desc + '</p>' : '') +
        '<div class="pdp-block"><h4>Colour — <span data-color-name>' + p.colorName + '</span></h4>' +
          '<div class="swatch-row" data-colors>' +
            colorKeys.map(function (c) {
              return '<button class="swatch' + (c === chosen.color ? ' is-on' : '') + '" style="background:' + BKC.colors[c].hex +
                '" data-color="' + c + '" title="' + BKC.colors[c].name + '" aria-label="' + BKC.colors[c].name + '"></button>';
            }).join('') +
          '</div></div>' +
        '<div class="pdp-block"><h4>Fit</h4><div class="size-row" data-fits>' +
          Object.keys(BKC.fits).map(function (k) {
            return '<button class="size-btn' + (k === chosen.fit ? ' is-on' : '') + '" data-fitbtn="' + k + '">' + BKC.fits[k].label + '</button>';
          }).join('') +
        '</div><p class="muted" style="font-size:.85rem;margin:.6rem 0 0" data-fit-blurb>' + BKC.fits[p.fit].blurb + '</p></div>' +
        '<div class="pdp-block"><h4>Size</h4><div class="size-row" data-sizes></div>' +
          '<p class="mono" style="margin:.6rem 0 0"><a href="about.html#sizing" style="text-decoration:underline">Size guide &amp; measurements →</a></p></div>' +
        '<div class="pdp-block" style="display:flex;gap:.6rem;flex-wrap:wrap">' +
          '<button class="btn btn-accent btn-lg" style="flex:1;min-width:220px" data-add><span>Add to bag</span></button>' +
          '<button class="btn btn-paper btn-lg" data-wish><span>♡</span></button>' +
        '</div>' +
        '<div class="pdp-block"><div class="trust-row">' +
          '<div><div class="glyph">🚚</div><span>Free over ₹999</span></div>' +
          '<div><div class="glyph">↩️</div><span>7-day returns</span></div>' +
          '<div><div class="glyph">💵</div><span>COD available</span></div>' +
        '</div></div>' +
        '<div class="pdp-block">' +
          '<details class="acc" open><summary>Fabric &amp; print</summary><div class="acc-body">' +
            '<p style="margin:0">' + BKC.fits[p.fit].gsm + ' GSM 100% combed cotton, bio-washed and pre-shrunk. ' +
            'Print is water-based DTG in <b>' + p.fontKey + '</b> — soft to touch, no plastic hand-feel.</p></div></details>' +
          '<details class="acc"><summary>Wash care</summary><div class="acc-body"><p style="margin:0">' +
            'Cold machine wash inside out. No bleach. Tumble dry low or line dry in shade. Do not iron directly on the print.</p></div></details>' +
          '<details class="acc"><summary>Shipping &amp; returns</summary><div class="acc-body"><p style="margin:0">' +
            'Dispatched in 24–48 hours from Noida. Metro delivery 2–4 days, rest of India 4–7 days. ' +
            '7-day no-questions return on unworn pieces with tags.</p></div></details>' +
        '</div>' +
      '</div>';

    paintMedia();

    function paintSizes() {
      var sizes = BKC.fits[chosen.fit].sizes;
      $('[data-sizes]').innerHTML = sizes.map(function (s, i) {
        var out = (i === sizes.length - 1 && p.reviews % 3 === 0);
        return '<button class="size-btn' + (chosen.size === s ? ' is-on' : '') + (out ? ' is-out' : '') + '" data-size="' + s + '">' + s + '</button>';
      }).join('');
    }
    paintSizes();

    root.addEventListener('click', function (e) {
      var c = e.target.closest('[data-color]');
      if (c) {
        chosen.color = c.getAttribute('data-color');
        $$('[data-colors] .swatch').forEach(function (s) { s.classList.toggle('is-on', s === c); });
        $('[data-color-name]').textContent = BKC.colors[chosen.color].name;
        paintMedia();
      }
      var fb = e.target.closest('[data-fitbtn]') || e.target.closest('[data-fit]');
      if (fb) {
        chosen.fit = fb.getAttribute('data-fitbtn') || fb.getAttribute('data-fit');
        chosen.size = '';
        $$('[data-fitbtn]').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-fitbtn') === chosen.fit); });
        $$('.pdp-thumb').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-fit') === chosen.fit); });
        $('[data-fit-blurb]').textContent = BKC.fits[chosen.fit].blurb;
        paintSizes();
        paintMedia();
      }
      var s = e.target.closest('[data-size]');
      if (s) {
        chosen.size = s.getAttribute('data-size');
        $$('[data-sizes] .size-btn').forEach(function (b) { b.classList.toggle('is-on', b === s); });
      }
      if (e.target.closest('[data-add]')) {
        if (!chosen.size) return toast('Pick a size first');
        BKC.cart.add(p.id, chosen.size, 1, BKC.colors[chosen.color].name + ' / ' + BKC.fits[chosen.fit].label);
        toast('Added · ' + p.name);
        openCart();
      }
      if (e.target.closest('[data-wish]')) toast('Saved to wishlist');
    });

    doc.title = p.name + ' — BKC';
    BKC.renderGrid('[data-related]', H.related(p, 4));
  }

  /* ======================================================================
     9. Boot
     ====================================================================== */
  function boot() {
    buildHeader();
    buildFooter();
    buildDrawer();
    paintCart();
    initMarquees();
    initSplit();
    initHero();
    initShop();
    initPDP();
    if (typeof BKC.initPage === 'function') BKC.initPage();
    initReveal();
    initParallax();
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window.BKC, document);

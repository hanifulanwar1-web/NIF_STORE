// main.js - navigasi, pencarian, toast/modal, dan logika tiap halaman
(function () {
  'use strict';

  var H = window.Hanif;
  function $(id) { return document.getElementById(id); }
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // 1. UI bersama: toast dan modal
  var lastFocus = null;

  function toast(msg, type) {
    var wrap = $('hanif_toast_wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'hanif_toast_wrap';
      wrap.setAttribute('role', 'status');
      wrap.setAttribute('aria-live', 'polite');
      document.body.appendChild(wrap);
    }
    type = type || 'success';
    var el = document.createElement('div');
    el.className = 'hanif_toast' + (type === 'error' ? ' hanif_toast_error' : '');
    el.innerHTML = H.icon(type === 'error' ? 'alert' : 'check') + '<span>' + H.esc(msg) + '</span>';
    wrap.appendChild(el);
    setTimeout(function () {
      el.classList.add('hanif_toast_out');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 320);
    }, 3600);
  }

  // opts: { title, html, actions:[{label, primary, href, onClick, keepOpen}], onClose }
  function modal(opts) {
    lastFocus = document.activeElement;
    var wrap = document.createElement('div');
    wrap.className = 'hanif_modal_wrap';
    var box = document.createElement('div');
    box.className = 'hanif_modal';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', opts.title);
    box.innerHTML = '<div class="hanif_modal_head"><h2>' + H.esc(opts.title) + '</h2>' +
      '<button type="button" class="hanif_icon_button hanif_modal_close" aria-label="Tutup">' + H.icon('x') + '</button></div>' +
      '<div class="hanif_modal_body">' + opts.html + '</div><div class="hanif_modal_actions"></div>';
    wrap.appendChild(box);
    document.body.appendChild(wrap);
    document.body.style.overflow = 'hidden';

    var closed = false;
    function close() {
      if (closed) return;
      closed = true;
      document.removeEventListener('keydown', onKey);
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
      document.body.style.overflow = '';
      if (opts.onClose) opts.onClose();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    wrap.addEventListener('mousedown', function (e) { if (e.target === wrap) close(); });
    qs('.hanif_modal_close', box).addEventListener('click', close);

    var actions = qs('.hanif_modal_actions', box);
    (opts.actions || []).forEach(function (a) {
      var el = document.createElement(a.href ? 'a' : 'button');
      el.className = 'hanif_button' + (a.primary ? '' : ' hanif_button_outline');
      el.textContent = a.label;
      if (a.href) { el.href = a.href; el.target = '_blank'; el.rel = 'noopener'; } else el.type = 'button';
      el.addEventListener('click', function (e) {
        if (a.onClick) { var r = a.onClick(el, box, e); if (r === false) return; }
        if (!a.keepOpen) { if (a.href) setTimeout(close, 300); else close(); }
      });
      actions.appendChild(el);
    });
    if (!actions.children.length) actions.remove();
    var first = qs('.hanif_modal_actions .hanif_button', box) || qs('.hanif_modal_close', box);
    if (first) first.focus();
    return { el: box, close: close };
  }
  H.ui = { toast: toast, modal: modal };

  // 2. Navigasi mobile, pencarian, back-to-top, reveal
  function initNav() {
    var burger = $('hanif_burger'), menu = $('hanif_menu');
    if (!burger || !menu) return;
    var scrim = document.createElement('div');
    scrim.className = 'hanif_scrim';
    document.body.appendChild(scrim);

    function setOpen(open) {
      menu.classList.toggle('hanif_is_open', open);
      scrim.classList.toggle('hanif_is_open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', function () { setOpen(!menu.classList.contains('hanif_is_open')); });
    scrim.addEventListener('click', function () { setOpen(false); });
    qsa('.hanif_menu_close', menu).forEach(function (b) { b.addEventListener('click', function () { setOpen(false); }); });
    qsa('a', menu).forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }

  function initSearch() {
    var btn = $('hanif_search_btn'), overlay = $('hanif_search_overlay');
    if (!btn || !overlay) return;
    var form = $('hanif_search_form'), input = $('hanif_search_q'), box = $('hanif_search_suggest');

    function open() {
      overlay.classList.add('hanif_is_open');
      overlay.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
      setTimeout(function () { input.focus(); }, 50);
    }
    function close() {
      overlay.classList.remove('hanif_is_open');
      overlay.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
    }
    function suggest() {
      var q = input.value.trim().toLowerCase();
      if (q.length < 2) { box.innerHTML = ''; return; }
      var hit = H.products.filter(function (p) { return p.nama.toLowerCase().indexOf(q) > -1; }).slice(0, 4);
      box.innerHTML = hit.length ? hit.map(function (p) {
        return '<a href="detail-produk.html?id=' + p.id + '"><img src="' + p.warna[0].gambar + '" alt="' + H.esc(p.nama) + '" width="44" height="52"><span>' + H.esc(p.nama) + '<small>' + H.rupiah(p.harga) + '</small></span></a>';
      }).join('') : '<p class="hanif_search_hint">Produk tidak ditemukan. Coba kata kunci lain.</p>';
    }
    btn.addEventListener('click', open);
    overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    input.addEventListener('input', suggest);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = input.value.trim();
      if (!q) { toast('Ketik nama produk yang ingin dicari.', 'error'); input.focus(); return; }
      window.location.href = 'produk.html?q=' + encodeURIComponent(q);
    });
  }

  function initToTop() {
    var btn = $('hanif_totop');
    if (!btn) return;
    function check() { btn.classList.toggle('hanif_is_visible', window.pageYOffset > 500); }
    window.addEventListener('scroll', check, { passive: true });
    check();
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  function initReveal() {
    var els = qsa('.hanif_reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('hanif_in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('hanif_in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  }

  // 3. Kartu produk + quick add
  function mainCategory(p) {
    var c = H.findCategory(p.kategori[p.kategori.length - 1]);
    return c ? c.nama : '';
  }
  function cardHTML(p) {
    var badge = '';
    if (H.totalStock(p) === 0) badge = '<span class="hanif_badge hanif_badge_habis">Habis</span>';
    else if (p.label === 'best') badge = '<span class="hanif_badge">Best Seller</span>';
    else if (p.label === 'baru') badge = '<span class="hanif_badge hanif_badge_baru">Terbaru</span>';
    var dots = p.warna.map(function (w) { return '<span class="hanif_dot" title="' + H.esc(w.nama) + '" style="background:' + w.hex + '"></span>'; }).join('');
    return '<article class="hanif_product_card">' +
      '<a class="hanif_product_media" href="detail-produk.html?id=' + p.id + '" aria-label="Lihat detail ' + H.esc(p.nama) + '">' +
      '<img src="' + p.warna[0].gambar + '" alt="' + H.esc(p.nama + ' warna ' + p.warna[0].nama) + '" loading="lazy" width="600" height="700">' + badge + '</a>' +
      '<div class="hanif_product_body"><span class="hanif_product_cat">' + H.esc(mainCategory(p)) + '</span>' +
      '<h3 class="hanif_product_name"><a href="detail-produk.html?id=' + p.id + '">' + H.esc(p.nama) + '</a></h3>' +
      '<div class="hanif_product_price">' + H.rupiah(p.harga) + '</div><div class="hanif_dots">' + dots + '</div>' +
      '<div class="hanif_product_actions"><a class="hanif_button hanif_button_outline" href="detail-produk.html?id=' + p.id + '">Lihat Detail</a>' +
      '<button type="button" class="hanif_button" data-quick="' + p.id + '">' + H.icon('plus', 'hanif_icon_sm') + ' Keranjang</button></div></div></article>';
  }
  function renderGrid(el, list) { el.innerHTML = list.map(cardHTML).join(''); }

  // dialog pilih ukuran & warna dari kartu produk
  function quickAdd(id) {
    var p = H.findProduct(id);
    if (!p) return;
    var st = { size: null, color: p.warna[0].nama };
    var html = '<div class="hanif_quick_head"><img class="hanif_quick_img" id="hanif_quick_img" src="' + p.warna[0].gambar + '" alt="' + H.esc(p.nama) + '"><div><strong>' + H.esc(p.nama) + '</strong><br>' + H.rupiah(p.harga) + '</div></div>' +
      '<div class="hanif_option"><div class="hanif_option_title"><strong>Warna</strong><span id="hanif_quick_color">' + H.esc(st.color) + '</span></div><div class="hanif_swatches">' +
      p.warna.map(function (w, i) { return '<button type="button" class="hanif_swatch' + (i === 0 ? ' hanif_is_active' : '') + '" data-color="' + H.esc(w.nama) + '" style="background:' + w.hex + '" aria-label="Warna ' + H.esc(w.nama) + '"></button>'; }).join('') +
      '</div></div><div class="hanif_option"><div class="hanif_option_title"><strong>Ukuran</strong><a href="ukuran.html">Panduan ukuran</a></div><div class="hanif_sizes" id="hanif_quick_sizes">' +
      H.sizes.map(function (s) { return '<button type="button" class="hanif_size_btn" data-size="' + s + '"' + (p.stok[s] < 1 ? ' disabled title="Stok habis"' : '') + '>' + s + '</button>'; }).join('') + '</div></div>';
    var m = modal({
      title: 'Pilih varian', html: html,
      actions: [{ label: 'Tambahkan ke Keranjang', primary: true, keepOpen: true, onClick: function () {
        if (!st.size) { toast('Pilih ukuran terlebih dahulu.', 'error'); return false; }
        var r = H.cart.add(p.id, st.size, st.color, 1);
        toast(r.msg, r.ok ? 'success' : 'error');
        if (r.ok) m.close(); else return false;
      } }, { label: 'Lihat Detail', href: 'detail-produk.html?id=' + p.id }]
    });
    m.el.addEventListener('click', function (e) {
      var c = e.target.closest('[data-color]'), s = e.target.closest('[data-size]');
      if (c && !c.disabled) {
        st.color = c.getAttribute('data-color');
        qsa('[data-color]', m.el).forEach(function (x) { x.classList.toggle('hanif_is_active', x === c); });
        $('hanif_quick_color').textContent = st.color;
        $('hanif_quick_img').src = H.findColor(p, st.color).gambar;
      }
      if (s && !s.disabled) {
        st.size = s.getAttribute('data-size');
        qsa('[data-size]', m.el).forEach(function (x) { x.classList.toggle('hanif_is_active', x === s); });
      }
    });
  }
  function initQuickAdd() {
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-quick]');
      if (b) quickAdd(b.getAttribute('data-quick'));
    });
  }

  // 4. Halaman Home
  function initHome() {
    var best = $('hanif_best_grid'), baru = $('hanif_new_grid');
    if (best) renderGrid(best, H.products.filter(function (p) { return p.label === 'best'; }).slice(0, 4));
    if (baru) renderGrid(baru, H.products.filter(function (p) { return p.label === 'baru'; }).slice(0, 4));
  }

  // 5. Halaman Produk: pencarian, filter kategori, filter harga, sorting
  function initCatalog() {
    var grid = $('hanif_product_grid');
    if (!grid) return;
    var inputQ = $('hanif_filter_q'), selHarga = $('hanif_filter_harga'), selSort = $('hanif_filter_sort');
    var chips = $('hanif_chips'), count = $('hanif_result_count'), empty = $('hanif_empty'), reset = $('hanif_reset');

    var kat = H.param('kategori');
    if (kat && !H.findCategory(kat)) kat = '';
    var state = { q: (H.param('q') || '').trim(), kat: kat || '', harga: 'semua', sort: 'default' };
    inputQ.value = state.q;

    // chip kategori dari data
    chips.innerHTML = '<button type="button" class="hanif_chip" data-kat="">Semua</button>' + H.categories.map(function (c) {
      return '<button type="button" class="hanif_chip" data-kat="' + c.slug + '">' + H.esc(c.nama) + '</button>';
    }).join('');

    function apply() {
      var q = state.q.toLowerCase();
      var list = H.products.filter(function (p) {
        if (q && (p.nama + ' ' + p.deskripsi).toLowerCase().indexOf(q) < 0) return false;
        if (state.kat && p.kategori.indexOf(state.kat) < 0) return false;
        if (state.harga !== 'semua') {
          var r = state.harga.split('-');
          if (p.harga < +r[0] || p.harga > +r[1]) return false;
        }
        return true;
      });
      if (state.sort === 'termurah') list.sort(function (a, b) { return a.harga - b.harga; });
      if (state.sort === 'termahal') list.sort(function (a, b) { return b.harga - a.harga; });
      if (state.sort === 'nama') list.sort(function (a, b) { return a.nama.localeCompare(b.nama); });

      renderGrid(grid, list);
      grid.hidden = list.length === 0;
      empty.hidden = list.length !== 0;
      var cat = state.kat ? H.findCategory(state.kat).nama : 'semua kategori';
      count.textContent = 'Menampilkan ' + list.length + ' dari ' + H.products.length + ' produk (' + cat + ')';
      qsa('.hanif_chip', chips).forEach(function (c) { c.classList.toggle('hanif_is_active', c.getAttribute('data-kat') === state.kat); });
      var dirty = state.q || state.kat || state.harga !== 'semua' || state.sort !== 'default';
      reset.hidden = !dirty;
      try { // sinkronkan URL (dibungkus try karena beberapa browser membatasi di file://)
        var u = new URLSearchParams();
        if (state.q) u.set('q', state.q);
        if (state.kat) u.set('kategori', state.kat);
        history.replaceState(null, '', u.toString() ? '?' + u.toString() : window.location.pathname);
      } catch (e) { /* tidak apa-apa */ }
    }

    inputQ.addEventListener('input', function () { state.q = inputQ.value.trim(); apply(); });
    selHarga.addEventListener('change', function () { state.harga = selHarga.value; apply(); });
    selSort.addEventListener('change', function () { state.sort = selSort.value; apply(); });
    chips.addEventListener('click', function (e) {
      var b = e.target.closest('.hanif_chip');
      if (b) { state.kat = b.getAttribute('data-kat'); apply(); }
    });
    function doReset() {
      state = { q: '', kat: '', harga: 'semua', sort: 'default' };
      inputQ.value = ''; selHarga.value = 'semua'; selSort.value = 'default'; apply();
    }
    reset.addEventListener('click', doReset);
    var reset2 = $('hanif_reset_empty');
    if (reset2) reset2.addEventListener('click', doReset);
    apply();
  }

  // 6. Halaman Kategori: jumlah produk per kategori
  function initCategories() {
    qsa('[data-count-kat]').forEach(function (el) {
      var slug = el.getAttribute('data-count-kat');
      var n = H.products.filter(function (p) { return p.kategori.indexOf(slug) > -1; }).length;
      el.textContent = n + ' produk';
    });
  }

  // 7. Halaman Detail Produk
  function initDetail() {
    var root = $('hanif_detail_root');
    if (!root) return;
    var p = H.findProduct(H.param('id'));
    var nf = $('hanif_detail_notfound');
    if (!p) { root.hidden = true; nf.hidden = false; return; }
    nf.hidden = true;
    document.title = p.nama + ' - NIFSTORE';
    var st = { color: p.warna[0].nama, size: null, qty: 1 };
    var crumb = $('hanif_crumb_name'); if (crumb) crumb.textContent = p.nama;

    var katNama = p.kategori.map(function (s) { return H.findCategory(s).nama; }).join(' / ');
    root.innerHTML =
      '<div class="hanif_gallery"><div class="hanif_gallery_main"><img id="hanif_detail_img" src="' + p.warna[0].gambar + '" alt="' + H.esc(p.nama + ' warna ' + p.warna[0].nama) + '" width="600" height="700"></div>' +
      (p.galeri.length > 1 ? '<div class="hanif_thumbs">' + p.galeri.map(function (g, i) {
        return '<button type="button" class="hanif_thumb' + (g === p.warna[0].gambar ? ' hanif_is_active' : '') + '" data-foto="' + g + '" aria-label="Lihat foto ' + (i + 1) + '"><img src="' + g + '" alt="" width="84" height="98"></button>';
      }).join('') + '</div>' : '') + '</div>' +
      '<div class="hanif_detail_info"><span class="hanif_eyebrow">' + H.esc(katNama) + '</span><h1>' + H.esc(p.nama) + '</h1>' +
      '<div class="hanif_detail_price">' + H.rupiah(p.harga) + '</div><p class="hanif_detail_desc">' + H.esc(p.deskripsi) + '</p>' +
      '<div class="hanif_option"><div class="hanif_option_title"><strong>Warna</strong><span id="hanif_detail_color">' + H.esc(st.color) + '</span></div><div class="hanif_swatches">' +
      p.warna.map(function (w, i) { return '<button type="button" class="hanif_swatch' + (i === 0 ? ' hanif_is_active' : '') + '" data-color="' + H.esc(w.nama) + '" style="background:' + w.hex + '" aria-label="Warna ' + H.esc(w.nama) + '"></button>'; }).join('') + '</div></div>' +
      '<div class="hanif_option"><div class="hanif_option_title"><strong>Ukuran</strong><a href="ukuran.html">Panduan ukuran</a></div><div class="hanif_sizes" id="hanif_detail_sizes">' +
      H.sizes.map(function (s) { return '<button type="button" class="hanif_size_btn" data-size="' + s + '"' + (p.stok[s] < 1 ? ' disabled title="Stok habis"' : '') + '>' + s + '</button>'; }).join('') + '</div>' +
      '<p class="hanif_stock" id="hanif_detail_stock" style="margin:14px 0 0"></p></div>' +
      '<div class="hanif_option"><div class="hanif_option_title"><strong>Jumlah</strong></div><div class="hanif_qty" role="group" aria-label="Jumlah produk">' +
      '<button type="button" id="hanif_qty_minus" aria-label="Kurangi jumlah">' + H.icon('minus', 'hanif_icon_sm') + '</button><output id="hanif_qty_val" aria-live="polite">1</output>' +
      '<button type="button" id="hanif_qty_plus" aria-label="Tambah jumlah">' + H.icon('plus', 'hanif_icon_sm') + '</button></div></div>' +
      '<div class="hanif_buy_row"><button type="button" class="hanif_button hanif_button_outline" id="hanif_btn_add">' + H.icon('cart', 'hanif_icon_sm') + ' Tambahkan ke Keranjang</button>' +
      '<button type="button" class="hanif_button" id="hanif_btn_buy">Beli Sekarang</button></div>' +
      '<div class="hanif_accordion"><details open><summary>Informasi Bahan dan Kualitas</summary><div class="hanif_acc_body"><ul>' + p.bahan.map(function (b) { return '<li>' + H.esc(b) + '</li>'; }).join('') + '</ul></div></details>' +
      '<details><summary>Perawatan Produk</summary><div class="hanif_acc_body"><ul><li>Cuci dengan air dingin, balik bagian dalam kaos.</li><li>Hindari pemutih dan pengering mesin suhu tinggi.</li><li>Setrika dengan suhu rendah, jangan menyetrika bagian sablon langsung.</li></ul></div></details>' +
      '<details><summary>Pengiriman dan Pengembalian</summary><div class="hanif_acc_body"><p>Ongkir ' + H.rupiah(H.cart.ONGKIR) + ', gratis untuk belanja minimal ' + H.rupiah(H.cart.GRATIS_ONGKIR) + '. Penukaran ukuran dapat diajukan maksimal 7 hari setelah barang diterima.</p></div></details></div></div>';

    var img = $('hanif_detail_img'), sizes = $('hanif_detail_sizes'), stock = $('hanif_detail_stock');
    var qtyVal = $('hanif_qty_val'), minus = $('hanif_qty_minus'), plus = $('hanif_qty_plus');

    function maxQty() { return st.size ? p.stok[st.size] : 1; }
    function refresh() {
      qtyVal.textContent = st.qty;
      minus.disabled = st.qty <= 1;
      plus.disabled = st.qty >= maxQty();
      stock.className = 'hanif_stock';
      if (!st.size) {
        stock.innerHTML = '<span class="hanif_stock_dot"></span>Total stok ' + H.totalStock(p) + ' pcs. Pilih ukuran untuk melihat stok per ukuran.';
      } else {
        var n = p.stok[st.size];
        if (n <= 5) stock.classList.add('hanif_stock_low');
        stock.innerHTML = '<span class="hanif_stock_dot"></span>' + (n <= 5 ? 'Stok menipis: tersisa ' + n + ' pcs' : 'Stok tersedia: ' + n + ' pcs') + ' (ukuran ' + st.size + ')';
      }
    }
    function setColor(name) {
      st.color = name;
      var w = H.findColor(p, name);
      img.src = w.gambar; img.alt = p.nama + ' warna ' + w.nama;
      $('hanif_detail_color').textContent = w.nama;
      qsa('.hanif_swatch', root).forEach(function (b) { b.classList.toggle('hanif_is_active', b.getAttribute('data-color') === name); });
      qsa('.hanif_thumb', root).forEach(function (b) { b.classList.toggle('hanif_is_active', b.getAttribute('data-foto') === w.gambar); });
    }

    root.addEventListener('click', function (e) {
      var c = e.target.closest('[data-color]'), s = e.target.closest('[data-size]'), f = e.target.closest('[data-foto]');
      if (c) setColor(c.getAttribute('data-color'));
      if (f) {
        img.src = f.getAttribute('data-foto');
        qsa('.hanif_thumb', root).forEach(function (b) { b.classList.toggle('hanif_is_active', b === f); });
      }
      if (s && !s.disabled) {
        st.size = s.getAttribute('data-size');
        st.qty = Math.min(st.qty, maxQty());
        sizes.classList.remove('hanif_sizes_error');
        qsa('[data-size]', sizes).forEach(function (b) { b.classList.toggle('hanif_is_active', b === s); });
        refresh();
      }
    });
    minus.addEventListener('click', function () { if (st.qty > 1) { st.qty--; refresh(); } });
    plus.addEventListener('click', function () {
      if (st.qty < maxQty()) { st.qty++; refresh(); } else toast('Jumlah maksimal sesuai stok: ' + maxQty() + ' pcs.', 'error');
    });

    function addToCart() {
      if (!st.size) {
        sizes.classList.add('hanif_sizes_error');
        sizes.scrollIntoView({ behavior: 'smooth', block: 'center' });
        toast('Pilih ukuran terlebih dahulu.', 'error');
        return false;
      }
      var r = H.cart.add(p.id, st.size, st.color, st.qty);
      toast(r.msg, r.ok ? 'success' : 'error');
      return r.ok;
    }
    $('hanif_btn_add').addEventListener('click', addToCart);
    $('hanif_btn_buy').addEventListener('click', function () { if (addToCart()) window.location.href = 'keranjang.html'; });
    refresh();

    // rekomendasi: kategori sama dulu, sisanya menyusul
    var rec = H.products.filter(function (x) { return x.id !== p.id; }).map(function (x) {
      var shared = x.kategori.filter(function (k) { return p.kategori.indexOf(k) > -1; }).length;
      return { p: x, s: shared };
    }).sort(function (a, b) { return b.s - a.s || a.p.id - b.p.id; }).slice(0, 4).map(function (x) { return x.p; });
    var recEl = $('hanif_rec_grid');
    if (recEl) renderGrid(recEl, rec);
  }

  // 8. Panduan ukuran: kalkulator rekomendasi ukuran
  function initSizeCalc() {
    var form = $('hanif_size_form');
    if (!form) return;
    var out = $('hanif_size_result');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var t = parseFloat(form.elements['tinggi'].value), b = parseFloat(form.elements['berat'].value);
      if (!(t >= 140 && t <= 210) || !(b >= 35 && b <= 150)) {
        out.hidden = false;
        out.innerHTML = '<strong>Data belum valid.</strong> Masukkan tinggi 140-210 cm dan berat 35-150 kg.';
        toast('Periksa kembali tinggi dan berat badan.', 'error');
        return;
      }
      var idx = b < 55 ? 0 : b < 66 ? 1 : b < 76 ? 2 : b < 89 ? 3 : 4;   // berdasarkan berat
      if (t >= 178) idx += 1; else if (t <= 155) idx -= 1;                // koreksi tinggi
      idx = Math.max(0, Math.min(4, idx));
      var ukuran = H.sizes[idx];
      out.hidden = false;
      out.innerHTML = 'Rekomendasi ukuran Anda: <strong>' + ukuran + '</strong>. Ini hanya perkiraan; bila ragu atau menyukai tampilan lebih longgar, pilih satu ukuran di atasnya. <a href="produk.html" class="hanif_link_arrow">Lihat produk</a>';
    });
  }

  // 9. Formulir kontak
  function fieldError(field, msg) {
    var wrap = field.closest('.hanif_field');
    wrap.querySelector('.hanif_error').textContent = msg || '';
    wrap.classList.toggle('hanif_field_error', !!msg);
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }
  function initContact() {
    var form = $('hanif_contact_form');
    if (!form) return;
    var ok = $('hanif_contact_success');
    var rules = {
      nama: function (v) { return v.length < 3 ? 'Nama lengkap minimal 3 karakter.' : ''; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Format email tidak valid, contoh nama@email.com.'; },
      subjek: function (v) { return v.length < 5 ? 'Subjek minimal 5 karakter.' : ''; },
      pesan: function (v) { return v.length < 20 ? 'Pesan minimal 20 karakter (saat ini ' + v.length + ').' : ''; }
    };
    Object.keys(rules).forEach(function (n) {
      form.elements[n].addEventListener('blur', function () { fieldError(form.elements[n], rules[n](form.elements[n].value.trim())); });
      form.elements[n].addEventListener('input', function () { if (form.elements[n].closest('.hanif_field_error')) fieldError(form.elements[n], rules[n](form.elements[n].value.trim())); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      ok.hidden = true;
      var valid = true, first = null;
      Object.keys(rules).forEach(function (n) {
        var f = form.elements[n];
        if (!fieldError(f, rules[n](f.value.trim()))) { valid = false; if (!first) first = f; }
      });
      if (!valid) { toast('Formulir belum lengkap. Periksa kolom yang ditandai.', 'error'); first.focus(); return; }
      var f = form.elements;
      var nama = f['nama'].value.trim();
      var subjek = f['subjek'].value.trim();
      var teks = 'Halo NIFSTORE, saya ' + nama + ' (' + f['email'].value.trim() + ').\n\nSubjek: ' + subjek + '\n\n' + f['pesan'].value.trim();
      var via = (e.submitter && e.submitter.getAttribute('data-via')) || 'wa';
      var url = via === 'email'
        ? 'mailto:' + H.toko.email + '?subject=' + encodeURIComponent(subjek) + '&body=' + encodeURIComponent(teks)
        : 'https://wa.me/' + H.toko.wa + '?text=' + encodeURIComponent(teks);
      var nm = via === 'email' ? 'email' : 'WhatsApp';
      form.reset();
      ok.hidden = false;
      ok.innerHTML = '<strong>Terima kasih, ' + H.esc(nama) + '.</strong> ' + nm + ' dibuka dengan pesan Anda yang sudah terisi, tinggal tekan kirim. Kalau tidak terbuka, <a href="' + url + '" target="_blank" rel="noopener"><u>klik di sini</u></a>.';
      ok.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      if (via === 'email') { window.location.href = url; } else { window.open(url, '_blank', 'noopener'); }
      toast('Pesan siap dikirim lewat ' + nm + '.', 'success');
    });
  }

  // Riwayat pesanan & struk
  function tanggal(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '-';
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) + ', ' +
      d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':') + ' WIB';
  }

  function strukHtml(o) {
    var T = H.toko;
    var rows = o.items.map(function (it) {
      return '<tr><td>' + H.esc(it.nama) + '<small>' + H.esc(it.warna) + ' &middot; ' + H.esc(it.ukuran) + '</small></td><td class="hanif_r">' + it.qty + '</td><td class="hanif_r">' + H.rupiah(it.harga) + '</td><td class="hanif_r">' + H.rupiah(it.harga * it.qty) + '</td></tr>';
    }).join('');
    return '<div class="hanif_struk_head"><img src="assets/icons/logo.png" alt="" width="34" height="46"><h2>NIFSTORE</h2>' +
      '<p>' + H.esc(T.alamat) + '</p><p>' + T.waTampil + ' &middot; ' + T.email + '</p></div>' +
      '<div class="hanif_struk_meta"><div><span>No. Pesanan</span><strong>' + H.esc(o.no) + '</strong></div>' +
      '<div><span>Tanggal</span><strong>' + tanggal(o.tgl) + '</strong></div>' +
      '<div><span>Pembeli</span><strong>' + H.esc(o.buyer.nama) + '</strong></div>' +
      '<div><span>WhatsApp</span><strong>' + H.esc(o.buyer.wa) + '</strong></div>' +
      '<div class="hanif_struk_full"><span>Alamat kirim</span><strong>' + H.esc(o.buyer.alamat) + '</strong></div>' +
      '<div><span>Pembayaran</span><strong>' + H.esc(o.buyer.bayar) + '</strong></div>' +
      '<div><span>Status</span><strong>' + H.esc(o.status) + '</strong></div></div>' +
      '<table class="hanif_struk_table"><thead><tr><th>Produk</th><th class="hanif_r">Qty</th><th class="hanif_r">Harga</th><th class="hanif_r">Jumlah</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<div class="hanif_struk_total"><div><span>Subtotal</span><span>' + H.rupiah(o.subtotal) + '</span></div>' +
      '<div><span>Ongkir</span><span>' + (o.ongkir === 0 ? 'Gratis' : H.rupiah(o.ongkir)) + '</span></div>' +
      '<div class="hanif_struk_grand"><span>Total</span><span>' + H.rupiah(o.total) + '</span></div></div>' +
      '<p class="hanif_struk_foot">Terima kasih sudah berbelanja di NIFSTORE.<br>Struk ini adalah bukti pemesanan. Pembayaran dikonfirmasi oleh admin lewat WhatsApp.</p>';
  }

  function cetakStruk(o) {
    var box = $('hanif_struk');
    if (!box) return;
    box.innerHTML = strukHtml(o);
    document.body.classList.add('hanif_print_struk');
    var done = function () { document.body.classList.remove('hanif_print_struk'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    window.print();
  }

  function initHistory() {
    var list = $('hanif_history_list');
    if (!list || !H.orders) return;
    var empty = $('hanif_history_empty'), tools = $('hanif_history_tools');

    function render() {
      var data = H.orders.all();
      empty.hidden = data.length > 0;
      tools.hidden = data.length === 0;
      list.innerHTML = data.map(function (o) {
        var selesai = o.status === 'Selesai';
        var thumbs = o.items.slice(0, 4).map(function (it) {
          return '<img src="' + H.esc(it.gambar) + '" alt="' + H.esc(it.nama) + '" loading="lazy" width="56" height="64">';
        }).join('');
        var lines = o.items.map(function (it) {
          return '<li><span>' + H.esc(it.nama) + ' <small>' + H.esc(it.warna) + ' &middot; ' + H.esc(it.ukuran) + ' &middot; ' + it.qty + ' x ' + H.rupiah(it.harga) + '</small></span><strong>' + H.rupiah(it.harga * it.qty) + '</strong></li>';
        }).join('');
        var wa = 'https://wa.me/' + H.toko.wa + '?text=' + encodeURIComponent('Halo NIFSTORE, saya mau menanyakan pesanan ' + o.no + ' atas nama ' + o.buyer.nama + '.');
        return '<article class="hanif_order_card" data-no="' + H.esc(o.no) + '">' +
          '<header><div><h3>' + H.esc(o.no) + '</h3><p>' + tanggal(o.tgl) + '</p></div>' +
          '<span class="hanif_status' + (selesai ? ' hanif_status_ok' : '') + '">' + H.esc(o.status) + '</span></header>' +
          '<div class="hanif_order_thumbs">' + thumbs + (o.items.length > 4 ? '<span>+' + (o.items.length - 4) + '</span>' : '') + '</div>' +
          '<ul class="hanif_order_list">' + lines + '</ul>' +
          '<div class="hanif_summary_row hanif_summary_total"><span>Total</span><span>' + H.rupiah(o.total) + '</span></div>' +
          '<div class="hanif_order_actions">' +
          '<button type="button" class="hanif_button hanif_button_sm" data-act="struk">' + H.icon('printer', 'hanif_icon_sm') + ' Cetak struk</button>' +
          '<a class="hanif_button hanif_button_sm hanif_button_outline" href="' + wa + '" target="_blank" rel="noopener">' + H.icon('chat', 'hanif_icon_sm') + ' Tanya admin</a>' +
          '<button type="button" class="hanif_button hanif_button_sm hanif_button_outline" data-act="status">' + (selesai ? 'Tandai belum selesai' : 'Tandai selesai') + '</button>' +
          '<button type="button" class="hanif_button hanif_button_sm hanif_button_outline" data-act="hapus">' + H.icon('trash', 'hanif_icon_sm') + ' Hapus</button>' +
          '</div></article>';
      }).join('');
    }

    list.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]');
      if (!b) return;
      var no = b.closest('.hanif_order_card').getAttribute('data-no');
      var o = H.orders.all().filter(function (x) { return x.no === no; })[0];
      if (!o) return;
      if (b.dataset.act === 'struk') cetakStruk(o);
      if (b.dataset.act === 'status') { H.orders.setStatus(no, o.status === 'Selesai' ? 'Menunggu konfirmasi' : 'Selesai'); render(); }
      if (b.dataset.act === 'hapus') {
        if (window.confirm('Hapus pesanan ' + no + ' dari riwayat?')) { H.orders.remove(no); render(); toast('Pesanan dihapus dari riwayat.', 'success'); }
      }
    });
    $('hanif_history_clear').addEventListener('click', function () {
      if (window.confirm('Hapus seluruh riwayat pesanan di perangkat ini?')) { H.orders.clearAll(); render(); toast('Riwayat pesanan dikosongkan.', 'success'); }
    });
    render();
  }

  // 10. Newsletter
  function initNewsletter() {
    qsa('.hanif_newsletter_form').forEach(function (form) {
      var input = qs('input[type="email"]', form), msg = qs('.hanif_newsletter_msg', form.parentNode);
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var v = input.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
          msg.textContent = 'Masukkan alamat email yang valid.';
          toast('Email tidak valid.', 'error'); input.focus(); return;
        }
        msg.textContent = 'Terima kasih! ' + v + ' terdaftar (simulasi, tidak disimpan ke server).';
        toast('Berhasil berlangganan newsletter (simulasi).', 'success');
        form.reset();
      });
    });
  }

  // jalankan semua saat halaman siap
  document.addEventListener('DOMContentLoaded', function () {
    initNav(); initSearch(); initToTop(); initQuickAdd(); initNewsletter();
    initHome(); initCatalog(); initCategories(); initDetail(); initSizeCalc(); initContact(); initHistory();
    initReveal();
    if (H.cart) H.cart.updateBadge();
  });
})();

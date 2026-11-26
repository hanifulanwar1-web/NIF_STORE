// cart.js - keranjang (localStorage), halaman keranjang, dan checkout lewat WhatsApp
(function () {
  'use strict';

  var H = window.Hanif;
  var STORAGE_KEY = 'hanif_nifstore_cart_v1';
  var ONGKIR = 15000;
  var GRATIS_ONGKIR = 300000;
  var WA_TOKO = H.toko.wa;
  var ORDERS_KEY = 'hanif_nifstore_orders_v1';
  var ordersMemory = [];
  var memory = [];               // dipakai kalau localStorage diblokir

  // simpan & ambil
  function read() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return memory.slice(); }
  }
  function write(items) {
    memory = items.slice();
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch (e) { /* tidak apa-apa */ }
    updateBadge();
    document.dispatchEvent(new CustomEvent('hanif:cart'));
  }
  // riwayat pesanan (disimpan di perangkat pembeli)
  function readOrders() {
    try {
      var arr = JSON.parse(window.localStorage.getItem(ORDERS_KEY) || '[]');
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return ordersMemory.slice(); }
  }
  function writeOrders(list) {
    ordersMemory = list.slice();
    try { window.localStorage.setItem(ORDERS_KEY, JSON.stringify(list)); } catch (e) { /* tidak apa-apa */ }
  }
  function saveOrder(order) {
    var list = readOrders();
    list.unshift(order);
    writeOrders(list.slice(0, 50));
  }
  function setOrderStatus(no, status) {
    writeOrders(readOrders().map(function (o) { if (o.no === no) o.status = status; return o; }));
  }
  function removeOrder(no) {
    writeOrders(readOrders().filter(function (o) { return o.no !== no; }));
  }
  function keyOf(id, ukuran, warna) { return id + '|' + ukuran + '|' + warna; }

  // item + data produk, qty dibatasi stok
  function items() {
    var out = [];
    read().forEach(function (it) {
      var p = H.findProduct(it.id);
      if (!p || !p.stok.hasOwnProperty(it.ukuran)) return;
      var w = H.findColor(p, it.warna);
      var max = p.stok[it.ukuran];
      var qty = Math.min(Math.max(parseInt(it.qty, 10) || 1, 1), Math.max(max, 1));
      if (max < 1) return;
      out.push({ key: keyOf(p.id, it.ukuran, w.nama), id: p.id, nama: p.nama, harga: p.harga,
        ukuran: it.ukuran, warna: w.nama, hex: w.hex, gambar: w.gambar, qty: qty, max: max });
    });
    return out;
  }
  function count() { return items().reduce(function (a, b) { return a + b.qty; }, 0); }
  function subtotal() { return items().reduce(function (a, b) { return a + b.harga * b.qty; }, 0); }
  function shipping() { var s = subtotal(); return (s === 0 || s >= GRATIS_ONGKIR) ? 0 : ONGKIR; }
  function total() { return subtotal() + shipping(); }

  // tambah, hapus, ubah qty
  function add(id, ukuran, warna, qty) {
    var p = H.findProduct(id);
    qty = parseInt(qty, 10) || 1;
    if (!p) return { ok: false, msg: 'Produk tidak ditemukan.' };
    if (!ukuran || !p.stok.hasOwnProperty(ukuran)) return { ok: false, msg: 'Pilih ukuran terlebih dahulu.' };
    var w = H.findColor(p, warna);
    var max = p.stok[ukuran];
    if (max < 1) return { ok: false, msg: 'Maaf, ukuran ' + ukuran + ' sedang habis.' };
    var list = read();
    var k = keyOf(p.id, ukuran, w.nama);
    var found = null;
    list.forEach(function (it) { if (keyOf(it.id, it.ukuran, it.warna) === k) found = it; });
    var sudah = found ? found.qty : 0;
    if (sudah + qty > max) {
      return { ok: false, msg: 'Stok tidak cukup. Maksimal ' + max + ' pcs untuk ukuran ' + ukuran + (sudah ? ' (sudah ' + sudah + ' di keranjang).' : '.') };
    }
    if (found) found.qty += qty; else list.push({ id: p.id, ukuran: ukuran, warna: w.nama, qty: qty });
    write(list);
    return { ok: true, msg: p.nama + ' (' + w.nama + ', ' + ukuran + ') ditambahkan ke keranjang.' };
  }
  function setQty(key, qty) {
    var list = read().filter(function (it) {
      if (keyOf(it.id, it.ukuran, it.warna) === key) {
        var p = H.findProduct(it.id);
        it.qty = Math.min(qty, p ? p.stok[it.ukuran] : qty);
        return it.qty > 0;
      }
      return true;
    });
    write(list);
  }
  function remove(key) {
    write(read().filter(function (it) { return keyOf(it.id, it.ukuran, it.warna) !== key; }));
  }
  function clear() { write([]); }

  function updateBadge() {
    var n = count();
    var els = document.querySelectorAll('.hanif_cart_badge');
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = n > 99 ? '99+' : n;
      els[i].setAttribute('data-kosong', n === 0 ? 'true' : 'false');
    }
  }

  H.cart = { add: add, setQty: setQty, remove: remove, clear: clear, items: items, count: count,
    subtotal: subtotal, shipping: shipping, total: total, updateBadge: updateBadge,
    ONGKIR: ONGKIR, GRATIS_ONGKIR: GRATIS_ONGKIR };
  H.orders = { all: readOrders, setStatus: setOrderStatus, remove: removeOrder, clearAll: function () { writeOrders([]); } };

  // Halaman keranjang (hanya berjalan jika elemennya ada)
  function $(id) { return document.getElementById(id); }

  function renderCart() {
    var list = $('hanif_cart_list');
    if (!list) return;
    var data = items();
    var empty = $('hanif_cart_empty'), layout = $('hanif_cart_layout');
    if (data.length === 0) { empty.hidden = false; layout.hidden = true; return; }
    empty.hidden = true; layout.hidden = false;

    list.innerHTML = data.map(function (it) {
      return '<article class="hanif_cart_item" data-key="' + H.esc(it.key) + '">' +
        '<a href="detail-produk.html?id=' + it.id + '"><img src="' + it.gambar + '" alt="' + H.esc(it.nama + ' warna ' + it.warna) + '" width="110" height="128"></a>' +
        '<div><h3><a href="detail-produk.html?id=' + it.id + '">' + H.esc(it.nama) + '</a></h3>' +
        '<div class="hanif_cart_meta"><span class="hanif_dot" style="background:' + it.hex + '"></span>' + H.esc(it.warna) + ' &middot; Ukuran ' + it.ukuran + ' &middot; ' + H.rupiah(it.harga) + '</div>' +
        '<div class="hanif_qty" role="group" aria-label="Jumlah ' + H.esc(it.nama) + '">' +
        '<button type="button" data-act="kurang" aria-label="Kurangi jumlah"' + (it.qty <= 1 ? ' disabled' : '') + '>' + H.icon('minus', 'hanif_icon_sm') + '</button>' +
        '<output aria-live="polite">' + it.qty + '</output>' +
        '<button type="button" data-act="tambah" aria-label="Tambah jumlah"' + (it.qty >= it.max ? ' disabled' : '') + '>' + H.icon('plus', 'hanif_icon_sm') + '</button></div></div>' +
        '<div class="hanif_cart_price"><strong>' + H.rupiah(it.harga * it.qty) + '</strong>' +
        '<button type="button" class="hanif_remove" data-act="hapus">' + H.icon('trash', 'hanif_icon_sm') + ' Hapus</button></div></article>';
    }).join('');

    var sub = subtotal(), ship = shipping();
    $('hanif_sum_count').textContent = count() + ' barang';
    $('hanif_sum_sub').textContent = H.rupiah(sub);
    var shipEl = $('hanif_sum_ship');
    shipEl.textContent = ship === 0 ? 'Gratis' : H.rupiah(ship);
    shipEl.className = ship === 0 ? 'hanif_free' : '';
    $('hanif_sum_total').textContent = H.rupiah(total());
    var hint = $('hanif_sum_hint');
    hint.textContent = ship === 0
      ? 'Selamat! Anda mendapatkan gratis ongkir.'
      : 'Belanja ' + H.rupiah(GRATIS_ONGKIR - sub) + ' lagi untuk gratis ongkir.';
  }

  function initCartPage() {
    var list = $('hanif_cart_list');
    if (!list) return;
    renderCart();
    document.addEventListener('hanif:cart', renderCart);

    // satu listener untuk tombol + - hapus
    list.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-act]');
      if (!btn) return;
      var row = btn.closest('.hanif_cart_item');
      var key = row.getAttribute('data-key');
      var it = items().filter(function (x) { return x.key === key; })[0];
      if (!it) return;
      var act = btn.getAttribute('data-act');
      if (act === 'tambah') setQty(key, it.qty + 1);
      if (act === 'kurang') setQty(key, it.qty - 1);
      if (act === 'hapus') { remove(key); H.ui.toast(it.nama + ' dihapus dari keranjang.', 'info'); }
    });

    var clearBtn = $('hanif_cart_clear');
    if (clearBtn) clearBtn.addEventListener('click', function () {
      clear(); H.ui.toast('Keranjang dikosongkan.', 'info');
    });

    initCheckout();
  }

  // validasi form & kirim ke whatsapp
  var METODE = {
    transfer: 'Transfer Bank',
    ewallet: 'E-Wallet',
    cod: 'Bayar di Tempat (COD)'
  };

  function setError(field, msg) {
    var wrap = field.closest('.hanif_field');
    var err = wrap.querySelector('.hanif_error');
    if (err) err.textContent = msg || '';
    wrap.classList.toggle('hanif_field_error', !!msg);
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }

  function validateCheckout(form) {
    var nama = form.elements['nama'], wa = form.elements['whatsapp'], alamat = form.elements['alamat'];
    var ok = true, first = null;
    function mark(field, msg) { if (!setError(field, msg)) { ok = false; if (!first) first = field; } }

    var vNama = nama.value.trim();
    mark(nama, vNama.length < 3 ? 'Nama lengkap minimal 3 karakter.' : (/^[A-Za-z .'-]+$/.test(vNama) ? '' : 'Nama hanya boleh berisi huruf.'));
    var vWa = wa.value.replace(/[\s-]/g, '');
    mark(wa, /^(\+62|62|0)8[0-9]{8,12}$/.test(vWa) ? '' : 'Masukkan nomor WhatsApp yang valid, contoh 081234567890.');
    mark(alamat, alamat.value.trim().length < 15 ? 'Alamat minimal 15 karakter (jalan, nomor, kecamatan, kota).' : '');
    if (!form.elements['pembayaran'].value) { ok = false; H.ui.toast('Pilih metode pembayaran terlebih dahulu.', 'error'); }
    if (first) first.focus();
    return ok;
  }

  function initCheckout() {
    var form = $('hanif_checkout_form');
    if (!form) return;

    // error hilang saat diketik ulang
    ['nama', 'whatsapp', 'alamat'].forEach(function (n) {
      form.elements[n].addEventListener('input', function () { setError(form.elements[n], ''); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (count() === 0) { H.ui.toast('Keranjang masih kosong.', 'error'); return; }
      if (!validateCheckout(form)) {
        H.ui.toast('Data pembeli belum lengkap. Periksa kembali formulir.', 'error');
        return;
      }
      var data = items();
      var noPesanan = 'NIF-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);
      var buyer = {
        nama: form.elements['nama'].value.trim(),
        wa: form.elements['whatsapp'].value.trim(),
        alamat: form.elements['alamat'].value.trim(),
        bayar: METODE[form.elements['pembayaran'].value]
      };
      var waUrl = 'https://wa.me/' + WA_TOKO + '?text=' + encodeURIComponent(buatPesan(noPesanan, buyer, data));

      var html = '<p>Pesanan Anda belum terkirim. Tekan tombol <strong>Kirim lewat WhatsApp</strong>, lalu tekan kirim di WhatsApp agar admin bisa memprosesnya.</p>' +
        '<p><strong>No. Pesanan:</strong> ' + noPesanan + '<br><strong>Pembeli:</strong> ' + H.esc(buyer.nama) +
        '<br><strong>WhatsApp:</strong> ' + H.esc(buyer.wa) +
        '<br><strong>Alamat:</strong> ' + H.esc(buyer.alamat) +
        '<br><strong>Pembayaran:</strong> ' + buyer.bayar + '</p>' +
        '<ul class="hanif_order_list">' + data.map(function (it) {
          return '<li><span>' + H.esc(it.nama) + ' <small>' + H.esc(it.warna) + ' &middot; ' + it.ukuran + ' &middot; ' + it.qty + ' x ' + H.rupiah(it.harga) + '</small></span><strong>' + H.rupiah(it.harga * it.qty) + '</strong></li>';
        }).join('') + '</ul>' +
        '<div class="hanif_summary_row"><span>Subtotal</span><span>' + H.rupiah(subtotal()) + '</span></div>' +
        '<div class="hanif_summary_row"><span>Ongkir</span><span>' + (shipping() === 0 ? 'Gratis' : H.rupiah(shipping())) + '</span></div>' +
        '<div class="hanif_summary_row hanif_summary_total"><span>Total</span><span>' + H.rupiah(total()) + '</span></div>';

      H.ui.modal({
        title: 'Ringkasan pesanan', html: html,
        actions: [
          { label: 'Kirim lewat WhatsApp', primary: true, href: waUrl, onClick: function () {
              // keranjang dikosongkan setelah tombol ditekan, jadi kalau modal ditutup duluan datanya aman
              saveOrder({
                no: noPesanan, tgl: new Date().toISOString(), status: 'Menunggu konfirmasi',
                buyer: buyer, ongkir: shipping(), subtotal: subtotal(), total: total(),
                items: data.map(function (it) { return { id: it.id, nama: it.nama, warna: it.warna, ukuran: it.ukuran, qty: it.qty, harga: it.harga, gambar: it.gambar }; })
              });
              clear(); form.reset();
              H.ui.toast('WhatsApp dibuka. Tekan kirim di sana untuk menyelesaikan pesanan.', 'success');
            } },
          { label: 'Kembali ke keranjang' }
        ]
      });
    });
  }

  // isi chat yang dikirim ke penjual
  function buatPesan(noPesanan, buyer, data) {
    var baris = ['Halo NIFSTORE, saya mau pesan.', '', 'No. Pesanan: ' + noPesanan, ''];
    data.forEach(function (it, i) {
      baris.push((i + 1) + '. ' + it.nama);
      baris.push('   ' + it.warna + ', ukuran ' + it.ukuran + ', ' + it.qty + ' x ' + H.rupiah(it.harga) + ' = ' + H.rupiah(it.harga * it.qty));
    });
    baris.push('', 'Subtotal: ' + H.rupiah(subtotal()));
    baris.push('Ongkir: ' + (shipping() === 0 ? 'Gratis' : H.rupiah(shipping())));
    baris.push('Total: ' + H.rupiah(total()), '');
    baris.push('Nama: ' + buyer.nama);
    baris.push('No. WhatsApp: ' + buyer.wa);
    baris.push('Alamat: ' + buyer.alamat);
    baris.push('Pembayaran: ' + buyer.bayar);
    return baris.join('\n');
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateBadge();
    initCartPage();
  });
  // badge ikut berubah kalau keranjang diubah di tab lain
  window.addEventListener('storage', function (e) { if (e.key === STORAGE_KEY) { updateBadge(); renderCart(); } });
})();

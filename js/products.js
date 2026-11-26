// products.js - data produk, ikon, dan fungsi bantu. Hasilnya dipakai lewat window.Hanif
(function () {
  'use strict';

  // ikon svg
  var ICON_PATHS = {
    plus: '<path d="M5 12h14M12 5v14"/>',
    minus: '<path d="M5 12h14"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    alert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    cart: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>',
    printer: '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>',
    chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>'
  };
  function icon(name, cls) {
    return '<svg class="hanif_icon ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICON_PATHS[name] || '') + '</svg>';
  }

  // data kategori & produk
  var CATEGORIES = [
    {
      "slug": "kaos-pria",
      "nama": "Kaos Pria",
      "deskripsi": "Potongan maskulin yang nyaman untuk aktivitas harian, dari basic hingga statement.",
      "gambar": "assets/images/kategori-kaos-pria.jpg"
    },
    {
      "slug": "kaos-wanita",
      "nama": "Kaos Wanita",
      "deskripsi": "Siluet fitted dan cropped dengan bahan lembut, mudah dipadukan dengan outfit apa pun.",
      "gambar": "assets/images/kategori-kaos-wanita.jpg"
    },
    {
      "slug": "oversized",
      "nama": "Oversized T-Shirt",
      "deskripsi": "Potongan longgar dengan bahu turun untuk tampilan santai yang tetap rapi.",
      "gambar": "assets/images/kategori-oversized.jpg"
    },
    {
      "slug": "basic",
      "nama": "Basic T-Shirt",
      "deskripsi": "Kaos polos esensial berbahan katun pilihan sebagai fondasi lemari pakaian.",
      "gambar": "assets/images/kategori-basic.jpg"
    },
    {
      "slug": "graphic",
      "nama": "Graphic T-Shirt",
      "deskripsi": "Desain grafis orisinal NIFSTORE yang minimalis dan mudah dipakai setiap hari.",
      "gambar": "assets/images/kategori-graphic.jpg"
    },
    {
      "slug": "streetwear",
      "nama": "Streetwear",
      "deskripsi": "Karakter urban dengan siluet boxy, grafis tegas, dan detail yang berani.",
      "gambar": "assets/images/kategori-streetwear.jpg"
    }
  ];
  var PRODUCTS = [
    {
      "id": 1,
      "slug": "essential-oversized-tee",
      "nama": "Essential Oversized Tee",
      "harga": 189000,
      "kategori": [
        "kaos-pria",
        "oversized"
      ],
      "label": "best",
      "warna": [
        {
          "nama": "Hitam",
          "hex": "#17171a",
          "gambar": "assets/images/essential-oversized-1.jpg"
        },
        {
          "nama": "Putih",
          "hex": "#f6f4ef",
          "gambar": "assets/images/essential-oversized-2.jpg"
        },
        {
          "nama": "Cokelat",
          "hex": "#6b4a38",
          "gambar": "assets/images/essential-oversized-2.jpg"
        }
      ],
      "galeri": [
        "assets/images/essential-oversized-1.jpg",
        "assets/images/essential-oversized-2.jpg"
      ],
      "stok": {
        "S": 12,
        "M": 24,
        "L": 18,
        "XL": 9,
        "XXL": 5
      },
      "deskripsi": "Kaos oversized dengan bahu turun dan badan lebar yang jatuh sempurna. Bahan tebal namun tetap adem, tersedia dalam warna hitam, putih, dan cokelat.",
      "bahan": [
        "Cotton Combed 20s, 220 gsm",
        "Jahitan rantai pada bahu dan kerah",
        "Rib kerah tebal, tidak mudah melar",
        "Logo kecil di dada"
      ]
    },
    {
      "id": 2,
      "slug": "classic-black-tshirt",
      "nama": "Classic Black T-Shirt",
      "harga": 129000,
      "kategori": [
        "kaos-pria",
        "basic"
      ],
      "label": "best",
      "warna": [
        {
          "nama": "Hitam",
          "hex": "#17171a",
          "gambar": "assets/images/classic-black-1.jpg"
        }
      ],
      "galeri": [
        "assets/images/classic-black-1.jpg",
        "assets/images/classic-black-2.jpg"
      ],
      "stok": {
        "S": 20,
        "M": 32,
        "L": 28,
        "XL": 14,
        "XXL": 6
      },
      "deskripsi": "Kaos hitam klasik dengan potongan regular fit. Warna pekat awet, bahan lembut di kulit, dan mudah dipadukan dengan celana jeans maupun chino.",
      "bahan": [
        "Cotton Combed 30s, 160 gsm",
        "Regular fit",
        "Warna tahan luntur setelah pencucian berulang",
        "Label woven NIFSTORE di bagian hem"
      ]
    },
    {
      "id": 3,
      "slug": "premium-white-tee",
      "nama": "Premium White Tee",
      "harga": 139000,
      "kategori": [
        "kaos-wanita",
        "kaos-pria",
        "basic"
      ],
      "label": null,
      "warna": [
        {
          "nama": "Putih",
          "hex": "#f6f4ef",
          "gambar": "assets/images/premium-white-1.jpg"
        }
      ],
      "galeri": [
        "assets/images/premium-white-1.jpg",
        "assets/images/premium-white-2.jpg"
      ],
      "stok": {
        "S": 15,
        "M": 26,
        "L": 22,
        "XL": 10,
        "XXL": 0
      },
      "deskripsi": "Kaos putih premium unisex dengan kain padat sehingga tidak menerawang. Siluet bersih dan rapi, cocok dipakai sendiri maupun sebagai layer.",
      "bahan": [
        "Cotton Combed 30s, 180 gsm",
        "Kain padat dan tidak menerawang",
        "Unisex relaxed fit",
        "Cuci terpisah untuk warna putih"
      ]
    },
    {
      "id": 4,
      "slug": "urban-streetwear-tee",
      "nama": "Urban Streetwear Tee",
      "harga": 219000,
      "kategori": [
        "kaos-pria",
        "streetwear",
        "graphic"
      ],
      "label": "baru",
      "warna": [
        {
          "nama": "Hitam",
          "hex": "#17171a",
          "gambar": "assets/images/urban-streetwear-1.jpg"
        },
        {
          "nama": "Putih",
          "hex": "#f6f4ef",
          "gambar": "assets/images/urban-streetwear-2.jpg"
        }
      ],
      "galeri": [
        "assets/images/urban-streetwear-1.jpg",
        "assets/images/urban-streetwear-2.jpg",
        "assets/images/urban-streetwear-3.jpg"
      ],
      "stok": {
        "S": 8,
        "M": 15,
        "L": 14,
        "XL": 7,
        "XXL": 0
      },
      "deskripsi": "Kaos streetwear boxy dengan grafis URBAN berukuran besar di bagian dada. Sablon plastisol bertekstur halus dengan detail garis tegas khas budaya jalanan.",
      "bahan": [
        "Cotton Combed 20s, 240 gsm",
        "Sablon plastisol premium",
        "Boxy oversized fit",
        "Hem dan lengan dengan jahitan ganda"
      ]
    },
    {
      "id": 5,
      "slug": "minimalist-graphic-tee",
      "nama": "Minimalist Graphic Tee",
      "harga": 169000,
      "kategori": [
        "kaos-wanita",
        "graphic"
      ],
      "label": "baru",
      "warna": [
        {
          "nama": "Hitam",
          "hex": "#17171a",
          "gambar": "assets/images/minimalist-graphic-1.jpg"
        }
      ],
      "galeri": [
        "assets/images/minimalist-graphic-1.jpg"
      ],
      "stok": {
        "S": 14,
        "M": 20,
        "L": 16,
        "XL": 6,
        "XXL": 3
      },
      "deskripsi": "Kaos wanita oversized dengan ilustrasi pita renda di bagian dada. Manis dan feminin, tetap simpel dipadukan dengan rok maupun celana.",
      "bahan": [
        "Cotton Combed 30s, 170 gsm",
        "Oversized fit, bahu turun",
        "Sablon pita bertekstur lembut",
        "Rib kerah rendah"
      ]
    },
    {
      "id": 6,
      "slug": "vintage-washed-tshirt",
      "nama": "Vintage Washed T-Shirt",
      "harga": 199000,
      "kategori": [
        "kaos-pria",
        "streetwear"
      ],
      "label": "baru",
      "warna": [
        {
          "nama": "Charcoal",
          "hex": "#3b3d42",
          "gambar": "assets/images/vintage-washed-1.jpg"
        }
      ],
      "galeri": [
        "assets/images/vintage-washed-1.jpg"
      ],
      "stok": {
        "S": 10,
        "M": 18,
        "L": 17,
        "XL": 8,
        "XXL": 4
      },
      "deskripsi": "Kaos polos dengan efek acid wash yang memberi kesan vintage sejak pertama dipakai. Tiap potong punya pola warna yang sedikit berbeda.",
      "bahan": [
        "Cotton Combed 24s, 200 gsm",
        "Proses garment acid wash",
        "Boxy oversized fit",
        "Warna dapat sedikit berbeda antar unit"
      ]
    },
    {
      "id": 7,
      "slug": "basic-cotton-tee",
      "nama": "Basic Cotton Tee",
      "harga": 119000,
      "kategori": [
        "kaos-wanita",
        "basic"
      ],
      "label": "best",
      "warna": [
        {
          "nama": "Mocha",
          "hex": "#8b6f5c",
          "gambar": "assets/images/basic-cotton-1.jpg"
        }
      ],
      "galeri": [
        "assets/images/basic-cotton-1.jpg"
      ],
      "stok": {
        "S": 18,
        "M": 30,
        "L": 24,
        "XL": 8,
        "XXL": 0
      },
      "deskripsi": "Kaos basic lengan panjang dengan potongan longgar dan hem belakang sedikit lebih panjang. Polos, nyaman, dan mudah dipadukan.",
      "bahan": [
        "Cotton Combed 30s, 150 gsm",
        "Lengan panjang, relaxed fit",
        "Hem belakang lebih panjang",
        "Rib kerah halus"
      ]
    },
    {
      "id": 8,
      "slug": "signature-tee",
      "nama": "Signature Tee",
      "harga": 179000,
      "kategori": [
        "kaos-pria",
        "streetwear"
      ],
      "label": "best",
      "warna": [
        {
          "nama": "Hitam",
          "hex": "#17171a",
          "gambar": "assets/images/signature-1.jpg"
        }
      ],
      "galeri": [
        "assets/images/signature-1.jpg"
      ],
      "stok": {
        "S": 16,
        "M": 28,
        "L": 25,
        "XL": 12,
        "XXL": 7
      },
      "deskripsi": "Kaos hitam bersih dengan bordir logo kecil di dada kiri. Siluet boxy yang rapi dan mudah dipadukan, mewakili identitas brand kami.",
      "bahan": [
        "Cotton Combed 24s, 200 gsm",
        "Boxy regular fit",
        "Bordir logo di dada kiri",
        "Label signature di bagian hem"
      ]
    },
    {
      "id": 9,
      "slug": "soft-touch-cropped-tee",
      "nama": "Soft Touch Cropped Tee",
      "harga": 149000,
      "kategori": [
        "kaos-wanita",
        "basic"
      ],
      "label": "baru",
      "warna": [
        {
          "nama": "Krem",
          "hex": "#e3d6c0",
          "gambar": "assets/images/soft-touch-cropped-1.jpg"
        },
        {
          "nama": "Pink",
          "hex": "#e3a6b8",
          "gambar": "assets/images/soft-touch-cropped-1.jpg"
        },
        {
          "nama": "Hitam",
          "hex": "#17171a",
          "gambar": "assets/images/soft-touch-cropped-1.jpg"
        },
        {
          "nama": "Putih",
          "hex": "#f6f4ef",
          "gambar": "assets/images/soft-touch-cropped-2.jpg"
        }
      ],
      "galeri": [
        "assets/images/soft-touch-cropped-1.jpg",
        "assets/images/soft-touch-cropped-2.jpg"
      ],
      "stok": {
        "S": 12,
        "M": 19,
        "L": 15,
        "XL": 4,
        "XXL": 0
      },
      "deskripsi": "Kaos cropped dengan tali serut di sisi badan yang bisa diatur sesuai selera. Bahan ringan dan lembut, tersedia dalam beberapa pilihan warna.",
      "bahan": [
        "Cotton Combed 30s, 160 gsm",
        "Cropped fit dengan tali serut di sisi",
        "Bahan lembut dan ringan",
        "Pilihan warna krem, pink, hitam, dan putih"
      ]
    },
    {
      "id": 10,
      "slug": "sunset-graphic-oversized-tee",
      "nama": "Sunset Graphic Oversized Tee",
      "harga": 209000,
      "kategori": [
        "kaos-wanita",
        "oversized",
        "graphic"
      ],
      "label": "baru",
      "warna": [
        {
          "nama": "Charcoal",
          "hex": "#3b3d42",
          "gambar": "assets/images/sunset-graphic-1.jpg"
        }
      ],
      "galeri": [
        "assets/images/sunset-graphic-1.jpg"
      ],
      "stok": {
        "S": 9,
        "M": 17,
        "L": 13,
        "XL": 6,
        "XXL": 2
      },
      "deskripsi": "Kaos oversized dengan efek washed dan sablon sunset warna-warni bergaya sapuan kuas. Potongan longgar untuk suasana santai.",
      "bahan": [
        "Cotton Combed 20s, 220 gsm",
        "Oversized fit, bahu turun",
        "Efek garment wash",
        "Sablon water-based multi warna"
      ]
    },
    {
      "id": 11,
      "slug": "stripe-street-tee",
      "nama": "Stripe Street Tee",
      "harga": 189000,
      "kategori": [
        "kaos-pria",
        "streetwear"
      ],
      "label": null,
      "warna": [
        {
          "nama": "Hitam",
          "hex": "#17171a",
          "gambar": "assets/images/stripe-street-1.jpg"
        },
        {
          "nama": "Putih",
          "hex": "#f6f4ef",
          "gambar": "assets/images/stripe-street-1.jpg"
        }
      ],
      "galeri": [
        "assets/images/stripe-street-1.jpg"
      ],
      "stok": {
        "S": 11,
        "M": 21,
        "L": 19,
        "XL": 9,
        "XXL": 5
      },
      "deskripsi": "Kaos dengan motif garis vertikal dan kerah kontras yang memberi karakter sporty. Kasual namun tetap punya identitas streetwear.",
      "bahan": [
        "Cotton Combed 24s, 190 gsm",
        "Regular fit",
        "Motif garis vertikal",
        "Kerah rib kontras"
      ]
    },
    {
      "id": 12,
      "slug": "pocket-heavy-tee",
      "nama": "Pocket Heavy Tee",
      "harga": 149000,
      "kategori": [
        "kaos-pria",
        "basic"
      ],
      "label": null,
      "warna": [
        {
          "nama": "Hitam",
          "hex": "#17171a",
          "gambar": "assets/images/pocket-heavy-1.jpg"
        },
        {
          "nama": "Navy",
          "hex": "#1f2a44",
          "gambar": "assets/images/pocket-heavy-1.jpg"
        }
      ],
      "galeri": [
        "assets/images/pocket-heavy-1.jpg"
      ],
      "stok": {
        "S": 13,
        "M": 22,
        "L": 20,
        "XL": 11,
        "XXL": 4
      },
      "deskripsi": "Kaos heavyweight dengan saku dada fungsional. Kain tebal dan kokoh memberi tampilan rapi serta tahan lama untuk dipakai berulang.",
      "bahan": [
        "Cotton Combed 20s, 230 gsm",
        "Saku dada dengan jahitan kotak",
        "Heavyweight regular fit",
        "Rib kerah tebal"
      ]
    }
  ];
  var SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

  // fungsi bantu
  function rupiah(n) {
    return 'Rp' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function findProduct(id) {
    id = parseInt(id, 10);
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i];
    return null;
  }
  function findCategory(slug) {
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].slug === slug) return CATEGORIES[i];
    return null;
  }
  function findColor(p, nama) {
    for (var i = 0; i < p.warna.length; i++) if (p.warna[i].nama === nama) return p.warna[i];
    return p.warna[0];
  }
  function totalStock(p) {
    var t = 0;
    for (var k in p.stok) t += p.stok[k];
    return t;
  }
  function param(name) {
    try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; }
  }

  var TOKO = {
    nama: 'NIFSTORE',
    wa: '6285722238578', waTampil: '0857-2223-8578',
    email: 'nifstoree1@gmail.com',
    alamat: 'Jl. Purbaratu, Kp. Pagergunung, RT 002/RW 003, Kelurahan Singkup, Kecamatan Purbaratu, Kota Tasikmalaya, Jawa Barat 46196',
    jam: 'Senin - Sabtu, 09.00 - 17.00 WIB',
    instagram: 'https://www.instagram.com/nif_store1',
    tiktok: 'https://www.tiktok.com/@nif_store1',
    youtube: 'https://www.youtube.com/@nifstore'
  };

  window.Hanif = {
    toko: TOKO,
    icon: icon, icons: ICON_PATHS,
    categories: CATEGORIES, products: PRODUCTS, sizes: SIZES,
    rupiah: rupiah, esc: esc, param: param,
    findProduct: findProduct, findCategory: findCategory, findColor: findColor, totalStock: totalStock
  };
})();

export const snippets = [
  {
    "id": 1,
    "title": "Type Coercion in Addition",
    "context": "Fungsi ini seharusnya menghitung total dari dua angka dan menampilkan hasilnya. Temukan bug yang menyebabkan hasil tidak sesuai ekspektasi.",
    "code": "function add(a, b) {\n  return a + b\n}\n\nconst total = add(5, \"10\")\nconsole.log(\"Total:\", total)",
    "max_score": 100,
    "bug_descriptions": [
      {
        "id": "b1",
        "description": "JavaScript type coercion: parameter b dikirim sebagai string \"10\", operator + melakukan concatenation menghasilkan \"510\" bukan 15",
        "points": 50
      },
      {
        "id": "b2",
        "description": "Tidak ada validasi tipe data parameter. Seharusnya parameter dipastikan bertipe number sebelum operasi penjumlahan",
        "points": 50
      }
    ]
  },
  {
    "id": 2,
    "title": "Closure Trap in Loop with setTimeout",
    "context": "Kode ini seharusnya menampilkan angka 1 sampai 5 secara berurutan setiap 100ms. Tetapi hasil yang keluar tidak seperti yang diharapkan. Temukan bugnya.",
    "code": "for (var i = 1; i <= 5; i++) {\n  setTimeout(function () {\n    console.log(i)\n  }, 100 * i)\n}",
    "max_score": 100,
    "bug_descriptions": [
      {
        "id": "b1",
        "description": "var memiliki function scope, bukan block scope. Di akhir loop, nilai i adalah 6. Semua callback setTimeout mereferensi variable i yang sama, sehingga semuanya menampilkan 6",
        "points": 50
      },
      {
        "id": "b2",
        "description": "Closure trap: callback di dalam setTimeout tidak menangkap nilai i pada saat iterasi. Ini adalah classic JavaScript closure issue dengan var",
        "points": 30
      },
      {
        "id": "b3",
        "description": "Solusi: gunakan let (block-scoped) atau bungkus callback dalam IIFE untuk menangkap nilai i per iterasi",
        "points": 20
      }
    ]
  },
  {
    "id": 3,
    "title": "Accessing Undefined Nested Property",
    "context": "Kode ini mencoba mengakses port dari object konfigurasi server. Temukan bug yang menyebabkan runtime error.",
    "code": "const config = {\n  server: {\n    host: 'localhost'\n  }\n}\n\nconst port = config.server.port.toString()\nconsole.log('Port:', port)",
    "max_score": 70,
    "bug_descriptions": [
      {
        "id": "b1",
        "description": "config.server.port adalah undefined karena properti port tidak ada dalam object config. Object hanya memiliki properti host",
        "points": 35
      },
      {
        "id": "b2",
        "description": "Memanggil .toString() pada undefined menghasilkan TypeError: Cannot read properties of undefined (reading 'toString')",
        "points": 35
      }
    ]
  },
  {
    "id": 4,
    "title": "Array Mutation via Reference",
    "context": "Fungsi ini seharusnya menghapus elemen duplikat dari array TANPA mengubah array asli. Tetapi array asli ikut berubah. Temukan bugnya.",
    "code": "function removeDuplicates(arr) {\n  const result = arr\n  for (let i = 0; i < result.length; i++) {\n    if (result.indexOf(result[i]) !== i) {\n      result.splice(i, 1)\n      i--\n    }\n  }\n  return result\n}\n\nconst numbers = [1, 2, 2, 3, 4, 4, 5]\nconst unique = removeDuplicates(numbers)\nconsole.log('Original:', numbers)\nconsole.log('Unique:', unique)",
    "max_score": 100,
    "bug_descriptions": [
      {
        "id": "b1",
        "description": "const result = arr membuat reference, bukan copy. Setiap perubahan pada result juga mengubah array asli numbers",
        "points": 40
      },
      {
        "id": "b2",
        "description": "Method splice() memodifikasi array secara mutating. Karena result dan numbers menunjuk ke object array yang sama, numbers juga terpengaruh",
        "points": 30
      },
      {
        "id": "b3",
        "description": "Solusi: gunakan const result = [...arr] atau const result = arr.slice() untuk membuat shallow copy sebelum modifikasi",
        "points": 30
      }
    ]
  },
  {
    "id": 5,
    "title": "Async/Await Misuse Without await",
    "context": "Fungsi ini mengambil data user dari server tetapi caller selalu mendapat undefined. Temukan bugnya.",
    "code": "async function fetchUser(id) {\n  try {\n    const response = await fetch('/api/users/' + id)\n    const user = await response.json()\n    return user\n  } catch (err) {\n    console.error('Failed to fetch user:', err)\n  }\n}\n\nconst user = fetchUser(1)\nconsole.log('User:', user)\nuser.name.toUpperCase()",
    "max_score": 90,
    "bug_descriptions": [
      {
        "id": "b1",
        "description": "fetchUser mengembalikan Promise, tetapi caller tidak menggunakan await atau .then(). Variable user berisi Promise object, bukan data user yang sudah resolved",
        "points": 40
      },
      {
        "id": "b2",
        "description": "Memanggil .name pada Promise menghasilkan TypeError karena Promise tidak memiliki properti name. Program crash sebelum data diterima",
        "points": 25
      },
      {
        "id": "b3",
        "description": "Solusi: const user = await fetchUser(1) atau fetchUser(1).then(user => ...). Async function HARUS di-await untuk mendapatkan nilai return-nya",
        "points": 25
      }
    ]
  },
  {
    "id": 6,
    "title": "Event Listener Memory Leak",
    "context": "Fungsi ini menambahkan event listener untuk search box. Namun setiap kali fungsi dipanggil, listener baru ditambahkan tanpa menghapus yang lama. Temukan bugnya.",
    "code": "function SearchBox() {\n  const input = document.getElementById('search')\n\n  input.addEventListener('keyup', (event) => {\n    if (event.key === 'Enter') {\n      performSearch(event.target.value)\n    }\n  })\n\n  return '<div>Search ready</div>'\n}",
    "max_score": 80,
    "bug_descriptions": [
      {
        "id": "b1",
        "description": "Event listener terus ditambahkan setiap kali fungsi dipanggil tanpa pernah dihapus, menyebabkan memory leak dan penumpukan listener",
        "points": 40
      },
      {
        "id": "b2",
        "description": "Di React/Vue/Svelte, event listener harus ditambahkan di dalam useEffect/onMounted dan DIBERSIHKAN via cleanup function (return removeEventListener)",
        "points": 40
      }
    ]
  },
  {
    "id": 7,
    "title": "Array Sort Default Behavior",
    "context": "Kode ini mencoba mengurutkan angka dari terkecil ke terbesar. Tetapi hasilnya tidak sesuai harapan. Temukan bugnya.",
    "code": "const numbers = [2, 10, 1, 20, 5]\nnumbers.sort()\nconsole.log(numbers)",
    "max_score": 70,
    "bug_descriptions": [
      {
        "id": "b1",
        "description": "Array.sort() tanpa compare function mengurutkan elemen sebagai string (lexicographic order), bukan numerik. Hasil: [1, 10, 2, 20, 5] bukan [1, 2, 5, 10, 20]",
        "points": 40
      },
      {
        "id": "b2",
        "description": "Semua elemen dikonversi ke string sebelum dibandingkan. \"10\" < \"2\" karena karakter \"1\" lebih kecil dari \"2\"",
        "points": 30
      }
    ]
  },
  {
    "id": 8,
    "title": "Race Condition in State Update",
    "context": "Fungsi ini meng-increment counter secara asynchronous. Ketika dipanggil 3 kali berturut-turut dengan cepat, hasil akhirnya tidak 3 seperti yang diharapkan. Temukan bugnya.",
    "code": "let counter = 0\n\nasync function incrementCounter() {\n  const current = counter\n  await new Promise(resolve => setTimeout(resolve, 100))\n  counter = current + 1\n}\n\nincrementCounter()\nincrementCounter()\nincrementCounter()\n\nsetTimeout(() => {\n  console.log('Final counter:', counter)\n}, 500)",
    "max_score": 100,
    "bug_descriptions": [
      {
        "id": "b1",
        "description": "Race condition: ketiga pemanggilan incrementCounter membaca nilai counter = 0 SEBELUM fungsi manapun menyelesaikan write. Semua membaca current = 0, semua menulis counter = 0 + 1 = 1",
        "points": 50
      },
      {
        "id": "b2",
        "description": "Operasi read-modify-write tidak atomic. Delay asynchronous (setTimeout 100ms) menciptakan jendela waktu di mana stale values dibaca",
        "points": 30
      },
      {
        "id": "b3",
        "description": "Solusi: hindari async di hot path. Gunakan counter += 1 secara langsung (synchronous), atau gunakan mutex/lock jika async tidak bisa dihindari",
        "points": 20
      }
    ]
  },
  {
    "id": 9,
    "title": "Falsy Value Trap",
    "context": "Fungsi ini mengecek apakah user memiliki diskon yang valid. Tetapi untuk user dengan diskon 0% (gratis), fungsi mengembalikan 'invalid'. Temukan bugnya.",
    "code": "function getDiscountMessage(discount) {\n  if (!discount) {\n    return 'No discount available'\n  }\n  return `You get ${discount}% discount!`\n}\n\nconsole.log(getDiscountMessage(0))\nconsole.log(getDiscountMessage(10))\nconsole.log(getDiscountMessage(null))",
    "max_score": 80,
    "bug_descriptions": [
      {
        "id": "b1",
        "description": "Nilai 0 adalah falsy di JavaScript. if (!0) bernilai true, sehingga user dengan diskon 0% dianggap tidak punya diskon. Seharusnya cek null/undefined secara eksplisit",
        "points": 45
      },
      {
        "id": "b2",
        "description": "Bang operator (!) mengkonversi ke boolean. Perlu dibedakan antara nil/value: 0 adalah nilai valid (diskon 0%), sedangkan null/undefined adalah tidak ada data",
        "points": 35
      }
    ]
  },
  {
    "id": 10,
    "title": "Floating Point Precision",
    "context": "Kode ini menghitung total harga dari dua item. Tetapi hasil penjumlahannya tidak presisi seperti yang diharapkan. Temukan bugnya.",
    "code": "const item1 = 0.1\nconst item2 = 0.2\nconst total = item1 + item2\n\nconsole.log(total)\nconsole.log(total === 0.3)\n\nif (total === 0.3) {\n  console.log('Checkout: $' + total)\n} else {\n  console.log('Error: calculation mismatch')\n}",
    "max_score": 70,
    "bug_descriptions": [
      {
        "id": "b1",
        "description": "IEEE 754 floating point precision: 0.1 + 0.2 tidak sama dengan 0.3 persis. Hasilnya adalah 0.30000000000000004 karena representasi biner dari pecahan desimal tidak presisi",
        "points": 40
      },
      {
        "id": "b2",
        "description": "Tidak bisa menggunakan === untuk membandingkan hasil komputasi floating point. Seharusnya gunakan toleransi (epsilon) atau bulatkan ke presisi tertentu",
        "points": 30
      }
    ]
  },
  {
    "id": 11,
    "title": "Incorrect this Binding",
    "context": "Object ini memiliki method yang menggunakan this untuk mengakses propertinya sendiri. Tetapi ketika method di-pass sebagai callback, this menjadi undefined. Temukan bugnya.",
    "code": "const player = {\n  name: 'ByteHunter',\n  score: 100,\n  updateScore(points) {\n    this.score += points\n    console.log(this.name + ': ' + this.score)\n  }\n}\n\nsetTimeout(player.updateScore, 1000, 50)",
    "max_score": 90,
    "bug_descriptions": [
      {
        "id": "b1",
        "description": "Method updateScore di-pass sebagai callback ke setTimeout tanpa binding. Dalam mode strict, this akan menjadi undefined, bukan object player",
        "points": 40
      },
      {
        "id": "b2",
        "description": "this di JavaScript ditentukan oleh CARA fungsi dipanggil, bukan di mana fungsi didefinisikan. setTimeout memanggil fungsi tanpa context object",
        "points": 30
      },
      {
        "id": "b3",
        "description": "Solusi: gunakan arrow function setTimeout(() => player.updateScore(50), 1000) atau .bind(player)",
        "points": 20
      }
    ]
  },
  {
    "id": 12,
    "title": "Promise Chaining Error Swallowing",
    "context": "Kode ini memproses data user secara berurutan. Tetapi ketika salah satu step gagal, error tidak ditangani dengan benar dan aplikasi crash. Temukan bugnya.",
    "code": "function validateUser(user) {\n  if (!user.email) throw new Error('Email is required')\n  return user\n}\n\nfunction enrichUser(user) {\n  if (!user.id) throw new Error('User not found')\n  return { ...user, enriched: true }\n}\n\nfetch('/api/user/1')\n  .then(res => res.json())\n  .then(user => validateUser(user))\n  .then(user => enrichUser(user))\n  .then(enriched => {\n    console.log('Success:', enriched)\n  })",
    "max_score": 100,
    "bug_descriptions": [
      {
        "id": "b1",
        "description": "Promise chain tidak memiliki .catch() di akhir. Jika ada error di validateUser atau enrichUser, error tersebut menjadi unhandled promise rejection yang dapat crash aplikasi",
        "points": 40
      },
      {
        "id": "b2",
        "description": "Unhandled promise rejection menyebabkan aplikasi berhenti tanpa feedback ke user. Tidak ada fallback atau UI error state yang ditampilkan",
        "points": 30
      },
      {
        "id": "b3",
        "description": "Solusi: tambahkan .catch(error => { console.error(error); /* tampilkan error ke user */ }) di akhir promise chain atau gunakan try/catch dengan async/await",
        "points": 30
      }
    ]
  }
];
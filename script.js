const STORAGE_KEY="aprijal_shop_listings";
const defaultProducts=[
 {id:1,cat:"Mobile Legends",short:"ML",title:"MLBB — Mythic Glory",meta:"Mythic • 85 Skin",price:1250000,cls:"ml"},
 {id:2,cat:"Free Fire",short:"FF",title:"Free Fire — Sultan",meta:"Lv. 72 • 120 Skin",price:875000,cls:"ff"},
 {id:3,cat:"Valorant",short:"VAL",title:"Valorant — Ascendant",meta:"Ascendant 2 • 34 Skin",price:1450000,cls:"val"},
 {id:4,cat:"PUBG Mobile",short:"PUBG",title:"PUBG Mobile — Conqueror",meta:"Lv. 69 • 18 Set",price:990000,cls:"pubg"},
 {id:5,cat:"Mobile Legends",short:"ML",title:"MLBB — Collector",meta:"Mythic • 102 Skin",price:2100000,cls:"ml"},
 {id:6,cat:"Free Fire",short:"FF",title:"Free Fire — Bundle Rare",meta:"Lv. 66 • 89 Skin",price:650000,cls:"ff"},
 {id:7,cat:"Valorant",short:"VAL",title:"Valorant — Diamond",meta:"Diamond 3 • 22 Skin",price:720000,cls:"val"},
 {id:8,cat:"Mobile Legends",short:"ML",title:"MLBB — Epic Murah",meta:"Epic • 47 Skin",price:325000,cls:"ml"}
];
let category="Semua",cart=[],customListings=loadListings();
const rupiah=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);

function loadListings(){
 try{
  const data=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");
  return Array.isArray(data)?data:[];
 }catch{
  return [];
 }
}
function saveListings(){
 localStorage.setItem(STORAGE_KEY,JSON.stringify(customListings));
}
function getAllProducts(){
 return [...defaultProducts,...customListings];
}
function getShortLabel(cat){
 const labels={"Mobile Legends":"ML","Free Fire":"FF","PUBG Mobile":"PUBG","Valorant":"VAL"};
 return labels[cat]||cat.slice(0,2).toUpperCase();
}
function getItemClass(cat){
 const map={"Mobile Legends":"ml","Free Fire":"ff","PUBG Mobile":"pubg","Valorant":"val"};
 return map[cat]||"ml";
}
function render(){
 const q=(document.getElementById("heroSearch")?.value||"").toLowerCase();
 const list=getAllProducts().filter(p=>(category==="Semua"||p.cat===category)&&(!q||(p.title+" "+p.cat+" "+p.meta).toLowerCase().includes(q)));
 document.getElementById("productGrid").innerHTML=list.length?list.map(p=>`
 <article class="product">

 <div class="product-img ${p.cls || getItemClass(p.cat)}"></div>
  <div class="product-body"><h3>${p.title}</h3><div class="meta"><span>${p.meta}</span></div>
   <div class="price-row"><span class="price">${rupiah(p.price)}</span>
     <div style="display:flex;align-items:center;gap:6px">
       ${p.isCustom?`<button class="delete-btn" onclick="deleteListing(${p.id})">Hapus</button>`:""}
       <button class="add" onclick="addCart(${p.id})">+</button>
     </div>
   </div></div>
 </article>`).join(""):`<div style="grid-column:1/-1;text-align:center;padding:50px;color:#8991a0;font-size:12px">Akun tidak ditemukan. Coba kata kunci lain.</div>`;
 document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.cat===category));
 renderMyListings();
}
function renderMyListings(){
 const box=document.getElementById("myListingsGrid");
 if(!box)return;
 box.innerHTML=customListings.length?customListings.map(p=>`
   <article class="product">
     <div class="product-img ${p.cls || getItemClass(p.cat)}"><small>${p.cat}</small><span>${p.short || getShortLabel(p.cat)}<br>JUAL</span></div>
     <div class="product-body"><h3>${p.title}</h3><div class="meta"><span>${p.meta}</span></div>
     <div class="price-row"><span class="price">${rupiah(p.price)}</span><button class="delete-btn" onclick="deleteListing(${p.id})">Delete</button></div></div>
   </article>`).join(""):`<div style="grid-column:1/-1;text-align:center;padding:50px;color:#8991a0;font-size:12px">Belum ada listing yang kamu unggah.</div>`;
}
function filterProducts(){render();document.getElementById("katalog").scrollIntoView({behavior:"smooth",block:"start"})}
function setCategory(c){category=c;render()}
function chooseCategory(c){category=c;render();document.getElementById("katalog").scrollIntoView({behavior:"smooth"})}
function addCart(id){const p=getAllProducts().find(x=>x.id===id);if(!p)return;cart.push(p);document.getElementById("cartCount").textContent=cart.length;showToast(p.title+" ditambahkan ke keranjang")}
function openCart(){document.getElementById("cartDrawer").classList.add("open");renderCart()}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open")}
function renderCart(){
 const box=document.getElementById("cartItems");
 box.innerHTML=cart.length?cart.map((p,i)=>`<div class="cart-item"><b>${p.title}</b><small>${rupiah(p.price)} <button style="float:right;border:0;background:none;color:#ef4444;cursor:pointer" onclick="removeCart(${i})">Hapus</button></small></div>`).join(""):`<div style="text-align:center;color:#9299a7;padding:50px 10px;font-size:11px">Keranjang masih kosong.</div>`;
 document.getElementById("cartTotal").textContent=rupiah(cart.reduce((a,p)=>a+p.price,0));
}
function removeCart(i){cart.splice(i,1);document.getElementById("cartCount").textContent=cart.length;renderCart()}
function openModal(id){document.getElementById(id).classList.add("open")}
function closeModal(id){document.getElementById(id).classList.remove("open")}
function submitSellerListing(){
 const cat=document.getElementById("listingGame").value.trim();
 const title=document.getElementById("listingTitle").value.trim();
 const price=Number(document.getElementById("listingPrice").value);
 const desc=document.getElementById("listingDesc").value.trim();
 if(!title || !price){showToast("Judul dan harga wajib diisi.");return;}
 const item={
   id:Date.now()+Math.floor(Math.random()*1000),
   cat,
   short:getShortLabel(cat),
   title,
   meta:desc ? (desc.length>40?desc.slice(0,40)+"...":desc) : "Akun baru diunggah",
   price,
   cls:getItemClass(cat),
   isCustom:true
 };
 customListings.unshift(item);
 saveListings();
 closeModal("sellerModal");
 document.getElementById("listingTitle").value="";
 document.getElementById("listingPrice").value="";
 document.getElementById("listingDesc").value="";
 render();
 showToast("Listing berhasil diunggah.");
}
function deleteListing(id){
 customListings=customListings.filter(item=>item.id!==id);
 saveListings();
 render();
 showToast("Listing berhasil dihapus.");
}
function fakeSubmit(id){closeModal(id);showToast("Demo berhasil. Backend belum terhubung.")}
function showToast(t){const x=document.getElementById("toast");x.textContent=t;x.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>x.classList.remove("show"),2400)}
document.querySelectorAll(".modal-wrap").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("open")}));
render();
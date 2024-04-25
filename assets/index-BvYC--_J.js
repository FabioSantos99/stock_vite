(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const c of o)if(c.type==="childList")for(const s of c.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function e(o){const c={};return o.integrity&&(c.integrity=o.integrity),o.referrerPolicy&&(c.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?c.credentials="include":o.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function r(o){if(o.ep)return;o.ep=!0;const c=e(o);fetch(o.href,c)}})();const O=n=>{const t=l();t.push(n),localStorage.setItem("products",JSON.stringify(t))},l=()=>{const n=localStorage.getItem("products");return n?JSON.parse(n):[]},k=n=>{const e=l().filter(r=>r.nameInput!==n);localStorage.setItem("products",JSON.stringify(e))},F=document.querySelector("#export");function w(){const n=l(),t=[["Name","Price","Quantity","Type"],...n.map(r=>[r.nameInput,r.priceInput,r.quantityInput,r.typePdtInput])].map(r=>r.join(",")).join(`
`),e=document.createElement("a");e.href="data:text/csv;charset=utf-8,"+encodeURI(t),e.target="blank",e.download="products.csv",e.click()}F.addEventListener("click",()=>{w()});const S=document.querySelector("#name"),v=document.querySelector("#price"),q=document.querySelector("#quantity"),L=document.querySelector("#typePdt");document.querySelectorAll(".prodInput");const A=document.querySelector("#product-list"),B=document.querySelector("#stock-form"),g=(n,t,e,r,o=1)=>{const c=document.createElement("tr");c.classList.add("prod");const s=document.createElement("td");s.innerText=n,c.classList.add(`${r}`),c.appendChild(s);const i=document.createElement("td");i.innerText=t,c.appendChild(i);const m=document.createElement("td");m.innerText=e,c.appendChild(m);const y=document.createElement("td");y.innerText=r,c.appendChild(y);const f=document.createElement("td"),u=document.createElement("button");f.appendChild(u),u.classList.add("edit-item"),u.innerHTML="Edit",c.appendChild(f);const h=document.createElement("td"),p=document.createElement("button");h.appendChild(p),p.classList.add("delete-item"),p.innerHTML="Delete",c.appendChild(h),A.appendChild(c),o&&O({nameInput:n,priceInput:t,quantityInput:e,typePdtInput:r})};B.addEventListener("submit",n=>{n.preventDefault();const t=S.value,e=v.value,r=q.value,o=L.value,c=parseFloat(e).toFixed(2);t&&e&&r&&o&&(g(t,c,r,o),S.value="",v.value="",q.value="",L.value="")});const D=()=>l().forEach(t=>{g(t.nameInput,t.priceInput,t.quantityInput,t.typePdtInput,0)}),J=document.querySelector("#filter-select"),E=n=>{const t=document.querySelectorAll(".prod");switch(n){case"all":t.forEach(e=>e.style.display="");break;case"phone":t.forEach(e=>e.classList.contains("phone")?e.style.display="":e.style.display="none");break;case"console":t.forEach(e=>e.classList.contains("console")?e.style.display="":e.style.display="none");break;case"computer":t.forEach(e=>e.classList.contains("computer")?e.style.display="":e.style.display="none");break;case"tv":t.forEach(e=>e.classList.contains("tv")?e.style.display="":e.style.display="none");break}};J.addEventListener("change",n=>{const t=n.target.value;E(t)});const Q=document.querySelector("#search-input"),P=n=>{document.querySelectorAll(".prod").forEach(e=>{let r=e.querySelector("td").innerText.toLowerCase();const o=n.toLowerCase();e.style.display="",r.includes(o)||(e.style.display="none")})};Q.addEventListener("keyup",n=>{const t=n.target.value;P(t)});const a=document.querySelector("#edit-table"),I=document.querySelector("#edit-name"),x=document.querySelector("#edit-price"),T=document.querySelector("#edit-quantity"),b=document.querySelector("#edit-type"),M=document.querySelector("#cancel-edit-btn");let d=null,C;const N=(n,t,e,r,o)=>{const c=l(),s=c.findIndex(i=>i.nameInput===n);s!==-1&&(c[s]={nameInput:t,priceInput:e,quantityInput:r,typePdtInput:o},localStorage.setItem("products",JSON.stringify(c)))};document.addEventListener("click",n=>{const t=n.target.closest(".prod");if(n.target.classList.contains("edit-item")){d=t;const e=t.querySelector("td:nth-child(1)").innerText.trim(),r=t.querySelector("td:nth-child(2)").innerText.trim(),o=t.querySelector("td:nth-child(3)").innerText.trim(),c=t.querySelector("td:nth-child(4)").innerText.trim();C=e,I.value=e,x.value=r,T.value=o,b.value=c,a.style.display="block"}else if(n.target.classList.contains("delete-item")){const e=t.querySelector("td:nth-child(1)").textContent;k(e),t.remove()}});M.addEventListener("click",()=>{a.style.display="none"});a.addEventListener("submit",n=>{n.preventDefault();const t=I.value,e=x.value,r=T.value,o=b.value,c=parseFloat(e).toFixed(2);t&&e&&r&&o&&d&&(d.querySelector("td:nth-child(1)").textContent=t,d.querySelector("td:nth-child(2)").textContent=c,d.querySelector("td:nth-child(3)").textContent=r,d.querySelector("td:nth-child(4)").textContent=o,N(C,t,e,r,o),d=null,a.style.display="none")});D();E();P();N();exportData();

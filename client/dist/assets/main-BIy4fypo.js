(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))d(s);new MutationObserver(s=>{for(const e of s)if(e.type==="childList")for(const l of e.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&d(l)}).observe(document,{childList:!0,subtree:!0});function m(s){const e={};return s.integrity&&(e.integrity=s.integrity),s.referrerPolicy&&(e.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?e.credentials="include":s.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function d(s){if(s.ep)return;s.ep=!0;const e=m(s);fetch(s.href,e)}})();document.addEventListener("DOMContentLoaded",()=>{const v="https://url-shortner-n3h5.onrender.com",a=document.getElementById("shorten-form"),m=document.getElementById("long-url"),d=document.getElementById("result-container"),s=document.getElementById("stats-code"),e=document.getElementById("get-stats-btn"),l=document.getElementById("stats-result"),f=document.getElementById("theme-toggle-btn"),i=f.querySelector("i"),u=document.getElementById("toast"),y=document.getElementById("toast-message"),b=document.getElementById("toast-close");localStorage.getItem("theme")==="dark"&&(document.documentElement.setAttribute("data-theme","dark"),i.classList.remove("fa-moon"),i.classList.add("fa-sun")),f.addEventListener("click",()=>{document.documentElement.getAttribute("data-theme")==="dark"?(document.documentElement.removeAttribute("data-theme"),localStorage.setItem("theme","light"),i.classList.remove("fa-sun"),i.classList.add("fa-moon")):(document.documentElement.setAttribute("data-theme","dark"),localStorage.setItem("theme","dark"),i.classList.remove("fa-moon"),i.classList.add("fa-sun"))}),a.addEventListener("submit",async t=>{t.preventDefault();const o=m.value.trim();if(!o){n("Please enter a URL","error");return}try{const r=a.querySelector("button"),c=r.textContent;r.disabled=!0,r.innerHTML='<i class="fas fa-spinner fa-spin"></i> Processing...';const h=await fetch(`${v}/api/shortenUrl`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({longUrl:o})}),g=await h.json();if(!h.ok)throw new Error(g.message||"Error shortening URL");L(g),n("URL shortened successfully!","success"),m.value="",r.disabled=!1,r.textContent=c}catch(r){console.error("Error:",r),n(r.message||"Failed to shorten URL","error");const c=a.querySelector("button");c.disabled=!1,c.textContent="Shorten"}}),e.addEventListener("click",async()=>{const t=s.value.trim();if(!t){n("Please enter a short code","error");return}try{e.disabled=!0,e.innerHTML='<i class="fas fa-spinner fa-spin"></i> Loading...';const o=await fetch(`${v}/api/stats/${t}`),r=await o.json();if(!o.ok)throw new Error(r.message||"Error retrieving stats");C(r),n("Stats retrieved successfully!","success"),e.disabled=!1,e.textContent="Get Stats"}catch(o){console.error("Error:",o),n(o.message||"Failed to retrieve stats","error"),e.disabled=!1,e.textContent="Get Stats",l.style.display="none"}}),b.addEventListener("click",()=>{u.classList.remove("show")});function L(t){d.style.display="block",d.innerHTML=`
        <div class="result-card">
          <div class="result-item">
            <span class="result-label">Original URL:</span>
            <div class="result-value">
              <span>${p(t.longUrl||"",40)}</span>
              <button class="copy-btn" data-clipboard="${t.longUrl||""}" title="Copy original URL">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>
          <div class="result-item">
            <span class="result-label">Short URL:</span>
            <div class="result-value">
              <a href="${t.shortUrl||"#"}" target="_blank">${t.shortUrl||"N/A"}</a>
              <button class="copy-btn" data-clipboard="${t.shortUrl||""}" title="Copy short URL">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>
          <div class="result-item">
            <span class="result-label">Short Code:</span>
            <div class="result-value">
              <span>${t.shortCode||"N/A"}</span>
              <button class="copy-btn" data-clipboard="${t.shortCode||""}" title="Copy short code">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>
          <div class="qr-code-container">
            ${t.qrCode?`<img src="${t.qrCode}" alt="QR Code for ${t.shortUrl||""}">`:"<p>QR code not available</p>"}
          </div>
        </div>
      `,document.querySelectorAll(".copy-btn").forEach(o=>{o.addEventListener("click",()=>{const r=o.getAttribute("data-clipboard");navigator.clipboard.writeText(r).then(()=>{n("Copied to clipboard!","success")}).catch(c=>{console.error("Could not copy text: ",c),n("Failed to copy text","error")})})})}function C(t){l.style.display="block",l.innerHTML=`
        <div class="stats-card">
          <div class="stat-item">
            <div class="stat-label">Short Code</div>
            <div class="stat-value">${t.shortCode||"N/A"}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Total Clicks</div>
            <div class="stat-value">${t.clickCount!==void 0?t.clickCount:"N/A"}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Short URL</div>
            <div class="stat-value url">
              <a href="${t.shortUrl||"#"}" target="_blank">${t.shortUrl||"N/A"}</a>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Original URL</div>
            <div class="stat-value url">${p(t.longUrl||"",50)}</div>
          </div>
        </div>
      `}function n(t,o="success"){y.textContent=t,u.className="toast",u.classList.add(`toast-${o}`),u.classList.add("show"),setTimeout(()=>{u.classList.remove("show")},3e3)}function p(t,o){return t?t.length<=o?t:t.substring(0,o)+"...":""}});

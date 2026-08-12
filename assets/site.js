// Replace only this value with the Measurement ID saved in Google Analytics
const GA_MEASUREMENT_ID = "G-P978VZVHR2";
const ANALYTICS_CONSENT_KEY = "serwis_pro_analytics_consent";
let analyticsLoaded = false;

function analyticsIsConfigured() {
  return /^G-[A-Z0-9]+$/i.test(GA_MEASUREMENT_ID) && !GA_MEASUREMENT_ID.includes("WPISZ");
}

function loadGoogleAnalytics() {
  if (!analyticsIsConfigured() || analyticsLoaded) return;

  analyticsLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("consent", "update", {
    analytics_storage: "granted",
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

function removeAnalyticsCookies() {
  const host = window.location.hostname;
  document.cookie.split(";").forEach((entry) => {
    const name = entry.split("=")[0].trim();
    if (!/^_ga($|_)/.test(name) && name !== "_gid") return;

    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=${host}; SameSite=Lax`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${host}; SameSite=Lax`;
  });
}

function disableGoogleAnalytics() {
  if (!analyticsIsConfigured()) return;

  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }
  removeAnalyticsCookies();
  analyticsLoaded = false;
}

function saveAnalyticsConsent(value) {
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
  } catch (error) {
    // The choice still applies for the current page if storage is unavailable
  }
}

function readAnalyticsConsent() {
  try {
    return window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
  } catch (error) {
    return null;
  }
}

function createConsentInterface() {
  if (!analyticsIsConfigured()) return;

  const style = document.createElement("style");
  style.textContent = `
    .cookie-consent {
      position: fixed;
      z-index: 1200;
      left: 50%;
      bottom: 18px;
      width: min(720px, calc(100% - 32px));
      transform: translateX(-50%);
      padding: 22px;
      border: 1px solid #cbd8e3;
      border-radius: 8px;
      background: #fff;
      box-shadow: 0 18px 50px rgba(12, 27, 45, .2);
      color: #0c1b2d;
    }
    .cookie-consent[hidden] { display: none }
    .cookie-consent h2 { margin: 0 0 8px; font-size: 1.25rem }
    .cookie-consent p { margin: 0; color: #4e6072; line-height: 1.55 }
    .cookie-consent a { color: #176ca6; font-weight: 700 }
    .cookie-consent__actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px }
    .cookie-consent__button {
      min-height: 44px;
      padding: 10px 16px;
      border: 2px solid #0c1b2d;
      border-radius: 6px;
      background: #fff;
      color: #0c1b2d;
      font: inherit;
      font-weight: 800;
      cursor: pointer;
    }
    .cookie-consent__button--accept { border-color: #1875b5; background: #1875b5; color: #fff }
    .cookie-settings {
      position: fixed;
      z-index: 1100;
      left: 12px;
      bottom: 12px;
      min-height: 36px;
      padding: 7px 11px;
      border: 1px solid #b8c9d7;
      border-radius: 6px;
      background: #fff;
      color: #0c1b2d;
      box-shadow: 0 6px 20px rgba(12, 27, 45, .12);
      font: inherit;
      font-size: .82rem;
      font-weight: 700;
      cursor: pointer;
    }
    @media (max-width: 560px) {
      .cookie-consent { bottom: 10px; width: calc(100% - 20px); padding: 18px }
      .cookie-consent__actions { display: grid }
      .cookie-consent__button { width: 100% }
    }
  `;
  document.head.appendChild(style);

  const banner = document.createElement("section");
  banner.className = "cookie-consent";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-modal", "true");
  banner.setAttribute("aria-labelledby", "cookie-consent-title");
  banner.innerHTML = `
    <h2 id="cookie-consent-title">Twoja prywatność</h2>
    <p>Używamy niezbędnej pamięci przeglądarki, aby zapisać Twój wybór. Za Twoją zgodą uruchomimy Google Analytics, aby sprawdzać, jak używana jest strona. <a href="/polityka-prywatnosci/">Więcej informacji</a></p>
    <div class="cookie-consent__actions">
      <button class="cookie-consent__button" type="button" data-consent="denied">Tylko niezbędne</button>
      <button class="cookie-consent__button cookie-consent__button--accept" type="button" data-consent="granted">Akceptuję analityczne</button>
    </div>
  `;

  const settingsButton = document.createElement("button");
  settingsButton.className = "cookie-settings";
  settingsButton.type = "button";
  settingsButton.textContent = "Ustawienia cookies";
  settingsButton.setAttribute("aria-controls", "cookie-consent-title");

  function showBanner() {
    settingsButton.hidden = true;
    banner.hidden = false;
    banner.querySelector("button")?.focus();
  }

  function hideBanner() {
    banner.hidden = true;
    settingsButton.hidden = false;
    settingsButton.focus();
  }

  banner.querySelectorAll("[data-consent]").forEach((button) => {
    button.addEventListener("click", () => {
      const consent = button.dataset.consent;
      const analyticsWasLoaded = analyticsLoaded;
      saveAnalyticsConsent(consent);
      if (consent === "granted") {
        loadGoogleAnalytics();
      } else {
        disableGoogleAnalytics();
      }
      hideBanner();
      if (consent === "denied" && analyticsWasLoaded) window.location.reload();
    });
  });

  settingsButton.addEventListener("click", showBanner);
  document.body.append(banner, settingsButton);

  const savedConsent = readAnalyticsConsent();
  if (savedConsent === "granted") {
    banner.hidden = true;
    settingsButton.hidden = false;
    loadGoogleAnalytics();
  } else if (savedConsent === "denied") {
    banner.hidden = true;
    settingsButton.hidden = false;
  } else {
    showBanner();
  }
}

createConsentInterface();

document.addEventListener("click", (event) => {
  const phoneLink = event.target.closest('a[href^="tel:"]');
  if (!phoneLink || !analyticsLoaded || typeof window.gtag !== "function") return;

  window.gtag("event", "phone_click", {
    link_url: phoneLink.href,
    page_location: window.location.href,
  });
});

const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    navigation.classList.toggle("is-open", !open);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuButton.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menuButton.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
      menuButton.focus();
    }
  });
}

const firstSegment = window.location.pathname.split("/").filter(Boolean)[0] || "start";
const sectionMap = {
  "serwis-okien-poznan": "okna",
  "naprawa-okien-poznan": "okna",
  "regulacja-okien-poznan": "okna",
  "wymiana-zamka-w-oknie-poznan": "okna",
  "naprawa-drzwi-balkonowych-poznan": "drzwi",
  "regulacja-drzwi-balkonowych-poznan": "drzwi",
};
const section = sectionMap[firstSegment] || firstSegment;
document.querySelectorAll(".nav a[data-section]").forEach((link) => {
  if (link.dataset.section === section) {
    link.setAttribute("aria-current", "page");
  }
});

const reviewsDialog = document.getElementById("reviews-dialog");
const reviewsDialogList = reviewsDialog?.querySelector(".review-dialog-list");
let reviewTrigger = null;

if (reviewsDialog && reviewsDialogList) {
  document.querySelectorAll("[data-review-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.reviewTarget);
      if (!target) return;

      reviewTrigger = button;
      reviewsDialog.showModal();
      document.body.classList.add("dialog-open");
      reviewsDialogList.scrollTop = 0;
      const listTop = reviewsDialogList.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;
      reviewsDialogList.scrollTop = Math.max(0, targetTop - listTop);
      target.focus({ preventScroll: true });
    });
  });

  reviewsDialog.querySelector(".review-dialog-close")?.addEventListener("click", () => {
    reviewsDialog.close();
  });

  reviewsDialog.addEventListener("click", (event) => {
    if (event.target === reviewsDialog) {
      reviewsDialog.close();
    }
  });

  reviewsDialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    reviewTrigger?.focus();
  });
}

// Reusable article TOC previews: content is always extracted from the linked article section.
function initArticleTocPreviews(){
  const tocLinks=[...document.querySelectorAll('.article-toc a[href^="#"]')];
  const hoverCapable=window.matchMedia("(hover: hover) and (pointer: fine)");
  if(!tocLinks.length||!hoverCapable.matches)return;

  const preview=document.createElement("div");
  preview.className="toc-preview";
  preview.id="article-toc-preview";
  preview.setAttribute("role","tooltip");
  preview.hidden=true;
  document.body.appendChild(preview);

  let activeLink=null;
  const cleanText=(value)=>value.replace(/\s+/g," ").trim();

  function truncateAtWord(text,maxLength=420){
    const value=cleanText(text);
    if(value.length<=maxLength)return value;
    const clipped=value.slice(0,maxLength+1);
    const boundary=clipped.lastIndexOf(" ");
    return `${clipped.slice(0,boundary>280?boundary:maxLength).trim()}…`;
  }

  function sectionParagraphs(link){
    const hash=link.getAttribute("href");
    if(!hash||hash==="#")return[];
    const heading=document.getElementById(decodeURIComponent(hash.slice(1)));
    if(!heading)return[];

    const paragraphs=[];
    let node=heading.nextElementSibling;
    while(node&&node.tagName!=="H2"&&paragraphs.length<2){
      if(node.tagName==="P"){
        const text=cleanText(node.textContent||"");
        if(text)paragraphs.push(text);
      }
      node=node.nextElementSibling;
    }
    return paragraphs;
  }

  function renderPreview(link){
    const paragraphs=sectionParagraphs(link);
    if(!paragraphs.length)return false;

    preview.replaceChildren();
    let remaining=420;
    paragraphs.forEach((text,index)=>{
      if(remaining<=0)return;
      const p=document.createElement("p");
      const limited=truncateAtWord(text,remaining);
      p.textContent=limited;
      preview.appendChild(p);
      remaining-=limited.length+(index===0?20:0);
    });
    return Boolean(preview.childElementCount);
  }

  function positionPreview(link){
    const gap=16,margin=12;
    const linkRect=link.getBoundingClientRect();
    const previewRect=preview.getBoundingClientRect();
    let left=linkRect.right+gap;
    let top=linkRect.top;

    if(left+previewRect.width>window.innerWidth-margin)left=linkRect.left-gap-previewRect.width;
    if(left<margin){
      left=Math.min(Math.max(margin,linkRect.left),window.innerWidth-previewRect.width-margin);
      top=linkRect.bottom+gap;
    }
    if(top+previewRect.height>window.innerHeight-margin)top=Math.max(margin,window.innerHeight-previewRect.height-margin);
    top=Math.max(margin,top);

    preview.style.left=`${Math.round(left)}px`;
    preview.style.top=`${Math.round(top)}px`;
  }

  function showPreview(link){
    if(!renderPreview(link))return;
    activeLink=link;
    preview.hidden=false;
    link.setAttribute("aria-describedby",preview.id);
    positionPreview(link);
  }

  function hidePreview(link=activeLink){
    if(link)link.removeAttribute("aria-describedby");
    preview.hidden=true;
    activeLink=null;
  }

  tocLinks.forEach((link)=>{
    link.addEventListener("mouseenter",()=>showPreview(link));
    link.addEventListener("mouseleave",()=>hidePreview(link));
    link.addEventListener("focus",()=>showPreview(link));
    link.addEventListener("blur",()=>hidePreview(link));
  });

  document.addEventListener("keydown",(event)=>{
    if(event.key==="Escape"&&activeLink)hidePreview();
  });

  window.addEventListener("resize",()=>{if(activeLink&&!preview.hidden)positionPreview(activeLink)});
  window.addEventListener("scroll",()=>{if(activeLink&&!preview.hidden)positionPreview(activeLink)},{passive:true});
}
initArticleTocPreviews();

const CONFIG = {
  tokenAddress: "5z6soYapgMHRijx1xoENhEBSGUhBgYRamW3pCVMTpump",
  pumpFunUrl: "",
  twitter: "https://x.com/trumpsol_x ",
  telegram: "",
};

function getPumpFunUrl() {
  if (CONFIG.pumpFunUrl) return CONFIG.pumpFunUrl;
  if (CONFIG.tokenAddress) return `https://pump.fun/coin/${CONFIG.tokenAddress}`;
  return "https://pump.fun";
}

function initContract() {
  const display = document.getElementById("ca-display");
  const copyBtn = document.getElementById("copy-ca");
  const toast = document.getElementById("copy-toast");
  const address = CONFIG.tokenAddress;

  if (!address) {
    display.textContent = "5z6soYapgMHRijx1xoENhEBSGUhBgYRamW3pCVMTpump";
    copyBtn.disabled = true;
    copyBtn.title = "Contract address coming soon";
    return;
  }

  display.textContent = address;

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(address);
      copyBtn.classList.add("copied");
      copyBtn.textContent = "Copied";
      toast.textContent = "Contract address copied.";
      toast.classList.add("show");

      setTimeout(() => {
        copyBtn.classList.remove("copied");
        copyBtn.textContent = "Copy";
        toast.classList.remove("show");
      }, 2500);
    } catch {
      toast.textContent = "Copy failed — select and copy manually.";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2500);
    }
  });
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initSocialLinks() {
  const pumpUrl = getPumpFunUrl();

  document.querySelectorAll("[data-pumpfun]").forEach((el) => {
    el.href = pumpUrl;
  });

  document.querySelectorAll("[data-telegram]").forEach((el) => {
    if (CONFIG.telegram) el.href = CONFIG.telegram;
  });

  document.querySelectorAll("[data-twitter]").forEach((el) => {
    if (CONFIG.twitter) el.href = CONFIG.twitter;
  });
}

function initReveal() {
  const nodes = document.querySelectorAll(".reveal");
  if (!nodes.length) return;

  if (!("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  nodes.forEach((node) => observer.observe(node));
}

function initConfetti() {
  const canvas = document.querySelector(".confetti");
  if (!canvas) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const ctx = canvas.getContext("2d");
  const colors = ["#ff7a18", "#ffb020", "#ffd56a", "#fff1c9", "#fff6f1", "#f7931a", "#c2410c"];
  let pieces = [];
  let width = 0;
  let height = 0;

  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function makePiece(fromTop) {
    const wide = 6 + Math.random() * 8;
    return {
      x: Math.random() * width,
      y: fromTop ? -20 - Math.random() * height : Math.random() * height,
      w: wide,
      h: 8 + Math.random() * 12,
      vy: 0.7 + Math.random() * 1.7,
      vx: -0.45 + Math.random() * 0.9,
      rot: Math.random() * Math.PI,
      vr: -0.06 + Math.random() * 0.12,
      color: colors[Math.floor(Math.random() * colors.length)],
      swing: Math.random() * Math.PI * 2,
      swingSpeed: 0.015 + Math.random() * 0.02,
    };
  }

  function spawn() {
    const count = Math.max(28, Math.min(70, Math.floor(width / 18)));
    pieces = Array.from({ length: count }, () => makePiece(false));
  }

  function frame() {
    ctx.clearRect(0, 0, width, height);
    pieces.forEach((piece) => {
      piece.swing += piece.swingSpeed;
      piece.y += piece.vy;
      piece.x += Math.sin(piece.swing) * 0.7 + piece.vx;
      piece.rot += piece.vr;

      if (piece.y > height + 24) {
        const next = makePiece(true);
        piece.x = next.x;
        piece.y = next.y;
        piece.vy = next.vy;
      }

      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rot);
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
      ctx.restore();
    });
    requestAnimationFrame(frame);
  }

  resize();
  spawn();
  frame();
  window.addEventListener("resize", () => {
    resize();
    spawn();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("js");
  initContract();
  initNav();
  initSocialLinks();
  initReveal();
  initConfetti();
});

document.addEventListener("DOMContentLoaded", () => {
  const WA_NUMBER = "5517997557070";

  const buildWaUrl = (message) =>
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

  document.querySelectorAll("[data-wa-message]").forEach((link) => {
    const message = link.getAttribute("data-wa-message");
    if (message) link.href = buildWaUrl(message);
  });

  // Mobile navigation
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav a");
  const brandLink = document.querySelector(".site-header .brand");

  const closeMenu = () => {
    header?.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Abrir menu");
  };

  const openMenu = () => {
    header?.classList.add("menu-open");
    menuToggle?.setAttribute("aria-expanded", "true");
    menuToggle?.setAttribute("aria-label", "Fechar menu");
  };

  menuToggle?.addEventListener("click", () => {
    const isOpen = header?.classList.contains("menu-open");
    if (isOpen) closeMenu();
    else openMenu();
  });

  // Se o menu estiver aberto e clicar no nome/logo na nav, fecha o menu sem pular para a home
  brandLink?.addEventListener("click", (event) => {
    if (header?.classList.contains("menu-open")) {
      event.preventDefault();
      closeMenu();
    }
  });

  // Fechar menu ao clicar fora dele
  document.addEventListener("click", (event) => {
    if (header?.classList.contains("menu-open") && !header.contains(event.target)) {
      closeMenu();
    }
  });

  // Fechar menu com a tecla Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header?.classList.contains("menu-open")) {
      closeMenu();
    }
  });

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      closeMenu();

      if (!link.hash || !target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Reveal on scroll
  const revealItems = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealItems.forEach((el) => observer.observe(el));

  // S.O.S. Amamentação
  const checklist = document.querySelectorAll("#sos-checklist input[type='checkbox']");
  const countEl = document.getElementById("sos-count");
  const progressBar = document.getElementById("sos-progress-bar");
  const priorityEl = document.getElementById("sos-priority");
  const resultText = document.getElementById("sos-result-text");
  const sosLink = document.getElementById("sos-whatsapp");

  const updateSos = () => {
    const selected = [...checklist].filter((input) => input.checked);
    const count = selected.length;
    const percent = (count / checklist.length) * 100;

    if (countEl) countEl.textContent = count;
    if (progressBar) progressBar.style.width = `${percent}%`;

    let priority = "Vamos entender juntas.";
    let text = "Marque pelo menos um sinal para gerar sua mensagem.";

    if (count === 0) {
      priority = "Comece pelo que você está sentindo.";
      text = "Selecione os sinais que mais combinam com o seu momento.";
    } else if (count <= 2) {
      priority = "Vale conversar em breve.";
      text = "Alguns sinais merecem avaliação para evitar que a dificuldade aumente.";
    } else if (count <= 4) {
      priority = "Seu momento merece atenção.";
      text = "Há mais de um sinal acontecendo. Uma avaliação pode trazer clareza e alívio.";
    } else {
      priority = "Priorize pedir ajuda.";
      text = "Vários sinais estão presentes. Entre em contato para avaliar o quanto antes, especialmente se houver sinais de alerta.";
    }

    if (priorityEl) priorityEl.textContent = priority;
    if (resultText) resultText.textContent = text;

    const symptoms = selected.map((input) => input.value);
    let message = "Olá, Rainéria! Fiz a triagem S.O.S. Amamentação no seu site.\n\n";
    if (symptoms.length) {
      message += "Estou percebendo:\n" + symptoms.map((item) => `• ${item}`).join("\n");
      message += "\n\nGostaria de entender se o atendimento é indicado para o meu caso.";
    } else {
      message += "Ainda não marquei nenhum sinal, mas gostaria de conversar sobre meu momento.";
    }

    if (sosLink) sosLink.href = buildWaUrl(message);
  };

  checklist.forEach((input) => input.addEventListener("change", updateSos));
  updateSos();

  // FAQ accordion
  const faqItems = [...document.querySelectorAll(".faq-item")];
  const faqData = [];

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");
    const question = item.querySelector(".faq-question span");
    const answer = item.querySelector(".faq-answer p");

    if (question && answer) {
      faqData.push({
        "@type": "Question",
        name: question.textContent.trim(),
        acceptedAnswer: {
          "@type": "Answer",
          text: answer.textContent.trim(),
        },
      });
    }

    button?.addEventListener("click", () => {
      const willOpen = !item.classList.contains("open");

      faqItems.forEach((other) => {
        other.classList.remove("open");
        other.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
      });

      if (willOpen) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  const faqSchema = document.getElementById("faq-schema");
  if (faqSchema) {
    faqSchema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqData,
    });
  }

  // Back to top
  const topButton = document.querySelector(".back-to-top");
  const toggleTop = () => {
    if (window.scrollY > 800) topButton?.classList.add("visible");
    else topButton?.classList.remove("visible");
  };
  window.addEventListener("scroll", toggleTop, { passive: true });
  toggleTop();

  topButton?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Year
  const yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Add context to plain WhatsApp links that have a title but no message.
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach((link) => {
    if (!link.href.includes("?text=") && link.id !== "sos-whatsapp" && !link.dataset.waMessage) {
      const surrounding = link.textContent.trim();
      if (surrounding) {
        link.href = buildWaUrl(`Olá, Rainéria! Vim pelo site e gostaria de saber sobre: ${surrounding}`);
      }
    }
  });
});

const bookingForm = document.querySelector("#booking-form");
const checkIn = document.querySelector("#check-in");
const checkOut = document.querySelector("#check-out");
const bookingMessage = document.querySelector("#booking-message");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-navigation");
const siteHeader = document.querySelector(".site-header");

function updateHeaderOnScroll() {
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
}

updateHeaderOnScroll();
window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });

function localDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function updateCheckoutMinimum() {
  if (!checkIn.value) {
    checkOut.min = localDateString(new Date());
    return;
  }

  const earliestCheckout = new Date(`${checkIn.value}T00:00:00`);
  earliestCheckout.setDate(earliestCheckout.getDate() + 1);
  checkOut.min = localDateString(earliestCheckout);

  if (checkOut.value && checkOut.value < checkOut.min) {
    checkOut.value = "";
  }
}

checkIn.min = localDateString(new Date());
updateCheckoutMinimum();
checkIn.addEventListener("change", updateCheckoutMinimum);

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  bookingMessage.textContent = "";

  if (!bookingForm.reportValidity()) return;

  if (checkOut.value <= checkIn.value) {
    bookingMessage.textContent = "Please choose a check-out date after your check-in date.";
    checkOut.focus();
    return;
  }

  const formData = new FormData(bookingForm);
  const guests = Number(formData.get("guests"));
  const guestLabel = guests === 1 ? "guest" : "guests";
  const guestName = String(formData.get("guestName")).trim();
  const email = String(formData.get("email")).trim();
  const note = String(formData.get("message")).trim();
  const message = [
    "Hello The Lexury, I'd like to enquire about a stay.",
    `Name: ${guestName}`,
    `Email: ${email}`,
    `Check in: ${formData.get("checkIn")}`,
    `Check out: ${formData.get("checkOut")}`,
    `Guests: ${guests} ${guestLabel}`,
    note ? `Note: ${note}` : ""
  ].filter(Boolean).join("\n");
  const channel = event.submitter && event.submitter.value;
  const isTelegram = channel === "telegram";
  const contactUrl = isTelegram
    ? `https://t.me/jabaone?text=${encodeURIComponent(message)}`
    : `https://wa.me/2510900368205?text=${encodeURIComponent(message)}`;

  window.open(contactUrl, "_blank", "noopener,noreferrer");
  bookingMessage.replaceChildren();
  bookingMessage.append(
    document.createTextNode(`Your ${isTelegram ? "Telegram" : "WhatsApp"} message is ready to review and send. `)
  );

  const fallbackLink = document.createElement("a");
  fallbackLink.href = contactUrl;
  fallbackLink.target = "_blank";
  fallbackLink.rel = "noreferrer";
  fallbackLink.textContent = `Open ${isTelegram ? "Telegram" : "WhatsApp"}`;
  bookingMessage.append(fallbackLink);
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isOpen);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    navigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

document.querySelector("#year").textContent = new Date().getFullYear();
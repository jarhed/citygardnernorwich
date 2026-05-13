"use client";

import { useEffect, useRef, useState } from "react";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  useEffect(() => {
    const nav = document.querySelector(".site-nav");
    if (!nav) return;
    nav.classList.toggle("active", open);
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onLinkClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest(".site-nav a")) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onLinkClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onLinkClick);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        className={`mobile-menu-toggle ${open ? "active" : ""}`}
        aria-label="Toggle navigation menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div
        className={`menu-overlay ${open ? "active" : ""}`}
        onClick={() => setOpen(false)}
      />
    </>
  );
}

export function ContactModal() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest(".get-in-touch-btn")) {
        e.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
    setTimeout(() => setSubmitted(false), 500);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const subject = encodeURIComponent("Website enquiry from " + (data.get("name") || ""));
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nPhone: ${data.get("phone") || ""}\n\n${data.get("message")}`
    );
    window.location.href = `mailto:kate@citygardenernorwich.co.uk?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setTimeout(close, 3000);
  }

  return (
    <div
      className={`contact-modal ${open ? "active" : ""}`}
      id="contactModal"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="modal-content">
        <span className="modal-close" onClick={close}>
          &times;
        </span>

        <div className="modal-leaf-divider">
          <img src="/images/leaf_outline_teal.svg" alt="" />
        </div>

        <h2 className="modal-title">Let&apos;s be buds!</h2>
        <p className="modal-description">
          Get in touch if you are curious about anything or would like to request a quote
        </p>

        {submitted ? (
          <div className="form-success" style={{ textAlign: "center", padding: "30px 0" }}>
            <p>Thank you! Your email client should now be open with your message ready to send.</p>
          </div>
        ) : (
          <form className="modal-form" ref={formRef} onSubmit={handleSubmit}>
            <div className="modal-form-group">
              <input type="text" name="name" placeholder="Name" required />
            </div>
            <div className="modal-form-group">
              <input type="email" name="email" placeholder="Email Address" required />
            </div>
            <div className="modal-form-group">
              <input type="tel" name="phone" placeholder="Phone Number (Optional)" />
            </div>
            <div className="modal-form-group">
              <textarea name="message" placeholder="Message" rows={5} required />
            </div>
            <button type="submit" className="modal-submit-btn">
              SEND MESSAGE
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

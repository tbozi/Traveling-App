// utils/email.ts
// Helper gửi email thông qua EmailJS (REST API).
// Bạn cần tạo tài khoản tại https://www.emailjs.com/ và lấy:
// - SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY (user id)
// Thay các hằng bên dưới bằng giá trị thực trước khi chạy.

export const EMAILJS_SERVICE_ID = "REPLACE_ME_SERVICE_ID";
export const EMAILJS_TEMPLATE_ID = "REPLACE_ME_TEMPLATE_ID";
export const EMAILJS_PUBLIC_KEY = "REPLACE_ME_PUBLIC_KEY";

// template params sẽ được gửi dưới dạng object
export async function sendEmail(templateParams: Record<string, any>) {
  const url = "https://api.emailjs.com/api/v1.0/email/send";

  const payload = {
    service_id: EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID,
    user_id: EMAILJS_PUBLIC_KEY,
    template_params: templateParams,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.warn("EmailJS non-ok response:", res.status, text);
      throw new Error("Email send failed");
    }

    return true;
  } catch (err) {
    console.error("sendEmail error:", err);
    return false;
  }
}

import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const phone = String(body?.phone || "").trim();
    const restaurantName = String(body?.restaurantName || "").trim();
    const message = String(body?.message || "").trim();

    if (!name || !email || !phone || !restaurantName) {
      return NextResponse.json(
        {
          error: "Please fill in your name, email, phone, and restaurant name.",
        },
        { status: 400 },
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;
    const smtpTo = process.env.SMTP_TO || "menufy@tripittoday.com";

    if (!smtpHost || !smtpUser || !smtpPass || !smtpFrom) {
      return NextResponse.json(
        {
          error:
            "The mail service is not configured yet. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM in your environment.",
        },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.verify();

    const mailText = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Restaurant: ${restaurantName}`,
      `Message: ${message || "No additional notes provided."}`,
    ].join("\n");

    const mailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #2f2a25;">
        <h2 style="color: #8b2323;">New demo request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Restaurant:</strong> ${restaurantName}</p>
        <p><strong>Message:</strong> ${message || "No additional notes provided."}</p>
      </div>
    `;

    await transporter.sendMail({
      from: smtpFrom,
      to: smtpTo,
      subject: `New demo request from ${name}`,
      text: mailText,
      html: mailHtml,
    });

    return NextResponse.json({
      success: true,
      message:
        "Your demo request has been received. We will contact you shortly.",
    });
  } catch (error) {
    console.error("Book demo route error", error);
    return NextResponse.json(
      {
        error:
          "We could not submit your request right now. Please email us directly at menufy@tripittoday.com.",
      },
      { status: 500 },
    );
  }
}

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

function getDate() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
}

function getHTML(bodyList) {
  const listItems = bodyList
    .map(
      (item) =>
        `<li><div>${item.company}</div> <div><a href="${item.url}" rel="noreferrer">${item.price}</a></div></li>`
    )
    .join("");
  const htmContent = `
    <div>
      <h4>TV Price</h4> 
      <ul>
        ${listItems}
      </ul>
    </div> 
  `;
  return htmContent;
}

function getMailOptions(body) {
  const htmlContent = getHTML(body);
  const mailOptions = {
    from: {
      name: `TV Price: ${getDate()}`,
      address: process.env.EMAIL_USERNAME,
    },
    to: [process.env.EMAIL_SEND_TO],
    subject: `TV price list: ${getDate()}`,
    text: "No text for now",
    html: htmlContent,
  };

  return mailOptions;
}

export default async function sendEmail(emailData) {
  const mailOptions = getMailOptions(emailData);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
  }
}

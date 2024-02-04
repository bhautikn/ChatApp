const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config()

const mailOptions = {
    service: "Gmail",
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secureConnection: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
};
const emailTemplate = {
    subject: "invitation for private chat",
    body_html: `
        Hello, <br> 
        You have invited for private chat <br> 
        <a href='{chat_link}' > {chat_link} </a> <br>
        comment from sender: {comment} <br> 
        <br> Thanks, <br> sitename Team`,
}

exports.mailSender = async (body) => {
    try {
        let template = await getEmailTemplate(emailTemplate, body)
        let sendMail = await this.SendMail(template, body.email)
    } catch (error) {
        console.log(error)
    }
}

exports.SendMail = (
    emailInforamtion,
    email
) => {
    return new Promise(async (resolve, reject) => {
        // create transporter for sending mail
        try {

            let transporter = nodemailer.createTransport(mailOptions);
            let mailObj = {
                from: `noreply@sitename.com`,
                to: `<${email}>`,
                subject: emailInforamtion.subject,
                html: emailInforamtion.updatedTemplate,
            };
            await transporter
                .sendMail(mailObj)
                .then((mailRes) => {
                    console.log("EMAIL sent: ", mailRes.messageId)
                    resolve({ status: true, msgId: mailRes.messageId });
                })
                .catch((err) => { console.log("Error while sending mail:", err); reject(err) });
            return true
        } catch (error) {
            console.log("Error while sending mail:", error)
        }
    });
};

let getEmailTemplate = async (emailTemplate, body) => {
    try {
        let html = emailTemplate.body_html;
        let template = html.replaceAll("{chat_link}", body.chat_link);
        template = template.replace("{comment}", body.comment);

        let updatedEmailInfo = {
            subject: emailTemplate.subject,
            updatedTemplate: template,
        };
        return updatedEmailInfo
    } catch (error) {
        console.log("ERROR in gettting template:", error)
    }
}